export interface IReview {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}
