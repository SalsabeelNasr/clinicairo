import type { DoctorVideo } from "@/types";

type EmbeddableVideo = Pick<DoctorVideo, "source" | "embedRef" | "canonicalUrl">;

const DOCTOR_VIDEOS: DoctorVideo[] = [
  {
    id: "tamer_abdelbaki_v1",
    source: "youtube",
    embedRef: "pzk0ko_q9c0",
    canonicalUrl: "https://www.youtube.com/watch?v=pzk0ko_q9c0",
    doctorId: "tamer_abdelbaki",
    caption: "شرح برنامج إنقاص الوزن والمتابعة الطبية",
  },
  {
    id: "tamer_abdelbaki_v2",
    source: "youtube",
    embedRef: "gDnReoKNYUM",
    canonicalUrl: "https://www.youtube.com/watch?v=gDnReoKNYUM",
    doctorId: "tamer_abdelbaki",
    caption: "نتائج مرضى وماذا تتوقع في الأسابيع الأولى",
  },
  {
    id: "osama_taha_v1",
    source: "youtube",
    embedRef: "7S-Tp6nVFSs",
    canonicalUrl: "https://www.youtube.com/watch?v=7S-Tp6nVFSs",
    doctorId: "osama_taha",
    caption: "كيف تبدأ رحلة الحقن بثقة",
  },
  {
    id: "osama_taha_v2",
    source: "youtube",
    embedRef: "u-YZr1UhppM",
    canonicalUrl: "https://www.youtube.com/watch?v=u-YZr1UhppM",
    doctorId: "osama_taha",
    caption: "نصائح غذائية أثناء العلاج",
  },
  {
    id: "khaled_gawdat_v1",
    source: "facebook",
    embedRef: "https://www.facebook.com/Obesityegclinic/videos/844717197134194/",
    canonicalUrl:
      "https://www.facebook.com/Obesityegclinic/videos/844717197134194/",
    doctorId: "khaled_gawdat",
    caption: "قصص نجاح من العيادة",
  },
  {
    id: "khaled_gawdat_v2",
    source: "facebook",
    embedRef: "https://www.facebook.com/Obesityegclinic/videos/205485345971843/",
    canonicalUrl:
      "https://www.facebook.com/Obesityegclinic/videos/205485345971843/",
    doctorId: "khaled_gawdat",
    caption: "معلومات عن الحقن والمتابعة",
  },
];

export function getVideosByDoctor(doctorId: string): DoctorVideo[] {
  return DOCTOR_VIDEOS.filter((v) => v.doctorId === doctorId);
}

export function videoEmbedSrc(v: EmbeddableVideo): string {
  switch (v.source) {
    case "youtube":
      return `https://www.youtube.com/embed/${v.embedRef}`;
    case "instagram":
      return `https://www.instagram.com/${v.embedRef}/embed`;
    case "facebook":
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.canonicalUrl)}&show_text=false`;
  }
}
