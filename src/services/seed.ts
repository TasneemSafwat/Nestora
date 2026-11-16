import type {
  ActivityEntry,
  ContactMessage,
  Inquiry,
  PropertyType,
  ValuationRequest,
  ViewingRequest,
} from '../types';

/**
 * Seed leads. The admin dashboard would be empty on a first visit otherwise —
 * these records give the tables, charts and status controls something real to
 * work with. All entries are fictional.
 */

export const SEED_VERSION = 'nestora-seed-v1';

function iso(daysAgo: number, hour = 10, minute = 15): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function futureIso(daysAhead: number, hour = 17): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

const p = (
  fullName: string,
  email: string,
  phone: string,
  message: string,
  daysAgo: number
): { fullName: string; email: string; phone: string; message: string; createdAt: string } => ({
  fullName,
  email,
  phone,
  message,
  createdAt: iso(daysAgo, 9 + (daysAgo % 8), (daysAgo * 7) % 60),
});

export const seedInquiries: Inquiry[] = [
  {
    id: 'inq-001',
    ...p(
      'Khalid Al-Otaibi',
      'khalid.alotaibi@example.com',
      '+966 55 214 8890',
      'We are relocating from Dammam and would like to view the Al Malqa villa this week if possible. Budget is flexible for the right property.',
      5
    ),
    propertyId: 'p-001',
    agentId: 'ag-sarah-alotaibi',
    status: 'new',
  },
  {
    id: 'inq-002',
    ...p(
      'Maha Al-Suwailem',
      'maha.s@example.com',
      '+966 53 118 2244',
      'Is the penthouse in Al Yasmin still available? I would like to understand the service charges before arranging a viewing.',
      9
    ),
    propertyId: 'p-004',
    agentId: 'ag-abdullah-alharbi',
    status: 'contacted',
  },
  {
    id: 'inq-003',
    ...p(
      'Yousef Al-Dossary',
      'yousef.d@example.com',
      '+966 50 776 3311',
      'Interested in the waterfront penthouse on Al Shati. Could you confirm whether the furniture package is included in the price?',
      14
    ),
    propertyId: 'p-010',
    agentId: 'ag-noura-alqahtani',
    status: 'qualified',
  },
  {
    id: 'inq-004',
    ...p(
      'Lama Al-Rashid',
      'lama.rashid@example.com',
      '+966 56 340 7712',
      'Looking for a three-bedroom rental close to international schools in Jeddah. Flexible on the start date.',
      21
    ),
    propertyId: 'p-013',
    agentId: 'ag-noura-alqahtani',
    status: 'new',
  },
  {
    id: 'inq-005',
    ...p(
      'Turki Al-Shammari',
      'turki.alshammari@example.com',
      '+966 54 902 1180',
      'We own two commercial units nearby and would like to discuss the commercial floor in Hittin as a possible head office.',
      34
    ),
    propertyId: 'p-009',
    agentId: 'ag-mohammed-alshehri',
    status: 'contacted',
  },
  {
    id: 'inq-006',
    ...p(
      'Hind Al-Johani',
      'hind.johani@example.com',
      '+966 59 445 6690',
      'Please send the full floor plan and the plot dimensions for the Al Narjis land. We are ready to move quickly if the numbers work.',
      48
    ),
    propertyId: 'p-006',
    agentId: 'ag-abdullah-alharbi',
    status: 'closed',
  },
  {
    id: 'inq-007',
    ...p(
      'Omar Baeshen',
      'omar.baeshen@example.com',
      '+966 55 660 1187',
      'I would like to understand the expected rental yield on the Al Yasmin apartment before making an offer.',
      62
    ),
    propertyId: 'p-007',
    agentId: 'ag-sarah-alotaibi',
    status: 'qualified',
  },
  {
    id: 'inq-008',
    ...p(
      'Rana Al-Malki',
      'rana.almalki@example.com',
      '+966 58 221 4409',
      'Is the garden villa in Al Bandariyah suitable for a family with young children? We would also like to know about the neighbourhood.',
      78
    ),
    propertyId: 'p-017',
    agentId: 'ag-mohammed-alshehri',
    status: 'closed',
  },
  {
    id: 'inq-009',
    ...p(
      'Bader Al-Zahrani',
      'bader.z@example.com',
      '+966 50 118 9922',
      'Enquiring about the commercial building in Al Shulah. We would like the tenancy schedule and the current rent roll.',
      104
    ),
    propertyId: 'p-022',
    agentId: 'ag-mohammed-alshehri',
    status: 'contacted',
  },
  {
    id: 'inq-010',
    ...p(
      'Dana Al-Fahad',
      'dana.alfahad@example.com',
      '+966 56 774 3301',
      'We are looking for a family villa in Al Aqeeq with a garden. Would you have anything similar if this one is under offer?',
      131
    ),
    propertyId: 'p-025',
    agentId: 'ag-sarah-alotaibi',
    status: 'qualified',
  },
  {
    id: 'inq-011',
    ...p(
      'Nawaf Al-Anzi',
      'nawaf.anzi@example.com',
      '+966 53 990 4412',
      'Interested in the Al Aqrabiyah seafront apartment for a twelve-month lease starting next month.',
      158
    ),
    propertyId: 'p-016',
    agentId: 'ag-reem-aldosari',
    status: 'closed',
  },
  {
    id: 'inq-012',
    ...p(
      'Ghada Al-Tamimi',
      'ghada.tamimi@example.com',
      '+966 55 330 2277',
      'Could you tell me whether the Al Malqa garden apartment allows pets? That is the deciding factor for us.',
      186
    ),
    propertyId: 'p-003',
    agentId: 'ag-sarah-alotaibi',
    status: 'contacted',
  },
];

