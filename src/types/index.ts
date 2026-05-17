export type VideoSource = "youtube" | "instagram" | "facebook";

export type DoctorVideo = {
  id: string;
  source: VideoSource;
  embedRef: string;
  canonicalUrl: string;
  doctorId: string;
  caption?: string;
};

export type Doctor = {
  id: string;
  slug: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  yearsExperience: number;
  highlights: string[];
};
