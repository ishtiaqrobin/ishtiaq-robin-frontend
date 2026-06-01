"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2, Loader2, MessageSquare, Quote, Pencil } from "lucide-react";
import { IReview } from "@/types";
import { createOrUpdateReviewAction, deleteReviewAction } from "@/actions/review.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface ReviewManagerProps {
    reviews: IReview[];
    token: string;
    onRefresh: () => void;
    isAdmin: boolean;
}

export function ReviewManager({ reviews, token, onRefresh, isAdmin }: ReviewManagerProps) {
    const [loading, setLoading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IReview | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [rating, setRating] = useState(5);

    const handleEditOpen = (item: IReview) => {
        setEditingItem(item);
        setRating(item.rating);
        setIsEditOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            rating: rating,
            comment: formData.get("comment") as string,
        };

        setLoading(true);
        const result = await createOrUpdateReviewAction(data, token, editingItem.id);
        if (result.success) {
            toast.success(result.message);
            setIsEditOpen(false);
            onRefresh();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        const result = await deleteReviewAction(deleteId, token);
        if (result.success) {
            toast.success(result.message);
            setIsDeleteOpen(false);
            onRefresh();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    User Reviews & Testimonials
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((item) => (
                    <Card key={item.id} className="group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20">
                                        {item.user.image ? (
                                            <Image src={item.user.image} alt={item.user.name} fill className="object-cover" />
                                        ) : (
                                            <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-bold text-xs">
                                                {item.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold">{item.user.name}</CardTitle>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 ${i < item.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => handleEditOpen(item)}
                                            className="h-8 w-8 rounded-sm cursor-pointer"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                setDeleteId(item.id);
                                                setIsDeleteOpen(true);
                                            }}
                                            className="h-8 w-8 rounded-sm cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-2">
                            <div className="relative">
                                <Quote className="absolute top-2 right-2 h-8 w-8 text-primary/10 -z-0" />
                                <p className="text-sm text-muted-foreground relative z-10 italic leading-relaxed">
                                    &quot;{item.comment || "No comment provided."}&quot;
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                Submitted on {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-3xl sm:max-w-md overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>Update Review</DialogTitle>
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
                                                className={`h-8 w-8 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comment">User Feedback</Label>
                                <Textarea
                                    id="comment"
                                    name="comment"
                                    defaultValue={editingItem?.comment || ""}
                                    placeholder="Update the user's feedback..."
                                    required
                                    className="rounded-xl min-h-[120px] resize-none"
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
                                Update Review
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