export const seedViewings: ViewingRequest[] = [
  {
    id: 'vw-001',
    fullName: 'Khalid Al-Otaibi',
    email: 'khalid.alotaibi@example.com',
    phone: '+966 55 214 8890',
    message: 'Evening viewing preferred — we are travelling from Dammam.',
    createdAt: iso(4, 11, 5),
    propertyId: 'p-001',
    agentId: 'ag-sarah-alotaibi',
    preferredDate: futureIso(3),
    preferredTime: '18:30',
    status: 'pending',
  },
  {
    id: 'vw-002',
    fullName: 'Maha Al-Suwailem',
    email: 'maha.s@example.com',
    phone: '+966 53 118 2244',
    message: 'Second viewing, this time with my father.',
    createdAt: iso(7, 14, 40),
    propertyId: 'p-004',
    agentId: 'ag-abdullah-alharbi',
    preferredDate: futureIso(5),
    preferredTime: '17:00',
    status: 'scheduled',
  },
  {
    id: 'vw-003',
    fullName: 'Yousef Al-Dossary',
    email: 'yousef.d@example.com',
    phone: '+966 50 776 3311',
    message: 'Would like to see the terrace at sunset if the schedule allows.',
    createdAt: iso(11, 10, 12),
    propertyId: 'p-010',
    agentId: 'ag-noura-alqahtani',
    preferredDate: futureIso(1),
    preferredTime: '17:45',
    status: 'scheduled',
  },
  {
    id: 'vw-004',
    fullName: 'Turki Al-Shammari',
    email: 'turki.alshammari@example.com',
    phone: '+966 54 902 1180',
    message: 'Bringing our facilities manager to assess the floor plate.',
    createdAt: iso(26, 9, 30),
    propertyId: 'p-009',
    agentId: 'ag-mohammed-alshehri',
    preferredDate: futureIso(-6),
    preferredTime: '11:00',
    status: 'completed',
  },
  {
    id: 'vw-005',
    fullName: 'Lama Al-Rashid',
    email: 'lama.rashid@example.com',
    phone: '+966 56 340 7712',
    message: 'Available any weekday after 16:00.',
    createdAt: iso(19, 16, 20),
    propertyId: 'p-013',
    agentId: 'ag-noura-alqahtani',
    preferredDate: futureIso(-12),
    preferredTime: '16:30',
    status: 'completed',
  },
  {
    id: 'vw-006',
    fullName: 'Rana Al-Malki',
    email: 'rana.almalki@example.com',
    phone: '+966 58 221 4409',
    message: 'We had to postpone — please suggest another slot next week.',
    createdAt: iso(55, 13, 10),
    propertyId: 'p-017',
    agentId: 'ag-mohammed-alshehri',
    preferredDate: futureIso(-40),
    preferredTime: '12:00',
    status: 'cancelled',
  },
  {
    id: 'vw-007',
    fullName: 'Dana Al-Fahad',
    email: 'dana.alfahad@example.com',
    phone: '+966 56 774 3301',
    message: 'Interested in the garden and the neighbouring streets.',
    createdAt: iso(2, 8, 45),
    propertyId: 'p-025',
    agentId: 'ag-sarah-alotaibi',
    preferredDate: futureIso(6),
    preferredTime: '10:30',
    status: 'pending',
  },
  {
    id: 'vw-008',
    fullName: 'Nawaf Al-Anzi',
    email: 'nawaf.anzi@example.com',
    phone: '+966 53 990 4412',
    message: 'Flexible on time, prefer mornings.',
    createdAt: iso(6, 12, 5),
    propertyId: 'p-016',
    agentId: 'ag-reem-aldosari',
    preferredDate: futureIso(4),
    preferredTime: '09:30',
    status: 'pending',
  },
];

