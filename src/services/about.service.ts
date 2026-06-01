import { env } from "@/env";
import { IAbout } from "@/types/about.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

export interface ServiceError {
  message: string;
}

export const aboutService = {
  /**
   * Get all about records (public, client-side, no-store to stay fresh)
   */
  getAbouts: async function (): Promise<{
    data: IAbout[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/about`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`,
        );
      }

      const response = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      console.error("Error fetching about data:", err);
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching about data",
        },
      };
    }
  },
};
