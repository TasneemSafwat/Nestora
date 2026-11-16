import type { Agent } from '../types';
import { getState, logActivity, mutate } from './database';
import { propertiesForAgent, reassignProperties } from './propertyService';
import { uid } from '../lib/utils';

/** Fields a dashboard form is allowed to write. */
export type AgentDraft = Omit<Agent, 'id' | 'joinedAt'> & {
  id?: string;
  joinedAt?: string;
};

export interface AgentCriteria {
  q: string;
  specialty: string;
  cityId: string;
  language: string;
}

export const DEFAULT_AGENT_CRITERIA: AgentCriteria = {
  q: '',
  specialty: '',
  cityId: '',
  language: '',
};

/* -------------------------------------------------------------------------- */
/*                              Read operations                                */
/* -------------------------------------------------------------------------- */

export function allAgents(): Agent[] {
  return getState().agents;
}

export function getAgent(id: string): Agent | undefined {
  return getState().agents.find((agent) => agent.id === id);
}

export function featuredAgents(): Agent[] {
  return getState()
    .agents.filter((agent) => agent.featured)
    .slice(0, 4);
}

export function agentListingCount(agentId: string): number {
  return propertiesForAgent(agentId).length;
}

function matchesQuery(agent: Agent, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    agent.name.en,
    agent.name.ar,
    agent.title.en,
    agent.title.ar,
    ...agent.specialties,
    ...agent.languages,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterAgents(list: Agent[], criteria: AgentCriteria): Agent[] {
  return list.filter((agent) => {
    if (!matchesQuery(agent, criteria.q)) return false;
    if (criteria.specialty && !agent.specialties.includes(criteria.specialty)) return false;
    if (criteria.cityId && !agent.cityIds.includes(criteria.cityId)) return false;
    if (criteria.language && !agent.languages.includes(criteria.language)) return false;
    return true;
  });
}

export function sortAgents(list: Agent[]): Agent[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (b.dealsClosed !== a.dealsClosed) return b.dealsClosed - a.dealsClosed;
    return b.experienceYears - a.experienceYears;
  });
}

export function queryAgents(list: Agent[], criteria: AgentCriteria): Agent[] {
  return sortAgents(filterAgents(list, criteria));
}

/** Languages actually spoken across the team, used by the directory filter. */
export function agentLanguages(list: Agent[]): string[] {
  return Array.from(new Set(list.flatMap((agent) => agent.languages))).sort();
}

/* -------------------------------------------------------------------------- */
/*                             Write operations                                */
/* -------------------------------------------------------------------------- */

export function createAgent(draft: AgentDraft): Agent {
  const agent: Agent = {
    ...draft,
    id: uid('ag'),
    specialties: [...draft.specialties],
    languages: [...draft.languages],
    cityIds: [...draft.cityIds],
    joinedAt: draft.joinedAt || new Date().toISOString().slice(0, 10),
  };

  mutate((current) => ({ agents: [agent, ...current.agents] }));
  logActivity('agent', 'admin.activity.agentCreated', agent.name.en || agent.name.ar);
  return agent;
}

export function updateAgent(id: string, draft: AgentDraft): Agent | undefined {
  const existing = getAgent(id);
  if (!existing) return undefined;

  const updated: Agent = {
    ...existing,
    ...draft,
    id,
    specialties: [...draft.specialties],
    languages: [...draft.languages],
    cityIds: [...draft.cityIds],
    joinedAt: existing.joinedAt,
  };

  mutate((current) => ({
    agents: current.agents.map((agent) => (agent.id === id ? updated : agent)),
  }));
  logActivity('agent', 'admin.activity.agentUpdated', updated.name.en || updated.name.ar);
  return updated;
}

/**
 * Removes a consultant. Their listings are handed to the first remaining
 * consultant so no property is left without an owner.
 */
export function deleteAgent(id: string): void {
  const agent = getAgent(id);
  const replacement = getState().agents.find((item) => item.id !== id);

  if (replacement) {
    reassignProperties(id, replacement.id);
  }

  mutate((current) => ({ agents: current.agents.filter((item) => item.id !== id) }));

  if (agent) {
    logActivity('agent', 'admin.activity.agentDeleted', agent.name.en || agent.name.ar);
  }
}