const valuation = (
  id: string,
  data: {
    fullName: string;
    email: string;
    phone: string;
    message: string;
    daysAgo: number;
    propertyType: PropertyType;
    cityId: string;
    districtId: string;
    area: number;
    bedrooms: number;
    condition: ValuationRequest['condition'];
    expectedPrice: number | null;
    status: ValuationRequest['status'];
  }
): ValuationRequest => ({
  id,
  fullName: data.fullName,
  email: data.email,
  phone: data.phone,
  message: data.message,
  createdAt: iso(data.daysAgo, 11, 0),
  propertyType: data.propertyType,
  cityId: data.cityId,
  districtId: data.districtId,
  area: data.area,
  bedrooms: data.bedrooms,
  condition: data.condition,
  expectedPrice: data.expectedPrice,
  status: data.status,
});

export const seedValuations: ValuationRequest[] = [
  valuation('val-001', {
    fullName: 'Fahad Al-Qahtani',
    email: 'fahad.q@example.com',
    phone: '+966 55 887 1120',
    message: 'Villa was renovated in 2024 — new kitchen and full rewire. No tenants currently.',
    daysAgo: 3,
    propertyType: 'villa',
    cityId: 'riyadh',
    districtId: 'hittin',
    area: 480,
    bedrooms: 5,
    condition: 'excellent',
    expectedPrice: 7800000,
    status: 'new',
  }),
  valuation('val-002', {
    fullName: 'Amal Al-Sudairi',
    email: 'amal.sudairi@example.com',
    phone: '+966 53 440 8871',
    message: 'Inherited apartment, never rented. Looking for a realistic number before deciding whether to sell.',
    daysAgo: 8,
    propertyType: 'apartment',
    cityId: 'jeddah',
    districtId: 'al-zahra',
    area: 195,
    bedrooms: 3,
    condition: 'good',
    expectedPrice: null,
    status: 'in-review',
  }),
  valuation('val-003', {
    fullName: 'Saleh Al-Balawi',
    email: 'saleh.balawi@example.com',
    phone: '+966 50 229 7781',
    message: 'Two identical units in the same building — would like both valued together.',
    daysAgo: 17,
    propertyType: 'apartment',
    cityId: 'khobar',
    districtId: 'al-aqrabiyah',
    area: 165,
    bedrooms: 2,
    condition: 'excellent',
    expectedPrice: 1450000,
    status: 'appraised',
  }),
  valuation('val-004', {
    fullName: 'Nouf Al-Harbi',
    email: 'nouf.harbi@example.com',
    phone: '+966 56 991 3340',
    message: 'Land with two street frontages. Interested in what it could achieve for a small residential building.',
    daysAgo: 29,
    propertyType: 'land',
    cityId: 'dammam',
    districtId: 'al-faisaliyah',
    area: 1100,
    bedrooms: 0,
    condition: 'good',
    expectedPrice: 4200000,
    status: 'appraised',
  }),
  valuation('val-005', {
    fullName: 'Ibrahim Al-Ghamdi',
    email: 'ibrahim.g@example.com',
    phone: '+966 54 118 9920',
    message: 'Townhouse needs some work on the roof. Please factor that in.',
    daysAgo: 41,
    propertyType: 'townhouse',
    cityId: 'riyadh',
    districtId: 'al-narjis',
    area: 260,
    bedrooms: 4,
    condition: 'needs-work',
    expectedPrice: 1900000,
    status: 'closed',
  }),
  valuation('val-006', {
    fullName: 'Huda Al-Mutairi',
    email: 'huda.mutairi@example.com',
    phone: '+966 58 330 4417',
    message: 'Family villa in Madinah, occupied by tenants on an annual contract until next year.',
    daysAgo: 64,
    propertyType: 'villa',
    cityId: 'madinah',
    districtId: 'al-aqeeq',
    area: 430,
    bedrooms: 5,
    condition: 'excellent',
    expectedPrice: 3300000,
    status: 'closed',
  }),
];

