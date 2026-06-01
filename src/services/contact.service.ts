/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env";
import { IContact } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const contactService = {
  async sendMessage(data: IContact): Promise<{
    success: boolean;
    message: string;
    error: any;
  }> {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to send message");
      }

      return {
        success: true,
        message: result.message || "Message sent successfully",
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "An error occurred",
        error,
      };
    }
  },
};
