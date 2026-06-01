export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalProject: number;
  totalSkills: number;
  totalCertificate: number;
  totalCategories: number;
  totalVerifiedUsers: number;
  totalUnverifiedUsers: number;
  totalServices: number;
  totalReviews: number;
  totalExperience: number;
  totalVideos: number;
  totalGallery: number;
}

export interface PublicStats {
  totalStudents: number;
  totalTutors: number;
  totalCategories: number;
  avgRating: number;
  studentImages: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  image: string | null;
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBooking {
  id: string;
  studentId: string;
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
  tutor: {
    id: string;
    hourlyRate: number;
    user: {
      name: string;
      email: string;
      image: string | null;
    };
  };
}
