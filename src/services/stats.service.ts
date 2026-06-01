/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env";
import { IStats } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const statsService = {
  async getStats(): Promise<{
    data: IStats | null;
    error: any;
  }> {
    try {
      const res = await fetch(`${API_URL}/public-stats`, {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch stats");
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
};
