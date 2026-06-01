"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Settings2,
  Linkedin,
  Facebook,
  Instagram,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  MapPin,
  Calendar,
  Briefcase,
  Dribbble,
} from "lucide-react";
import { ISettings } from "@/types";
import { updateSettingsAction } from "@/actions/setting.action";
import { toast } from "sonner";

interface SettingsManagerProps {
  settings: ISettings | null;
  token: string;
  onRefresh: () => void;
}

export function SettingsManager({
  settings,
  token,
  onRefresh,
}: SettingsManagerProps) {
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: Partial<ISettings> = {
      linkedinUrl: formData.get("linkedinUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      instagramUrl: formData.get("instagramUrl") as string,
      resumeLink: formData.get("resumeLink") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      address: formData.get("address") as string,
      availability: formData.get("availability") as string,
      experience: formData.get("experience") as string,
    };

    setLoading(true);
    const result = await updateSettingsAction(data, token);
    if (result.success) {
      toast.success(result.message);
      onRefresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <Card className="rounded-3xl border-none shadow-sm bg-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Global Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Social Links
              </h3>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn URL
                </Label>
                <Input
                  type="url"
                  name="linkedinUrl"
                  defaultValue={settings?.linkedinUrl || ""}
                  placeholder="https://linkedin.com/in/username"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> GitHub URL
                </Label>
                <Input
                  type="url"
                  name="githubUrl"
                  defaultValue={settings?.githubUrl || ""}
                  placeholder="https://github.com/username"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" /> Facebook URL
                </Label>
                <Input
                  type="url"
                  name="facebookUrl"
                  defaultValue={settings?.facebookUrl || ""}
                  placeholder="https://facebook.com/username"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> Instagram URL
                </Label>
                <Input
                  type="url"
                  name="instagramUrl"
                  defaultValue={settings?.instagramUrl || ""}
                  placeholder="https://instagram.com/username"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Contact Email
                </Label>
                <Input
                  type="email"
                  name="contactEmail"
                  defaultValue={settings?.contactEmail || ""}
                  placeholder="hello@example.com"
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Contact & Professional Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Contact & Professional
              </h3>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Resume Link
                </Label>
                <Input
                  type="url"
                  name="resumeLink"
                  defaultValue={settings?.resumeLink || ""}
                  placeholder="Google Drive or Dropbox link"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Contact Phone
                </Label>
                <Input
                  type="tel"
                  name="contactPhone"
                  defaultValue={settings?.contactPhone || ""}
                  placeholder="+880 1XXX XXXXXX"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> WhatsApp Number
                </Label>
                <Input
                  type="tel"
                  name="whatsappNumber"
                  defaultValue={settings?.whatsappNumber || ""}
                  placeholder="+880 1XXX XXXXXX"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address / Location
                </Label>
                <Input
                  type="text"
                  name="address"
                  defaultValue={settings?.address || ""}
                  placeholder="Dhaka, Bangladesh"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Availability
                </Label>
                <Input
                  type="text"
                  name="availability"
                  defaultValue={settings?.availability || ""}
                  placeholder="Full-time / Freelance"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Experience
                </Label>
                <Input
                  type="text"
                  name="experience"
                  defaultValue={settings?.experience || ""}
                  placeholder="3+ Years"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              size={"md"}
              className="cursor-pointer"
            >
              {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
              Save All Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
