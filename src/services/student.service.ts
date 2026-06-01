import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export interface StudentStats {
  totalBookings: number;
  upcomingClasses: number;
  completedClasses: number;
  totalHours: number;
  totalSpent: number;
}

export const studentService = {
  /**
   * Get student dashboard stats
   */
  getStats: async function (
    token: string,
  ): Promise<{ data: StudentStats | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/users/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      console.error("Error fetching student stats:", err);
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching stats",
        },
      };
    }
  },
};
