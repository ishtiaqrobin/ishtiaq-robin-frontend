"use client";



import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote as QuoteIcon, Pencil } from "lucide-react";
import { IReview } from "@/types";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface TestimonialCardProps {
    review: IReview;
    index: number;
}

export function TestimonialCard({ review, index }: TestimonialCardProps) {
    const { user } = useAuth();
    return (
        <div className="h-full pt-8">
            {/* shadow-lg hover:shadow-2xl shadow-primary-400/25 hover:shadow-primary-400/50 */}
            <Card className="p-0 h-full relative overflow-visible border backdrop-blur-md shadow-lg hover:shadow-xl shadow-primary-400/25 hover:shadow-primary-400/40 transition-all duration-500 group rounded-3xl">
                <CardContent className="pt-14 pb-8 px-8 flex flex-col h-full">
                    {/* Avatar positioning */}
                    <div className="absolute -top-7 left-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all duration-500" />
                            <Avatar className="h-16 w-16 border-4 border-background dark:border-primary/50 shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                                <AvatarImage src={review.user.image || ""} alt={review.user.name} />
                                <AvatarFallback className="bg-primary text-white font-bold text-xl">{review.user.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Quote Icon */}
                    <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-all duration-500 transform group-hover:scale-110 z-10">
                        <QuoteIcon className="h-12 w-12 fill-current" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1.5 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20"} transition-all duration-300 transform group-hover:scale-110`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                            />
                        ))}
                    </div>

                    {/* Comment */}
                    <div className="space-y-4 grow">
                        <p className="text-foreground/90 italic leading-relaxed text-base font-medium">
                            &quot;{review.comment || "Collaborating on this project was an absolute pleasure. High quality work and great communication!"}&quot;
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="pt-6 mt-8 border-t border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{review.user.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">Verified Client</p>
                            </div>

                            {user?.id === review.userId && (
                                <Link
                                    href="/user-dashboard/review"
                                    className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
