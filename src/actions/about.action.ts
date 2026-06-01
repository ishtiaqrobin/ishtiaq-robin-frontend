"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { IAbout } from "@/types/about.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ActionResult {
  success: boolean;
  message: string;
  data?: IAbout | null;
}

/**
 * Create a new About record (with image uploads via FormData → Cloudinary)
 */
export async function createAboutAction(
  formData: FormData,
  token: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/about`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // multipart/form-data sent directly
    });

    const response = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: response.message || "Failed to create about record",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin-dashboard/about");
    revalidateTag("about", "max");

    return { success: true, message: "About created successfully", data: response.data };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

/**
 * Update an existing About record (with optional image uploads)
 */
export async function updateAboutAction(
  id: string,
  formData: FormData,
  token: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/about/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const response = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: response.message || "Failed to update about record",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin-dashboard/about");
    revalidateTag("about", "max");

    return { success: true, message: "About updated successfully", data: response.data };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

/**
 * Delete an About record
 */
export async function deleteAboutAction(
  id: string,
  token: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/about/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: response.message || "Failed to delete about record",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin-dashboard/about");
    revalidateTag("about", "max");

    return { success: true, message: "About deleted successfully" };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
