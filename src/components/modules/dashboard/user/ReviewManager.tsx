"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2, Loader2, MessageSquare, Quote, Pencil, Plus } from "lucide-react";
import { IReview } from "@/types";
import { createOrUpdateReviewAction, deleteReviewAction } from "@/actions/review.action";
import { reviewService } from "@/services/review.service";
import { toast } from "sonner";
// import { motion } from "framer-motion";
import { motion } from "motion/react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface ReviewManagerProps {
    token: string;
}

export function ReviewManager({ token }: ReviewManagerProps) {
    const [review, setReview] = useState<IReview | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [rating, setRating] = useState(5);

    const fetchMyReview = useCallback(async () => {
        const { data } = await reviewService.getMyReview(token);
        if (data && Array.isArray(data) && data.length > 0) {
            const myReview = data[0];
            setReview(myReview);
            setRating(myReview.rating);
        } else if (data && !Array.isArray(data)) {
            setReview(data);
            setRating(data.rating);
        } else {
            setReview(null);
            setRating(5);
        }
        setIsFetching(false);
    }, [token]);

    useEffect(() => {
        Promise.resolve().then(() => fetchMyReview());
    }, [fetchMyReview]);

    const handleEditOpen = () => {
        if (review) {
            setRating(review.rating);
        } else {
            setRating(5);
        }
        setIsEditOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            rating: rating,
            comment: formData.get("comment") as string,
        };

        setLoading(true);
        const result = await createOrUpdateReviewAction(data, token, review?.id);
        if (result.success) {
            toast.success(result.message);
            setIsEditOpen(false);
            fetchMyReview();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!review?.id) return;
        setLoading(true);
        const result = await deleteReviewAction(review.id, token);
        if (result.success) {
            toast.success(result.message);
            setIsDeleteOpen(false);
            setReview(null);
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    My Review & Feedback
                </h2>
                {!review && (
                    <Button
                        size="md"
                        variant="default"
                        onClick={handleEditOpen}
                        className="cursor-pointer"
                    >
                        Write Review
                    </Button>
                )}
            </div>

            {review ? (
                <motion.div
                    // initial={{ opacity: 0, y: 20 }}
                    // animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <Card className="group overflow-hidden rounded-3xl border shadow-lg bg-muted/20 hover:shadow-xl shadow-primary-400/30 hover:shadow-primary-400/40 transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                                        {review?.user?.image ? (
                                            <Image src={review.user.image} alt={review.user.name} fill className="object-cover" />
                                        ) : (
                                            <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-bold text-sm">
                                                {review?.user?.name?.charAt(0) || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold">{review?.user?.name || "User"}</CardTitle>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < (review?.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={handleEditOpen}
                                        className="h-8 w-8 rounded-sm cursor-pointer"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setIsDeleteOpen(true)}
                                        className="h-8 w-8 rounded-sm shadow-none cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <div className="relative">
                                <Quote className="absolute top-2 right-2 h-10 w-10 text-primary/10 -z-0" />
                                <p className="text-base text-muted-foreground relative z-10 italic leading-relaxed">
                                    &quot;{review.comment || "No comment provided."}&quot;
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/50 text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
                                Submitted on {new Date(review.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-primary/20">
                    <MessageSquare className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">You haven&apos;t shared your feedback yet</h3>
                    <p className="text-sm text-muted-foreground/60 mb-6">Your experience matters! Help others by sharing your story.</p>
                    <Button
                        size={"md"}
                        variant="default"
                        onClick={handleEditOpen}
                        className="cursor-pointer"
                    >
                        Share Your Experience
                    </Button>
                </div>
            )}

            {/* Edit/Create Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-3xl sm:max-w-md overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>{review ? "Update Your Review" : "Write a Review"}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="space-y-2 text-center p-4 rounded-2xl bg-muted/30">
                                <Label className="block mb-2 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Select Rating</Label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform active:scale-90"
                                        >
                                            <Star
                                                className={`h-10 w-10 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comment">Your Feedback</Label>
                                <Textarea
                                    id="comment"
                                    name="comment"
                                    defaultValue={review?.comment || ""}
                                    placeholder="Tell us about your experience..."
                                    required
                                    className="rounded-xl min-h-[150px] resize-none text-base"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                size="md"
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                disabled={loading}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                size="md"
                                type="submit"
                                disabled={loading}
                                className="cursor-pointer"
                            >
                                {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
                                {review ? "Update Review" : "Submit Review"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-3xl max-w-[400px]">
                    <DialogHeader><DialogTitle>Delete Review</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">Are you sure? This review will be permanently removed from the public wall.</div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={loading}
                            className="cursor-pointer flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="md"
                            onClick={handleDelete}
                            disabled={loading}
                            className="cursor-pointer flex-1"
                        >
                            {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
