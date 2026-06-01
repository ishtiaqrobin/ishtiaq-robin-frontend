export interface IProject {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  liveUrl?: string;
  behanceUrl?: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  createdAt: string;
  updatedAt: string;
}
