"use client";

import { useEffect, useState, useCallback } from "react";
import { ReviewManager } from "@/components/modules/dashboard/admin/ReviewManager";
import { reviewService } from "@/services/review.service";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IReview } from "@/types";

export default function AdminReviewsPage() {
  const { session, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userToken = session?.token || "";

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await reviewService.getAllReviews();

    if (error) {
      toast.error("Failed to load reviews", { description: error.message });
      setReviews([]);
    } else {
      setReviews(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchReviews());
    }
  }, [authLoading, fetchReviews]);

  return (
    <div className="space-y-6 min-h-screen pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Testimonials</h1>
        <p className="text-muted-foreground mt-2">
          Manage and review feedback from your clients and platform users
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <ReviewManager
          reviews={reviews}
          token={userToken}
          onRefresh={fetchReviews}
          isAdmin={true}
        />
      )}
    </div>
  );
}
