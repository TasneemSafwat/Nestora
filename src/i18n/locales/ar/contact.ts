import type { contact } from '../en/contact';

export const ar: Record<keyof typeof contact, string> = {
  'contact.hero.eyebrow': 'التواصل',
  'contact.hero.titleLead': 'ابدأ',
  'contact.hero.titleAccent': 'بسؤال.',
  'contact.hero.subtitle':
    'أخبرنا بما تريد تحقيقه وسنضع المستشار المناسب عليه. لا ردود آلية، ولا نماذج تُباع لست وكالات أخرى.',

  'contact.form.title': 'أرسل لنا رسالة',
  'contact.form.text': 'نجيب على كل الرسائل خلال يوم عمل واحد.',
  'contact.form.subject': 'ما موضوع رسالتك؟',
  'contact.form.subject.general': 'استفسار عام',
  'contact.form.subject.buying': 'أرغب في شراء عقار',
  'contact.form.subject.selling': 'أرغب في بيع عقار',
  'contact.form.subject.renting': 'إيجار أو استئجار',
  'contact.form.subject.valuation': 'تقييم عقار',
  'contact.form.subject.management': 'إدارة أملاك',
  'contact.form.messagePlaceholder': 'الحي والميزانية والتوقيت — كل ما تعرفه يساعدنا.',
  'contact.form.submit': 'إرسال الرسالة',
  'contact.form.success': 'تم استلام رسالتك',
  'contact.form.successText': 'شكرًا لك. سُجّلت رسالتك ضمن الاستفسارات في لوحة التحكم التجريبية.',

  'contact.details.title': 'قنوات مباشرة',
  'contact.details.phone': 'الهاتف',
  'contact.details.whatsapp': 'واتساب',
  'contact.details.email': 'البريد الإلكتروني',
  'contact.details.hours': 'ساعات العمل',
  'contact.details.copyPhone': 'نسخ الرقم',

  'contact.offices.eyebrow': 'مكاتبنا',
  'contact.offices.titleLead': 'ثلاثة مكاتب في',
  'contact.offices.titleAccent': 'المملكة.',
  'contact.offices.text': 'تفضل بالزيارة، أو احجز موعدًا ليكون المستشار المناسب متفرغًا عند وصولك.',
  'contact.offices.headOfficeTag': 'المكتب الرئيسي',
  'contact.offices.mapNote': 'الموقع المعروض تقريبي ولأغراض العرض التجريبي.',
  'contact.offices.directions': 'الحصول على الاتجاهات',

  'contact.faq.eyebrow': 'قبل أن تكتب إلينا',
  'contact.faq.titleLead': 'أسئلة',
  'contact.faq.titleAccent': 'متكررة.',
  'contact.faq.q1': 'هل تتقاضون رسومًا من المشتري؟',
  'contact.faq.a1':
    'في البيع تُتفق العمولة مع البائع وتُوضّح لك قبل تقديم العرض. وفي الإيجار تُحتسب عمولة الوساطة حسب الترتيب المعتاد لمرة واحدة كما هو مبيّن في العرض.',
  'contact.faq.q2': 'هل يمكنني معاينة العقار مساءً أو في نهاية الأسبوع؟',
  'contact.faq.a2':
    'نعم. اطلب المعاينة بالتاريخ والوقت المناسب لك، بما يشمل الأمسيات وأيام الجمعة بعد الصلاة، وسيؤكد المستشار مباشرة.',
  'contact.faq.q3': 'متى سيتم الرد عليّ؟',
  'contact.faq.a3':
    'خلال يوم عمل واحد، وغالبًا في الصباح نفسه. تُوزّع الاستفسارات على المستشار المسؤول عن العقار لا على قائمة عامة.',
  'contact.faq.q4': 'هل تتعاملون مع الإيجار إضافة إلى البيع؟',
  'contact.faq.a4': 'نتعامل مع الاثنين، إضافة إلى الأراضي والطوابق التجارية وإدارة المحافظ كاملة للملاك.',

  'contact.cta.titleLead': 'تفضل الحديث',
  'contact.cta.titleAccent': 'هاتفيًا؟',
  'contact.cta.text': 'اتصل بالمكتب الرئيسي واسأل عن الحي الذي يهمك.',
  'contact.cta.button': 'اتصل بـ {{phone}}',

  /* ------------------------------- Valuation ------------------------------- */

  'valuation.hero.eyebrow': 'طلب تقييم مجاني',
  'valuation.hero.titleLead': 'اعرف القيمة الحقيقية',
  'valuation.hero.titleAccent': 'لعقارك.',
  'valuation.hero.subtitle':
    'أرسل التفاصيل أدناه وسيُعد لك مستشار نستورا تقييمًا مبنيًا على صفقات مشابهة — دون أي التزام، ودون تقدير آلي.',

  'valuation.form.title': 'تفاصيل العقار',
  'valuation.form.text': 'كل ما تخبرنا به يزيد دقة التقييم. كل البيانات تُخزّن في متصفحك فقط.',
  'valuation.form.step': 'الخطوة {{current}} من {{total}}',
  'valuation.form.stepProperty': 'العقار',
  'valuation.form.stepOwner': 'بياناتك',
  'valuation.form.submit': 'إرسال طلب التقييم',
  'valuation.form.reviewInput': 'ستتمكن من مراجعة كل التفاصيل قبل الإرسال.',

  'valuation.field.propertyType': 'نوع العقار',
  'valuation.field.city': 'المدينة',
  'valuation.field.district': 'الحي',
  'valuation.field.area': 'المساحة المبنية (م²)',
  'valuation.field.lotArea': 'مساحة الأرض (م²)',
  'valuation.field.bedrooms': 'غرف النوم',
  'valuation.field.condition': 'حالة العقار',
  'valuation.field.expectedPrice': 'السعر المتوقع (ريال)',
  'valuation.field.expectedPriceHint': 'اختياري — يساعدنا في تحديد نقطة الحوار.',
  'valuation.field.fullName': 'الاسم الكامل',
  'valuation.field.phone': 'رقم الجوال',
  'valuation.field.email': 'البريد الإلكتروني',
  'valuation.field.details': 'أي شيء آخر يجدر أن نعرفه؟',
  'valuation.field.detailsPlaceholder': 'تجديد حديث، حالة التأجير، سبب البيع، التوقيت…',

  'valuation.review.title': 'يرجى مراجعة طلبك',
  'valuation.review.text': 'تحقق من التفاصيل أدناه ثم أرسل الطلب.',

  'valuation.success.title': 'تم استلام الطلب',
  'valuation.success.text':
    'شكرًا لك {{name}}. سُجّل طلب التقييم ضمن «طلبات التقييم» في لوحة التحكم التجريبية. هذا إرسال تجريبي — لم يُنتج أي تقييم آلي ولن يتواصل معك أي مستشار فعليًا.',
  'valuation.success.reference': 'رقم طلبك',
  'valuation.success.submitAnother': 'إرسال طلب آخر',
  'valuation.success.viewDashboard': 'عرضه في لوحة التحكم التجريبية',

  'valuation.whatNext.title': 'ما الذي يحدث بعد ذلك',
  'valuation.whatNext.p1': 'يراجع المستشار صفقات مكتملة مشابهة في حيّك.',
  'valuation.whatNext.p2': 'نطلب عادة مكالمة قصيرة لتأكيد المواصفات والحالة.',
  'valuation.whatNext.p3': 'تستلم نطاقًا مكتوبًا مع الأدلة التي بني عليها — دون أي التزام بالعرض.',

  'valuation.why.title': 'لماذا يصمد تقييمنا',
  'valuation.why.p1': 'مبني على صفقات مكتملة لا على أسعار معروضة.',
  'valuation.why.p2': 'معدّل حسب الدور والشارع والاتجاه والحالة.',
  'valuation.why.p3': 'يُعدّه المستشار المسؤول عن حيّك.',
  'valuation.why.p4': 'نطاق مكتوب مع التبرير، لا رقم واحد.',

  'valuation.demoNote':
    'الوضع التجريبي: يُحفظ هذا النموذج في متصفحك فقط. لا يُنتج أي تقييم آلي ولا تُرسل أي بيانات.',

  'valuation.sidebar.title': 'تفضل مكالمة؟',
  'valuation.sidebar.text': 'تحدث مع قسم التقييم مباشرة خلال ساعات العمل.',
  'valuation.sidebar.email': 'راسل قسم التقييم',

  /* ------------------------------- Favorites ------------------------------- */

  'favorites.page.eyebrow': 'المحفوظات',
  'favorites.page.titleLead': 'قائمتك',
  'favorites.page.titleAccent': 'المفضلة.',
  'favorites.page.subtitle':
    'العقارات التي حفظتها أثناء التصفح. كل شيء هنا محفوظ في هذا المتصفح فقط — ومسح بيانات المتصفح سيحذف القائمة.',
  'favorites.count': '{{count}} عقارًا محفوظًا',
  'favorites.countOne': 'عقار واحد محفوظ',
  'favorites.clear': 'مسح كل المفضلة',
  'favorites.clearConfirmTitle': 'مسح كل المفضلة؟',
  'favorites.clearConfirmText': 'سيؤدي هذا إلى حذف كل العقارات المحفوظة من هذا المتصفح، ولا يمكن التراجع.',
  'favorites.cleared': 'تم مسح قائمة المفضلة بالكامل.',
  'favorites.notes.title': 'استفسر عن كل المحفوظات',
  'favorites.notes.text': 'أرسل رسالة واحدة تضم كل العقارات التي حفظتها وسنعود إليك بخطة.',
  'favorites.notes.button': 'استفسر عن هذه العقارات',
  'favorites.notes.success': 'تم إرسال الاستفسار',
  'favorites.notes.successText': 'سُجّل استفسارك المجمّع ضمن الاستفسارات في لوحة التحكم التجريبية.',
  'favorites.localNote':
    'تُحفظ المفضلة في ذاكرة المتصفح (localStorage) لأغراض العرض، ولا تُزامن مع أي حساب أو خادم.',
};
