import type { Bilingual, City, District, Furnishing, ListingType, PropertyStatus, PropertyType } from '../types';

/* -------------------------------------------------------------------------- */
/*                                   Cities                                    */
/* -------------------------------------------------------------------------- */

export const cities: City[] = [
  {
    id: 'riyadh',
    name: { en: 'Riyadh', ar: 'الرياض' },
    tagline: { en: 'The capital, and its most sought-after addresses.', ar: 'العاصمة وأكثر عناوينها طلبًا.' },
    imagePrompt: 'Riyadh skyline with modern towers and warm desert light',
  },
  {
    id: 'jeddah',
    name: { en: 'Jeddah', ar: 'جدة' },
    tagline: { en: 'Coastal living and contemporary design.', ar: 'حياة ساحلية وتصميم معاصر.' },
    imagePrompt: 'Jeddah corniche waterfront with contemporary architecture',
  },
  {
    id: 'dammam',
    name: { en: 'Dammam', ar: 'الدمام' },
    tagline: { en: 'Space, calm and long-term value.', ar: 'مساحات وهدوء وقيمة على المدى الطويل.' },
    imagePrompt: 'Dammam residential avenues with palm trees',
  },
  {
    id: 'khobar',
    name: { en: 'Khobar', ar: 'الخبر' },
    tagline: { en: 'Waterfront, refined and well connected.', ar: 'واجهة بحرية وأناقة واتصال ممتاز.' },
    imagePrompt: 'Khobar waterfront promenade with modern buildings',
  },
  {
    id: 'makkah',
    name: { en: 'Makkah', ar: 'مكة المكرمة' },
    tagline: { en: 'Long-term value in a historic city.', ar: 'قيمة طويلة الأمد في مدينة عريقة.' },
    imagePrompt: 'Makkah hillside cityscape at dusk',
  },
  {
    id: 'madinah',
    name: { en: 'Madinah', ar: 'المدينة المنورة' },
    tagline: { en: 'Serene neighborhoods and generous plots.', ar: 'أحياء هادئة وقطع أرضية واسعة.' },
    imagePrompt: 'Madinah modern residential district with palm groves',
  },
];

export const cityById = (id: string): City | undefined => cities.find((city) => city.id === id);

/* -------------------------------------------------------------------------- */
/*                                 Districts                                   */
/* -------------------------------------------------------------------------- */

export const districts: District[] = [
  { id: 'al-malqa', cityId: 'riyadh', name: { en: 'Al Malqa', ar: 'الملقا' } },
  { id: 'hittin', cityId: 'riyadh', name: { en: 'Hittin', ar: 'حطين' } },
  { id: 'al-yasmin', cityId: 'riyadh', name: { en: 'Al Yasmin', ar: 'الياسمين' } },
  { id: 'al-narjis', cityId: 'riyadh', name: { en: 'Al Narjis', ar: 'النرجس' } },
  { id: 'al-shati', cityId: 'jeddah', name: { en: 'Al Shati', ar: 'الشاطئ' } },
  { id: 'al-zahra', cityId: 'jeddah', name: { en: 'Al Zahra', ar: 'الزهراء' } },
  { id: 'al-rawdah', cityId: 'jeddah', name: { en: 'Al Rawdah', ar: 'الروضة' } },
  { id: 'al-aqrabiyah', cityId: 'khobar', name: { en: 'Al Aqrabiyah', ar: 'العقربية' } },
  { id: 'al-bandariyah', cityId: 'khobar', name: { en: 'Al Bandariyah', ar: 'البندارية' } },
  { id: 'al-faisaliyah', cityId: 'dammam', name: { en: 'Al Faisaliyah', ar: 'الفيصلية' } },
  { id: 'al-shulah', cityId: 'dammam', name: { en: 'Al Shulah', ar: 'الشعلة' } },
  { id: 'al-aziziyah', cityId: 'makkah', name: { en: 'Al Aziziyah', ar: 'العزيزية' } },
  { id: 'al-aqeeq', cityId: 'madinah', name: { en: 'Al Aqeeq', ar: 'العقيق' } },
];

