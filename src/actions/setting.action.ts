"use client";

import { ISettings } from "@/types";
import { settingService } from "@/services/setting.service";

export const updateSettingsAction = async (
  data: Partial<ISettings>,
  token: string,
) => {
  try {
    const result = await settingService.updateSettings(token, data);
    if (result.error) {
      return {
        success: false,
        message: result.error.message,
      };
    }
    return {
      success: true,
      message: "Settings updated successfully",
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
};
