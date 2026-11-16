import type { agents } from '../en/agents';

export const ar: Record<keyof typeof agents, string> = {
  'agents.page.eyebrow': 'الفريق',
  'agents.page.titleLead': 'مستشارون، لا',
  'agents.page.titleAccent': 'مركز اتصال.',
  'agents.page.subtitle':
    'فريق صغير عن قصد. يغطي كل مستشار أحياء محددة، فتأتي نصائحه من مشيه في تلك الشوارع بنفسه.',

  'agents.search.placeholder': 'ابحث بالاسم أو الحي',
  'agents.filter.specialty': 'التخصص',
  'agents.filter.allSpecialties': 'جميع التخصصات',
  'agents.filter.city': 'المدينة',
  'agents.filter.allCities': 'جميع المدن',
  'agents.filter.language': 'اللغة',
  'agents.filter.allLanguages': 'جميع اللغات',

  'agents.count': '{{count}} مستشارًا',
  'agents.countOne': 'مستشار واحد',

  'agents.card.listings': '{{count}} عرضًا',
  'agents.card.experience': 'خبرة {{count}} سنوات',
  'agents.card.deals': '{{count}} صفقة مكتملة',
  'agents.card.languages': '{{count}} لغات',
  'agents.card.contact': 'تواصل',
  'agents.card.call': 'اتصال',
  'agents.card.whatsapp': 'واتساب',

  'agents.empty.title': 'لا يوجد مستشارون',
  'agents.empty.text': 'لا يوجد من يطابق هذه الفلاتر حاليًا. جرّب إزالة المدينة أو التخصص.',

  'agent.notFound.title': 'المستشار غير موجود',
  'agent.notFound.text': 'هذا الملف غير موجود أو لم يعد معروضًا.',

  'agent.backToTeam': 'العودة إلى الفريق',
  'agent.about': 'نبذة عن {{name}}',
  'agent.specialties': 'التخصص',
  'agent.languages': 'اللغات',
  'agent.cities': 'المدن المغطاة',
  'agent.joined': 'مع نستورا منذ {{year}}',
  'agent.contactTitle': 'تواصل مع {{name}}',
  'agent.contactText': 'أرسل رسالة مباشرة إلى هذا المستشار. ستظهر في لوحة التحكم التجريبية.',
  'agent.contactSuccess': 'تم إرسال الرسالة',
  'agent.contactSuccessText': 'شكرًا لك. سُجّلت رسالتك ضمن الاستفسارات في لوحة التحكم التجريبية.',

  'agent.listingsTitle': 'عروض {{name}}',
  'agent.listingsText': 'العقارات النشطة التي يمثلها هذا المستشار حاليًا.',
  'agent.listingsEmpty': 'لا توجد عروض منشورة لهذا المستشار في الوقت الحالي.',
  'agent.listingsCount': '{{count}} نشط',
  'agent.stats.properties': 'العروض النشطة',
  'agent.stats.deals': 'الصفقات المكتملة',
  'agent.stats.experience': 'سنوات الخبرة',
  'agent.stats.rating': 'تقييم العملاء',

  'agent.cta.title': 'لا تعرف مع من تتحدث؟',
  'agent.cta.text': 'أرسل طلبًا موجزًا وسنحوّله إلى المستشار المناسب للحي الذي تبحث فيه.',
  'agent.cta.button': 'إرسال استفسار عام',
};