export const districtById = (id: string): District | undefined => districts.find((d) => d.id === id);

export const districtsByCity = (cityId: string): District[] => districts.filter((d) => d.cityId === cityId);

/* -------------------------------------------------------------------------- */
/*                             Property taxonomy                               */
/* -------------------------------------------------------------------------- */

export interface PropertyTypeMeta {
  id: PropertyType;
  name: Bilingual;
  /** Plural form used in results counters and dashboard metrics. */
  plural: Bilingual;
}

export const propertyTypes: PropertyTypeMeta[] = [
  { id: 'villa', name: { en: 'Villa', ar: 'فيلا' }, plural: { en: 'Villas', ar: 'فلل' } },
  { id: 'apartment', name: { en: 'Apartment', ar: 'شقة' }, plural: { en: 'Apartments', ar: 'شقق' } },
  { id: 'penthouse', name: { en: 'Penthouse', ar: 'بنتهاوس' }, plural: { en: 'Penthouses', ar: 'بنتهاوس' } },
  { id: 'townhouse', name: { en: 'Townhouse', ar: 'تاون هاوس' }, plural: { en: 'Townhouses', ar: 'تاون هاوس' } },
  {
    id: 'commercial',
    name: { en: 'Commercial', ar: 'تجاري' },
    plural: { en: 'Commercial', ar: 'عقارات تجارية' },
  },
  { id: 'land', name: { en: 'Residential Land', ar: 'أرض سكنية' }, plural: { en: 'Land', ar: 'أراضي' } },
];

export const propertyTypeById = (id: string): PropertyTypeMeta | undefined =>
  propertyTypes.find((t) => t.id === id);

export const listingTypes: { id: ListingType; name: Bilingual }[] = [
  { id: 'sale', name: { en: 'Buy', ar: 'شراء' } },
  { id: 'rent', name: { en: 'Rent', ar: 'إيجار' } },
];

export const furnishingOptions: { id: Furnishing; name: Bilingual }[] = [
  { id: 'furnished', name: { en: 'Furnished', ar: 'مفروش' } },
  { id: 'semi-furnished', name: { en: 'Semi-furnished', ar: 'نصف مفروش' } },
  { id: 'unfurnished', name: { en: 'Unfurnished', ar: 'غير مفروش' } },
];

export const propertyStatuses: { id: PropertyStatus; name: Bilingual }[] = [
  { id: 'available', name: { en: 'Available', ar: 'متاح' } },
  { id: 'reserved', name: { en: 'Reserved', ar: 'محجوز' } },
  { id: 'sold', name: { en: 'Sold', ar: 'مُباع' } },
  { id: 'rented', name: { en: 'Rented', ar: 'مؤجّر' } },
  { id: 'draft', name: { en: 'Draft', ar: 'مسودة' } },
];

export const conditionOptions: { id: 'new' | 'excellent' | 'good' | 'needs-work'; name: Bilingual }[] = [
  { id: 'new', name: { en: 'Brand new', ar: 'جديد بالكامل' } },
  { id: 'excellent', name: { en: 'Excellent', ar: 'ممتاز' } },
  { id: 'good', name: { en: 'Good', ar: 'جيد' } },
  { id: 'needs-work', name: { en: 'Needs work', ar: 'يحتاج صيانة' } },
];

/* -------------------------------------------------------------------------- */
/*                                Attributes                                   */
/* -------------------------------------------------------------------------- */

export interface TaggableMeta {
  id: string;
  name: Bilingual;
}

export interface AmenityMeta extends TaggableMeta {
  /** Lucide icon name, resolved in the presentation layer. */
  icon: string;
}