export const seedMessages: ContactMessage[] = [
  {
    id: 'msg-001',
    fullName: 'Mansour Al-Dawood',
    email: 'mansour.d@example.com',
    phone: '+966 55 771 2290',
    subject: 'Property management for six units',
    message:
      'I own six apartments in Khobar and handle everything myself at the moment. I would like to understand your management service and the fees involved.',
    createdAt: iso(2, 9, 25),
    status: 'new',
  },
  {
    id: 'msg-002',
    fullName: 'Lujain Al-Saleh',
    email: 'lujain.saleh@example.com',
    phone: '+966 53 220 6671',
    subject: 'Buying a first home',
    message:
      'My husband and I are buying our first apartment. We would appreciate a conversation about what is realistic within our budget rather than a list of listings.',
    createdAt: iso(6, 15, 40),
    status: 'new',
  },
  {
    id: 'msg-003',
    fullName: 'Adel Al-Rashidi',
    email: 'adel.rashidi@example.com',
    phone: '+966 50 448 1120',
    subject: 'Commercial leasing question',
    message:
      'We need 400–600 sqm of office space in Riyadh with at least fifteen parking bays. Is there anything coming to market in the next quarter?',
    createdAt: iso(15, 11, 5),
    status: 'contacted',
  },
  {
    id: 'msg-004',
    fullName: 'Wafa Al-Sulaiman',
    email: 'wafa.sulaiman@example.com',
    phone: '+966 56 118 7734',
    subject: 'Selling a family property',
    message:
      'We are three siblings selling a villa we inherited in Jeddah. Could you explain how you would handle the process and the paperwork?',
    createdAt: iso(33, 14, 15),
    status: 'qualified',
  },
  {
    id: 'msg-005',
    fullName: 'Ziyad Al-Harthy',
    email: 'ziyad.harthy@example.com',
    phone: '+966 54 660 8892',
    subject: 'General question',
    message: 'Do you work with buyers based outside Saudi Arabia? I am currently in Dubai and buying remotely.',
    createdAt: iso(72, 10, 50),
    status: 'closed',
  },
];

/** A short history so the recent-activity panel is not empty on first load. */
export const seedActivity: ActivityEntry[] = [
  {
    id: 'act-001',
    kind: 'inquiry',
    labelKey: 'admin.activity.inquiryCreated',
    subject: 'Khalid Al-Otaibi · NST-4102',
    createdAt: iso(5, 9, 15),
  },
  {
    id: 'act-002',
    kind: 'viewing',
    labelKey: 'admin.activity.viewingCreated',
    subject: 'Khalid Al-Otaibi · NST-4102',
    createdAt: iso(4, 11, 5),
  },
  {
    id: 'act-003',
    kind: 'valuation',
    labelKey: 'admin.activity.valuationCreated',
    subject: 'Fahad Al-Qahtani · Hittin',
    createdAt: iso(3, 11, 0),
  },
  {
    id: 'act-004',
    kind: 'inquiry',
    labelKey: 'admin.activity.inquiryUpdated',
    subject: 'Maha Al-Suwailem · NST-4066',
    createdAt: iso(7, 16, 20),
  },
  {
    id: 'act-005',
    kind: 'property',
    labelKey: 'admin.activity.propertyCreated',
    subject: 'Off-plan Residence in Hittin',
    createdAt: iso(11, 12, 30),
  },
  {
    id: 'act-006',
    kind: 'agent',
    labelKey: 'admin.activity.agentUpdated',
    subject: 'Reem Al-Dosari',
    createdAt: iso(18, 15, 45),
  },
  {
    id: 'act-007',
    kind: 'inquiry',
    labelKey: 'admin.activity.inquiryCreated',
    subject: 'Omar Baeshen · NST-4038',
    createdAt: iso(62, 10, 10),
  },
  {
    id: 'act-008',
    kind: 'viewing',
    labelKey: 'admin.activity.viewingUpdated',
    subject: 'Turki Al-Shammari · NST-4018',
    createdAt: iso(24, 14, 5),
  },
];
