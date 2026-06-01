export interface IAbout {
  id: string;
  heroImg?: string | null;
  aboutMeImg?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAboutPayload {
  heroImg?: File;
  aboutMeImg?: File;
}

export interface UpdateAboutPayload {
  heroImg?: File;
  aboutMeImg?: File;
}