export const amenities: AmenityMeta[] = [
  { id: 'private-pool', name: { en: 'Private Pool', ar: 'مسبح خاص' }, icon: 'Waves' },
  { id: 'gym', name: { en: 'Gym', ar: 'صالة رياضية' }, icon: 'Dumbbell' },
  { id: 'landscaped-garden', name: { en: 'Landscaped Garden', ar: 'حديقة منسّقة' }, icon: 'Trees' },
  { id: 'security-24-7', name: { en: '24/7 Security', ar: 'أمن 24/7' }, icon: 'ShieldCheck' },
  { id: 'covered-parking', name: { en: 'Covered Parking', ar: 'مواقف مظللة' }, icon: 'Car' },
  { id: 'elevator', name: { en: 'Elevator', ar: 'مصعد' }, icon: 'MoveVertical' },
  { id: 'central-ac', name: { en: 'Central A/C', ar: 'تكييف مركزي' }, icon: 'Wind' },
  { id: 'maid-room', name: { en: "Maid's Room", ar: 'غرفة خادمة' }, icon: 'DoorClosed' },
  { id: 'driver-room', name: { en: "Driver's Room", ar: 'غرفة سائق' }, icon: 'DoorOpen' },
  { id: 'smart-home', name: { en: 'Smart Home', ar: 'منزل ذكي' }, icon: 'Cpu' },
  { id: 'bbq-area', name: { en: 'BBQ Area', ar: 'منطقة شواء' }, icon: 'Flame' },
  { id: 'kids-play-area', name: { en: 'Kids Play Area', ar: 'منطقة ألعاب أطفال' }, icon: 'Baby' },
  { id: 'mosque', name: { en: 'Mosque Nearby', ar: 'مسجد قريب' }, icon: 'Moon' },
  { id: 'sea-view', name: { en: 'Sea View', ar: 'إطلالة بحرية' }, icon: 'Sailboat' },
  { id: 'city-view', name: { en: 'City View', ar: 'إطلالة على المدينة' }, icon: 'Building2' },
  { id: 'jacuzzi', name: { en: 'Jacuzzi', ar: 'جاكوزي' }, icon: 'Bath' },
  { id: 'sauna', name: { en: 'Sauna', ar: 'ساونا' }, icon: 'Thermometer' },
  { id: 'storage-room', name: { en: 'Storage Room', ar: 'غرفة تخزين' }, icon: 'Package' },
  { id: 'cinema-room', name: { en: 'Cinema Room', ar: 'غرفة سينما' }, icon: 'Clapperboard' },
  { id: 'roof-terrace', name: { en: 'Roof Terrace', ar: 'سطح خاص' }, icon: 'Sun' },
  { id: 'solar-panels', name: { en: 'Solar Panels', ar: 'ألواح شمسية' }, icon: 'SunMedium' },
  { id: 'ev-charging', name: { en: 'EV Charging', ar: 'شاحن سيارات كهربائية' }, icon: 'Zap' },
  { id: 'pet-friendly', name: { en: 'Pet Friendly', ar: 'يسمح بالحيوانات' }, icon: 'PawPrint' },
  { id: 'step-free-access', name: { en: 'Step-free Access', ar: 'مدخل بدون درج' }, icon: 'Accessibility' },
];

export const amenityById = (id: string): AmenityMeta | undefined => amenities.find((a) => a.id === id);

