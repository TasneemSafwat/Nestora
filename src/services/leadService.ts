import type {
  ContactMessage,
  Inquiry,
  InquiryStatus,
  ValuationRequest,
  ValuationStatus,
  ViewingRequest,
  ViewingStatus,
} from '../types';
import { getState, logActivity, mutate } from './database';
import { uid } from '../lib/utils';

/* -------------------------------------------------------------------------- */
/*                              Inquiry records                                */
/* -------------------------------------------------------------------------- */

export type NewInquiry = Omit<Inquiry, 'id' | 'createdAt' | 'status'> & { status?: InquiryStatus };

export function allInquiries(): Inquiry[] {
  return getState().inquiries;
}

export function createInquiry(input: NewInquiry): Inquiry {
  const inquiry: Inquiry = {
    ...input,
    id: uid('inq'),
    status: input.status ?? 'new',
    createdAt: new Date().toISOString(),
  };
  mutate((current) => ({ inquiries: [inquiry, ...current.inquiries] }));
  logActivity('inquiry', 'admin.activity.inquiryCreated', inquiry.fullName);
  return inquiry;
}

export function setInquiryStatus(id: string, status: InquiryStatus): void {
  const inquiry = getState().inquiries.find((item) => item.id === id);
  if (!inquiry) return;
  mutate((current) => ({
    inquiries: current.inquiries.map((item) => (item.id === id ? { ...item, status } : item)),
  }));
  logActivity('inquiry', 'admin.activity.inquiryUpdated', `${inquiry.fullName} · ${status}`);
}

/* -------------------------------------------------------------------------- */
/*                             Viewing requests                                */
/* -------------------------------------------------------------------------- */

export type NewViewing = Omit<ViewingRequest, 'id' | 'createdAt' | 'status'> & {
  status?: ViewingStatus;
};

export function allViewings(): ViewingRequest[] {
  return getState().viewings;
}

export function createViewing(input: NewViewing): ViewingRequest {
  const viewing: ViewingRequest = {
    ...input,
    id: uid('vw'),
    status: input.status ?? 'pending',
    createdAt: new Date().toISOString(),
  };
  mutate((current) => ({ viewings: [viewing, ...current.viewings] }));
  logActivity('viewing', 'admin.activity.viewingCreated', viewing.fullName);
  return viewing;
}

export function setViewingStatus(id: string, status: ViewingStatus): void {
  const viewing = getState().viewings.find((item) => item.id === id);
  if (!viewing) return;
  mutate((current) => ({
    viewings: current.viewings.map((item) => (item.id === id ? { ...item, status } : item)),
  }));
  logActivity('viewing', 'admin.activity.viewingUpdated', `${viewing.fullName} · ${status}`);
}

/* -------------------------------------------------------------------------- */
/*                           Valuation requests                               */
/* -------------------------------------------------------------------------- */

export type NewValuation = Omit<ValuationRequest, 'id' | 'createdAt' | 'status'> & {
  status?: ValuationStatus;
};

export function allValuations(): ValuationRequest[] {
  return getState().valuations;
}

export function createValuation(input: NewValuation): ValuationRequest {
  const request: ValuationRequest = {
    ...input,
    id: uid('val'),
    status: input.status ?? 'new',
    createdAt: new Date().toISOString(),
  };
  mutate((current) => ({ valuations: [request, ...current.valuations] }));
  logActivity('valuation', 'admin.activity.valuationCreated', request.fullName);
  return request;
}

export function setValuationStatus(id: string, status: ValuationStatus): void {
  const request = getState().valuations.find((item) => item.id === id);
  if (!request) return;
  mutate((current) => ({
    valuations: current.valuations.map((item) => (item.id === id ? { ...item, status } : item)),
  }));
  logActivity('valuation', 'admin.activity.valuationUpdated', `${request.fullName} · ${status}`);
}

/* -------------------------------------------------------------------------- */
/*                             Contact messages                               */
/* -------------------------------------------------------------------------- */

export type NewMessage = Omit<ContactMessage, 'id' | 'createdAt' | 'status'> & {
  status?: InquiryStatus;
};

export function allMessages(): ContactMessage[] {
  return getState().messages;
}

export function createMessage(input: NewMessage): ContactMessage {
  const message: ContactMessage = {
    ...input,
    id: uid('msg'),
    status: input.status ?? 'new',
    createdAt: new Date().toISOString(),
  };
  mutate((current) => ({ messages: [message, ...current.messages] }));
  logActivity('inquiry', 'admin.activity.inquiryCreated', message.fullName);
  return message;
}

export function setMessageStatus(id: string, status: InquiryStatus): void {
  mutate((current) => ({
    messages: current.messages.map((item) => (item.id === id ? { ...item, status } : item)),
  }));
}

/* -------------------------------------------------------------------------- */
/*                                Aggregates                                  */
/* -------------------------------------------------------------------------- */

export interface LeadMetrics {
  inquiries: number;
  newInquiries: number;
  pendingViewings: number;
  valuations: number;
  newValuations: number;
  messages: number;
  newMessages: number;
}

export function leadMetrics(): LeadMetrics {
  const { inquiries, viewings, valuations, messages } = getState();
  return {
    inquiries: inquiries.length,
    newInquiries: inquiries.filter((item) => item.status === 'new').length,
    pendingViewings: viewings.filter((item) => item.status === 'pending').length,
    valuations: valuations.length,
    newValuations: valuations.filter((item) => item.status === 'new').length,
    messages: messages.length,
    newMessages: messages.filter((item) => item.status === 'new').length,
  };
}

export interface MonthlyPoint {
  /** ISO month key, e.g. `2026-07`. */
  key: string;
  date: string;
  inquiries: number;
  viewings: number;
}

/** Last eight months of inquiry and viewing volume, used by the dashboard chart. */
export function monthlyActivity(months = 8): MonthlyPoint[] {
  const { inquiries, viewings } = getState();
  const now = new Date();
  const points: MonthlyPoint[] = [];

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    points.push({
      key,
      date: date.toISOString(),
      inquiries: inquiries.filter((item) => item.createdAt.slice(0, 7) === key).length,
      viewings: viewings.filter((item) => item.createdAt.slice(0, 7) === key).length,
    });
  }

  return points;
}
