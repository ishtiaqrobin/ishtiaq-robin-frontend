/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env";
import { IReview } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const reviewService = {
  async getAllReviews(): Promise<{
    data: IReview[] | null;
    error: any;
  }> {
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch reviews");
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getMyReview(token: string): Promise<{
    data: IReview | null;
    error: any;
  }> {
    try {
      const res = await fetch(`${API_URL}/reviews/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch your review");
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
};