export const interiorFeatures: TaggableMeta[] = [
  { id: 'marble-flooring', name: { en: 'Marble Flooring', ar: 'أرضيات رخام' } },
  { id: 'built-in-wardrobes', name: { en: 'Built-in Wardrobes', ar: 'خزائن مدمجة' } },
  { id: 'walk-in-closet', name: { en: 'Walk-in Closet', ar: 'غرفة ملابس' } },
  { id: 'open-plan-kitchen', name: { en: 'Open-plan Kitchen', ar: 'مطبخ مفتوح' } },
  { id: 'high-ceilings', name: { en: 'High Ceilings', ar: 'أسقف مرتفعة' } },
  { id: 'guest-majlis', name: { en: 'Guest Majlis', ar: 'مجلس ضيوف' } },
  { id: 'formal-dining', name: { en: 'Formal Dining Room', ar: 'غرفة طعام رسمية' } },
  { id: 'family-living', name: { en: 'Family Living Room', ar: 'صالة عائلية' } },
  { id: 'study-room', name: { en: 'Study Room', ar: 'غرفة مكتب' } },
  { id: 'laundry-room', name: { en: 'Laundry Room', ar: 'غرفة غسيل' } },
  { id: 'pantry', name: { en: 'Pantry', ar: 'مؤونة' } },
  { id: 'fireplace', name: { en: 'Fireplace', ar: 'مدفأة' } },
  { id: 'double-glazing', name: { en: 'Double Glazing', ar: 'زجاج مزدوج' } },
  { id: 'smart-lighting', name: { en: 'Smart Lighting', ar: 'إضاءة ذكية' } },
  { id: 'sound-insulation', name: { en: 'Sound Insulation', ar: 'عزل صوتي' } },
];

export const exteriorFeatures: TaggableMeta[] = [
  { id: 'private-entrance', name: { en: 'Private Entrance', ar: 'مدخل خاص' } },
  { id: 'landscaped-yard', name: { en: 'Landscaped Yard', ar: 'فناء منسّق' } },
  { id: 'outdoor-seating', name: { en: 'Outdoor Seating', ar: 'جلسة خارجية' } },
  { id: 'pergola', name: { en: 'Pergola', ar: 'مظلة' } },
  { id: 'driveway', name: { en: 'Paved Driveway', ar: 'ممر مرصوف' } },
  { id: 'garage', name: { en: 'Garage', ar: 'كراج' } },
  { id: 'security-gate', name: { en: 'Security Gate', ar: 'بوابة أمنية' } },
  { id: 'cctv', name: { en: 'CCTV', ar: 'كاميرات مراقبة' } },
  { id: 'annex', name: { en: 'Guest Annex', ar: 'ملحق ضيوف' }, },
  { id: 'water-well', name: { en: 'Water Well', ar: 'بئر ماء' } },
  { id: 'fenced-plot', name: { en: 'Fenced Plot', ar: 'أرض مسوّرة' } },
  { id: 'corner-plot', name: { en: 'Corner Plot', ar: 'قطعة زاوية' } },
];

const taggableIndex = new Map<string, TaggableMeta>(
  [...interiorFeatures, ...exteriorFeatures].map((item) => [item.id, item])
);

export const featureById = (id: string): TaggableMeta | undefined => taggableIndex.get(id);

/* -------------------------------------------------------------------------- */
/*                                 Languages                                   */
/* -------------------------------------------------------------------------- */

export const languageOptions: Bilingual[] = [
  { en: 'Arabic', ar: 'العربية' },
  { en: 'English', ar: 'الإنجليزية' },
  { en: 'French', ar: 'الفرنسية' },
  { en: 'Urdu', ar: 'الأردية' },
];

/* -------------------------------------------------------------------------- */
/*                              Agent specialties                              */
/* -------------------------------------------------------------------------- */

export const specialties: TaggableMeta[] = [
  { id: 'luxury-villas', name: { en: 'Luxury Villas', ar: 'فلل فاخرة' } },
  { id: 'apartments', name: { en: 'Apartments', ar: 'شقق سكنية' } },
  { id: 'penthouses', name: { en: 'Penthouses', ar: 'بنتهاوس' } },
  { id: 'commercial', name: { en: 'Commercial', ar: 'عقارات تجارية' } },
  { id: 'land', name: { en: 'Land & Plots', ar: 'أراضي وقطع' } },
  { id: 'investment', name: { en: 'Investment Advisory', ar: 'استشارات استثمارية' } },
  { id: 'off-plan', name: { en: 'Off-plan Projects', ar: 'مشاريع تحت الإنشاء' } },
  { id: 'leasing', name: { en: 'Leasing', ar: 'تأجير' } },
];

export const specialtyById = (id: string): TaggableMeta | undefined => specialties.find((s) => s.id === id);
