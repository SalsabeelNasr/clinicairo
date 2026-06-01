import type { Doctor } from "@/types";

export const DOCTORS: Doctor[] = [
  {
    id: "tamer_abdelbaki",
    slug: "tamer-abdelbaki",
    name: "د. تامر عبد الباقي",
    title: "استشاري جراحة السمنة والمناظير",
    specialty: "إنقاص الوزن وحقن GLP-1",
    bio: "خبرة طويلة في متابعة مرضى السمنة داخل مصر وخارجها. يركز على خطة علاجية واضحة: كشف طبي، ضبط الجرعة، ومتابعة أسبوعية حتى تثبيت الوزن بعد العلاج.",
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b1d4?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 18,
    highlights: [
      "متابعة عن بُعد للمرضى المقيمين خارج مصر",
      "خبرة في برامج حقن أوزمبيك وويجوفي ومونجارو",
      "تركيز على تثبيت الوزن بعد نزوله",
    ],
  },
  {
    id: "osama_taha",
    slug: "osama-taha",
    name: "د. أسامة طه",
    title: "استشاري الباطنة والسمنة",
    specialty: "السمنة والتمثيل الغذائي",
    bio: "يقدّم استشارات فيديو دورية لمرضى خارج مصر يستخدمون حقن إنقاص الوزن في بلدهم. يهتم بضبط الأعراض الجانبية، التغذية، والتحاليل المخبرية.",
    imageUrl:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 15,
    highlights: [
      "شرح مبسّط للمريض ولأهله",
      "متابعة التحاليل والجرعات عن بُعد",
      "خطة غذائية عملية تناسب نمط حياتكِ في بلدكِ",
    ],
  },
  {
    id: "khaled_gawdat",
    slug: "khaled-gawdat",
    name: "د. خالد جودت",
    title: "استشاري السمنة والغدد الصماء",
    specialty: "علاج السمنة بالحقن",
    bio: "متخصص في متابعة مرضى GLP-1 مع التركيز على الاستمرارية والأمان. يساعد المريض على فهم متى يزيد الجرعة ومتى يثبّت الوزن بعد النزول.",
    imageUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 12,
    highlights: [
      "متابعة شهرية مرنة عبر الفيديو",
      "توجيه لاستخدام الحقن بأمان في المنزل",
      "دعم نفسي وغذائي خفيف بدون تعقيد",
    ],
  },
  {
    id: "nicolette_lammers",
    slug: "nicolette-lammers",
    name: "د. نيكوليت لامرز",
    title: "أخصائية طب الأسرة والسمنة",
    specialty: "إدارة الوزن المتكاملة",
    bio: "خبيرة في برامج إنقاص الوزن الطبية مع التركيز على الصحة العامة والرفاهية.",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 10,
    highlights: ["نهج شمولي", "دعم مستمر"],
  },
  {
    id: "stanislav_kvint",
    slug: "stanislav-kvint",
    name: "د. ستانيسلاف كفينت",
    title: "استشاري الغدد الصماء",
    specialty: "علاجات السمنة المتقدمة",
    bio: "متخصص في العلاجات الهرمونية للسمنة والتمثيل الغذائي.",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 20,
    highlights: ["خبرة دولية", "أبحاث متقدمة"],
  },
  {
    id: "newroz_narcin",
    slug: "newroz-narcin",
    name: "د. نوروز نرسين",
    title: "استشارية التغذية العلاجية",
    specialty: "إدارة الوزن والسمنة",
    bio: "تركز على تغيير نمط الحياة والأنظمة الغذائية المستدامة.",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 8,
    highlights: ["خطط مخصصة", "متابعة دقيقة"],
  },
  {
    id: "andreas_martin",
    slug: "andreas-martin",
    name: "د. أندرياس مارتن",
    title: "استشاري الطب الباطني",
    specialty: "السمنة والأمراض المزمنة",
    bio: "خبير في إدارة السمنة كجزء من الرعاية الصحية الشاملة.",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b1d4?auto=format&fit=crop&w=400&q=80",
    yearsExperience: 25,
    highlights: ["خبرة واسعة", "رعاية متكاملة"],
  },
] as const;

export function listDoctors(): Doctor[] {
  return [...DOCTORS];
}

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug);
}

export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id);
}
