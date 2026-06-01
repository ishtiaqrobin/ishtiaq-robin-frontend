"use client";

import { useEffect, useState, useCallback } from "react";
import { ProjectManager } from "@/components/modules/dashboard/admin/ProjectManager";
import { projectService } from "@/services/project.service";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IProject } from "@/types";

export default function AdminProjectsPage() {
  const { session, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userToken = session?.token || "";

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await projectService.getProjects();

    if (error) {
      toast.error("Failed to load projects", { description: error.message });
      setProjects([]);
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchProjects());
    }
  }, [authLoading, fetchProjects]);

  return (
    <div className="space-y-6 min-h-screen pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <p className="text-muted-foreground mt-2">
          Showcase your best work and manage project details
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <ProjectManager
          projects={projects}
          token={userToken}
          onRefresh={fetchProjects}
        />
      )}
    </div>
  );
}
