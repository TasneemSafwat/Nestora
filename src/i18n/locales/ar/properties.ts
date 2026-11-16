import type { properties } from '../en/properties';

export const ar: Record<keyof typeof properties, string> = {
  'properties.page.eyebrow': 'المحفظة',
  'properties.page.titleLead': 'عقارات تستحق',
  'properties.page.titleAccent': 'الاطلاع.',
  'properties.page.subtitle':
    'ابحث حسب المدينة والميزانية والتوزيع. كل عرض أدناه تم التحقق منه وتصويره وتسعيره من مستشار نستورا.',

  'properties.filters.title': 'تصفية',
  'properties.filters.show': 'الفلاتر',
  'properties.filters.hide': 'إخفاء الفلاتر',
  'properties.filters.more': 'فلاتر إضافية',
  'properties.filters.fewer': 'فلاتر أقل',
  'properties.filters.keyword': 'كلمة البحث',
  'properties.filters.listingType': 'شراء أو استئجار',
  'properties.filters.anyListing': 'بيع وإيجار',
  'properties.filters.city': 'المدينة',
  'properties.filters.district': 'الحي',
  'properties.filters.type': 'نوع العقار',
  'properties.filters.price': 'السعر',
  'properties.filters.bedrooms': 'غرف النوم',
  'properties.filters.bathrooms': 'دورات المياه',
  'properties.filters.area': 'المساحة (م²)',
  'properties.filters.furnishing': 'الفرش',
  'properties.filters.amenities': 'المرافق',
  'properties.filters.amenitiesSelected': '{{count}} محددة',
  'properties.filters.status': 'التوفر',
  'properties.filters.anyStatus': 'أي حالة توفر',
  'properties.filters.showResults': 'عرض {{count}} عقارًا',
  'properties.filters.showResultOne': 'عرض عقار واحد',

  'properties.area.min': 'أقل مساحة',
  'properties.area.max': 'أعلى مساحة',
  'properties.bedrooms.any': 'الكل',
  'properties.bedrooms.label': '{{count}}+ غرف نوم',
  'properties.bathrooms.any': 'الكل',
  'properties.bathrooms.label': '{{count}}+ دورات مياه',

  'properties.chips.results': 'نتائج البحث عن «{{value}}»',
  'properties.chips.any': 'الكل',
  'properties.chips.under': 'أقل من {{value}}',
  'properties.chips.over': 'أكثر من {{value}}',
  'properties.chips.remove': 'إزالة الفلتر {{label}}',

  'properties.toolbar.viewMode': 'العرض',
  'properties.toolbar.sort': 'الترتيب',
  'properties.pagination.previous': 'الصفحة السابقة',
  'properties.pagination.next': 'الصفحة التالية',
  'properties.pagination.page': 'صفحة {{page}}',

  'properties.loading': 'جارٍ تحميل العقارات…',

  'property.breadcrumbHome': 'الرئيسية',
  'property.breadcrumbProperties': 'العقارات',

  'property.gallery.viewAll': 'عرض جميع الصور ({{count}})',
  'property.gallery.photo': 'صورة {{index}} من {{total}}',
  'property.gallery.caption': '{{label}} — {{title}}',

  'property.priceLabel': 'سعر البيع',
  'property.rentLabel': 'الإيجار السنوي',
  'property.refLabel': 'المرجع {{reference}}',
  'property.listedOn': 'أُضيف في {{date}}',

  'property.specs.title': 'مواصفات العقار',
  'property.about.title': 'عن هذا العقار',
  'property.amenities.title': 'المرافق',
  'property.interior.title': 'مزايا داخلية',
  'property.exterior.title': 'مزايا خارجية',
  'property.location.title': 'الموقع',
  'property.location.district': '{{district}}، {{city}}',
  'property.location.mapNote': 'الموقع تقريبي. يُشارك العنوان الدقيق بعد تأكيد المعاينة.',
  'property.location.openMap': 'افتح في الخرائط',

  'property.agent.title': 'المستشار المسؤول',
  'property.agent.properties': '{{count}} عرضًا نشطًا',
  'property.agent.languages': 'اللغات',
  'property.agent.specialties': 'التخصص',
  'property.agent.viewProfile': 'عرض الملف الكامل',

  'property.inquiry.title': 'مهتم بهذا العقار؟',
  'property.inquiry.text':
    'أرسل استفسارك وسيجيبك المستشار المسؤول عن هذا العرض مباشرة — عادة خلال يوم عمل واحد.',
  'property.inquiry.cta': 'إرسال استفسار',
  'property.inquiry.success': 'تم استلام استفسارك',
  'property.inquiry.successText':
    'شكرًا لك. سُجّل استفسارك في لوحة التحكم التجريبية وسيظهر ضمن قسم الاستفسارات.',

  'property.viewing.title': 'اطلب معاينة',
  'property.viewing.text': 'اختر التاريخ والوقت المناسب لك، بما يشمل الأمسيات ونهاية الأسبوع.',
  'property.viewing.cta': 'طلب معاينة',
  'property.viewing.success': 'تم طلب المعاينة',
  'property.viewing.successText':
    'طلبك قيد التأكيد ويظهر الآن ضمن طلبات المعاينة في لوحة التحكم التجريبية.',

  'property.actions.call': 'اتصل بالمستشار',
  'property.actions.whatsapp': 'واتساب',
  'property.actions.inquiry': 'إرسال استفسار',
  'property.actions.viewing': 'طلب معاينة',
  'property.actions.share': 'مشاركة',
  'property.actions.favorite': 'حفظ',
  'property.actions.favorited': 'محفوظ',
  'property.actions.copyLink': 'نسخ الرابط',
  'property.actions.print': 'طباعة التفاصيل',

  'property.tabs.overview': 'نظرة عامة',
  'property.tabs.features': 'المزايا',
  'property.tabs.location': 'الموقع',
  'property.tabs.consultant': 'المستشار',

  'property.similar.title': 'عقارات تتشارك',
  'property.similar.titleAccent': 'الطابع نفسه',
  'property.similar.text': 'عروض أخرى تطابق نفس الطلب.',
  'property.similar.viewAll': 'عرض جميع العقارات',

  'property.status.soldNote': 'لم يعد هذا العقار متاحًا. يمكن لمستشارينا اقتراح عروض مشابهة.',
  'property.status.rentedNote': 'تم تأجير هذا العقار. اسألنا عن خيارات مشابهة متاحة.',
  'property.status.reservedNote': 'هذا العقار محجوز حاليًا. انضم لقائمة الانتظار لمساكن مشابهة.',
  'property.status.draftNote': 'هذا العرض لا يزال قيد الإعداد ولم يُنشر للعامة بعد.',

  'property.share.copied': 'تم نسخ رابط العقار.',
  'property.share.shareText': '{{title}} — {{price}} في {{location}} على نستورا',

  'property.reference.copy': 'نسخ الرقم المرجعي',
  'property.reference.copied': 'تم نسخ الرقم المرجعي.',
  'property.viewsLabel': '{{count}} مشاهدة',
};
