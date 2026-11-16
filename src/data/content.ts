import type { ServiceItem, StatItem, Testimonial } from '../types';

/* -------------------------------------------------------------------------- */
/*                                  Services                                   */
/* -------------------------------------------------------------------------- */

export const services: ServiceItem[] = [
  {
    id: 'buying',
    icon: 'KeyRound',
    title: { en: 'Buying Properties', ar: 'شراء العقارات' },
    description: {
      en: 'We shortlist against how you actually live, verify every document, and negotiate on your behalf until the terms are right.',
      ar: 'نضع قائمة مختصرة بحسب طريقة حياتك الفعلية، ونتحقق من كل مستند، ونتفاوض نيابة عنك حتى تصبح الشروط مناسبة.',
    },
    points: [
      { en: 'Curated shortlists, not endless listings', ar: 'قوائم مختارة بعناية لا قوائم لا تنتهي' },
      { en: 'Title deed and permit verification', ar: 'التحقق من الصك والتراخيص' },
      { en: 'Negotiation and price benchmarking', ar: 'التفاوض ومقارنة الأسعار بالسوق' },
      { en: 'Support until the deed is transferred', ar: 'مرافقة حتى نقل الملكية' },
    ],
  },
  {
    id: 'renting',
    icon: 'Home',
    title: { en: 'Renting Properties', ar: 'استئجار العقارات' },
    description: {
      en: 'Short-term and annual leasing with properly drafted contracts, clear payment terms and a single point of contact for maintenance.',
      ar: 'تأجير قصير الأمد وسنوي بعقود مصاغة بدقة وشروط دفع واضحة ونقطة تواصل واحدة للصيانة.',
    },
    points: [
      { en: 'Verified listings with real availability', ar: 'عروض موثقة بتوفر حقيقي' },
      { en: 'Tenancy contracts reviewed line by line', ar: 'مراجعة عقد الإيجار سطرًا بسطر' },
      { en: 'Move-in inspection and handover report', ar: 'معاينة الاستلام وتقرير التسليم' },
      { en: 'Ongoing landlord and tenant support', ar: 'دعم مستمر للمالك والمستأجر' },
    ],
  },
  {
    id: 'selling',
    icon: 'TrendingUp',
    title: { en: 'Selling Properties', ar: 'بيع العقارات' },
    description: {
      en: 'A measured valuation, professional photography and a targeted buyer list, with weekly reporting until the sale completes.',
      ar: 'تقييم مدروس وتصوير احترافي وقائمة مشترين مستهدفة، مع تقارير أسبوعية حتى إتمام البيع.',
    },
    points: [
      { en: 'Evidence-based valuation report', ar: 'تقرير تقييم مبني على أدلة السوق' },
      { en: 'Photography, floor plans and copywriting', ar: 'تصوير ومخططات وكتابة المحتوى' },
      { en: 'Direct outreach to serious buyers', ar: 'تواصل مباشر مع المشترين الجادين' },
      { en: 'Weekly progress reporting', ar: 'تقرير تقدم أسبوعي' },
    ],
  },
  {
    id: 'consultation',
    icon: 'Compass',
    title: { en: 'Property Consultation', ar: 'الاستشارات العقارية' },
    description: {
      en: 'One focused session on a specific decision: what to buy, what to hold, what a plot can realistically become.',
      ar: 'جلسة مركّزة حول قرار محدد: ماذا تشتري، وما الذي تحتفظ به، وما يمكن أن تصبح عليه قطعة الأرض فعليًا.',
    },
    points: [
      { en: 'District-level market context', ar: 'قراءة سوق على مستوى الحي' },
      { en: 'Yield and holding-cost modelling', ar: 'تحليل العائد وتكاليف الاحتفاظ' },
      { en: 'Development and zoning guidance', ar: 'إرشاد للتطوير والاشتراطات' },
      { en: 'A written summary after the session', ar: 'ملخص مكتوب بعد الجلسة' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Stats                                     */
/* -------------------------------------------------------------------------- */

/** Demonstration figures for this showcase website — not audited company data. */
export const stats: StatItem[] = [
  { id: 'years', value: 18, suffix: '+', label: { en: 'Years in the market', ar: 'عامًا في السوق' } },
  { id: 'properties', value: 2400, suffix: '+', label: { en: 'Properties handled', ar: 'عقار تم التعامل معه' } },
  { id: 'clients', value: 1750, suffix: '+', label: { en: 'Clients guided', ar: 'عميل تمت مرافقته' } },
  { id: 'cities', value: 6, suffix: '', label: { en: 'Cities covered', ar: 'مدن مغطاة' } },
];

/* -------------------------------------------------------------------------- */
/*                                Testimonials                                 */
/* -------------------------------------------------------------------------- */

/**
 * Clearly labelled demonstration testimonials. These are fictional and exist
 * only to show the layout — no real client has been quoted.
 */
export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: { en: 'A. Al-Qahtani', ar: 'أ. القحطاني' },
    role: { en: 'First-time buyer · Riyadh', ar: 'مشترٍ لأول مرة · الرياض' },
    quote: {
      en: 'They showed me three properties instead of thirty, and each one made sense. The paperwork was explained before I signed anything, which mattered more to me than the price.',
      ar: 'عرضوا عليّ ثلاثة عقارات بدل ثلاثين، وكل واحد كان منطقيًا. شُرحت لي الأوراق قبل التوقيع، وهذا كان أهم عندي من السعر.',
    },
    cityId: 'riyadh',
    isDemo: true,
  },
  {
    id: 't-2',
    name: { en: 'M. Al-Ghamdi', ar: 'م. الغامدي' },
    role: { en: 'Investor · Jeddah', ar: 'مستثمر · جدة' },
    quote: {
      en: 'I asked for yield numbers and got a spreadsheet, not an opinion. One of the units they talked me out of would have been a mistake.',
      ar: 'طلبت أرقام العائد فحصلت على جدول واضح لا مجرد رأي. إحدى الوحدات التي نصحوني بتركها كانت ستكون خطأً.',
    },
    cityId: 'jeddah',
    isDemo: true,
  },
  {
    id: 't-3',
    name: { en: 'S. Al-Dosari', ar: 'س. الدوسري' },
    role: { en: 'Landlord · Khobar', ar: 'مالك عقار · الخبر' },
    quote: {
      en: 'My apartment was empty for four months before. They re-photographed it, told me honestly that my rent was too high, and it was leased within a month of the change.',
      ar: 'ظلت شقتي فارغة أربعة أشهر. أعادوا تصويرها، وقالوا لي بصراحة إن الإيجار مرتفع، وتأجرت خلال شهر من التعديل.',
    },
    cityId: 'khobar',
    isDemo: true,
  },
  {
    id: 't-4',
    name: { en: 'N. Al-Harbi', ar: 'ن. الحربي' },
    role: { en: 'Seller · Riyadh', ar: 'بائع · الرياض' },
    quote: {
      en: 'The valuation was lower than two other agents quoted me, but it was honest and the villa sold at very close to that number.',
      ar: 'كان التقييم أقل مما قدّمه لي وسيطان آخران، لكنه كان صادقًا، وبيعت الفيلا قريبًا جدًا من ذلك الرقم.',
    },
    cityId: 'riyadh',
    isDemo: true,
  },
  {
    id: 't-5',
    name: { en: 'H. Al-Zahrani', ar: 'ح. الزهراني' },
    role: { en: 'Tenant · Dammam', ar: 'مستأجر · الدمام' },
    quote: {
      en: 'Maintenance requests used to take weeks. Having one person to call, who actually follows up, changed the whole experience of renting here.',
      ar: 'كانت طلبات الصيانة تستغرق أسابيع. وجود شخص واحد للتواصل يتابع فعليًا غيّر تجربة الاستئجار بالكامل.',
    },
    cityId: 'dammam',
    isDemo: true,
  },
  {
    id: 't-6',
    name: { en: 'F. Al-Mutairi', ar: 'ف. المطيري' },
    role: { en: 'Family buyer · Madinah', ar: 'مشترٍ عائلي · المدينة المنورة' },
    quote: {
      en: 'We viewed on a Thursday evening because that was the only time we were all free. Nobody made that feel like a problem.',
      ar: 'زرنا العقار مساء الخميس لأن ذلك الوقت الوحيد الذي كنا متفرغين فيه جميعًا. ولم يعتبر أحد ذلك مشكلة.',
    },
    cityId: 'madinah',
    isDemo: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Company                                    */
/* -------------------------------------------------------------------------- */

export const company = {
  name: { en: 'NESTORA', ar: 'نستورا' },
  legalName: { en: 'NESTORA Real Estate', ar: 'نستورا للعقارات' },
  tagline: { en: 'Your place in the world, found properly.', ar: 'مكانك في العالم، يُختار بعناية.' },
  founded: 2008,
  headOffice: { en: 'King Fahd Road, Al Olaya, Riyadh', ar: 'طريق الملك فهد، العليا، الرياض' },
  branches: [
    { id: 'riyadh', label: { en: 'Riyadh — Head Office', ar: 'الرياض — المكتب الرئيسي' } },
    { id: 'jeddah', label: { en: 'Jeddah — Western Region', ar: 'جدة — المنطقة الغربية' } },
    { id: 'khobar', label: { en: 'Khobar — Eastern Region', ar: 'الخبر — المنطقة الشرقية' } },
  ],
  phone: '+966 11 200 4000',
  whatsapp: '+966 50 100 2000',
  email: 'hello@nestora-demo.sa',
  valuationsEmail: 'valuations@nestora-demo.sa',
  workingHours: {
    en: 'Sunday – Thursday, 9:00 – 18:00',
    ar: 'الأحد – الخميس، 9:00 – 18:00',
  },
  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
    { id: 'x', label: 'X', href: 'https://x.com' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com' },
  ],
  /** Reserved demo coordinates for the head office map. */
  mapCenter: { lat: 24.6939, lng: 46.6859 },
} as const;

export const coreValues = [
  {
    id: 'clarity',
    title: { en: 'Clarity before enthusiasm', ar: 'الوضوح قبل الحماس' },
    description: {
      en: 'We will tell you what we would do ourselves, including when the answer is to wait.',
      ar: 'نخبرك بما كنا سنفعله لو كنا مكانك، حتى إن كانت الإجابة أن تنتظر.',
    },
  },
  {
    id: 'detail',
    title: { en: 'Attention to the small print', ar: 'الاهتمام بالتفاصيل' },
    description: {
      en: 'Permits, easements, service charges and completion clauses are read, not skimmed.',
      ar: 'التراخيص وحقوق الارتفاق ورسوم الخدمة وشروط التسليم تُقرأ بعناية ولا تُمرَّر سريعًا.',
    },
  },
  {
    id: 'discretion',
    title: { en: 'Discretion by default', ar: 'الخصوصية مبدأ' },
    description: {
      en: 'Some properties never appear online. Confidentiality is a service, not a favour.',
      ar: 'بعض العقارات لا تُنشر إطلاقًا. السرية خدمة نقدمها لا استثناءً.',
    },
  },
  {
    id: 'longevity',
    title: { en: 'Relationships that outlast the deal', ar: 'علاقات تتجاوز الصفقة' },
    description: {
      en: 'Most of our work now comes from clients we advised years ago.',
      ar: 'معظم أعمالنا اليوم تأتي من عملاء استشرناهم قبل سنوات.',
    },
  },
];

export const whyChooseUs = [
  {
    id: 'local',
    number: '01',
    title: { en: 'Street-level knowledge', ar: 'معرفة بكل شارع' },
    description: {
      en: 'Our consultants work a handful of districts each, and know which streets flood, which plots face north and which buildings have a service charge problem.',
      ar: 'يعمل كل مستشار لدينا في عدد محدود من الأحياء، ويعرف أي الشوارع تتعرض لتجمع المياه، وأي القطع تطل شمالًا، وأي المباني فيها مشكلة في رسوم الخدمة.',
    },
  },
  {
    id: 'verified',
    number: '02',
    title: { en: 'Every listing verified', ar: 'كل عرض موثّق' },
    description: {
      en: 'Nothing is published until the deed, the permits and the owner’s authority have been seen by our team.',
      ar: 'لا يُنشر أي عرض حتى يطّلع فريقنا على الصك والتراخيص وتفويض المالك.',
    },
  },
  {
    id: 'one-team',
    number: '03',
    title: { en: 'One team, one file', ar: 'فريق واحد وملف واحد' },
    description: {
      en: 'Buying, financing, leasing and property management sit under the same roof, so nobody hands you off.',
      ar: 'البيع والتمويل والتأجير وإدارة الأملاك تحت سقف واحد، فلن يحوّلك أحد إلى جهة أخرى.',
    },
  },
  {
    id: 'aftercare',
    number: '04',
    title: { en: 'We stay after the sale', ar: 'نبقى بعد البيع' },
    description: {
      en: 'Handover, tenant placement and maintenance coordination continue long after the payment clears.',
      ar: 'التسليم وتأجير الوحدة وتنسيق الصيانة تبقى مستمرة بعد إتمام الدفع بوقت طويل.',
    },
  },
] as const;

export const processSteps = [
  {
    id: 'brief',
    number: '01',
    title: { en: 'The brief', ar: 'التعريف' },
    description: {
      en: 'A short conversation about budget, timing, and what actually matters to you — schools, commute, privacy, or yield.',
      ar: 'محادثة قصيرة عن الميزانية والتوقيت وما يهمك فعلًا — المدارس أو التنقل أو الخصوصية أو العائد.',
    },
  },
  {
    id: 'shortlist',
    number: '02',
    title: { en: 'The shortlist', ar: 'القائمة المختصرة' },
    description: {
      en: 'You receive a small, opinionated set of options with a note explaining why each one is on the list.',
      ar: 'تستلم مجموعة محدودة من الخيارات مع ملاحظة تشرح سبب اختيار كل خيار.',
    },
  },
  {
    id: 'viewings',
    number: '03',
    title: { en: 'Viewings', ar: 'المعاينات' },
    description: {
      en: 'Scheduled around your working week, including evenings and weekends, with one consultant throughout.',
      ar: 'تُرتَّب وفق جدولك الأسبوعي، بما يشمل الأمسيات ونهاية الأسبوع، مع مستشار واحد طوال الرحلة.',
    },
  },
  {
    id: 'close',
    number: '04',
    title: { en: 'Closing and aftercare', ar: 'الإتمام والمتابعة' },
    description: {
      en: 'Negotiation, documentation and transfer handled end to end, followed by a real handover.',
      ar: 'التفاوض والتوثيق ونقل الملكية من البداية للنهاية، يتبعها تسليم حقيقي.',
    },
  },
] as const;
