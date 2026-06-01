export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  phone?: string | null;
  isActive?: boolean;
  isBanned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Review {
  id: string;
  studentId: string;
  tutorId: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  student: User;
}
