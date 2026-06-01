"use client";

import { useEffect, useState } from "react";
import { TestimonialCard } from "./card/TestimonialCard";
import { IReview } from "@/types";
import { reviewService } from "@/services/review.service";
import SectionTitle from "@/components/common/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
import { motion } from "motion/react";

export function TestimonialSection() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await reviewService.getAllReviews();
            if (data) {
                setReviews(data);
            }
            setIsLoading(false);
        };

        fetchReviews();
    }, []);

    if (!isLoading && reviews.length === 0) return null;

    return (
        <section
            id="testimonials"
            className="py-24 relative overflow-hidden bg-transparent">
            {/* Testimonials Node Background */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{
                maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
            }}>
                <div className="absolute inset-0 dark:opacity-[0.2] opacity-[0.15]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%234f46e5'/%3E%3Cpath d='M30 0 v60 M0 30 h60' stroke='%234f46e5' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px"
                }} />
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
            </div>

            <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    subtitle="Client Feedback"
                    title="Client Testimonials"
                    description="What people are saying about my work and professional collaborations"

                />
            </div>


            <div className="relative z-10 w-full overflow-hidden">
                {isLoading ? (
                    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                        <div className="grid gap-8 md:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-64 w-full rounded-3xl" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="relative group overflow-hidden py-10 mt-8 w-full">
                        <div className="flex animate-scroll hover:[animation-play-state:paused]">
                            {/* Duplicate reviews to create infinite scroll effect */}
                            {[...reviews, ...reviews].map((review, index) => (
                                <div key={`${review.id}-${index}`} className="shrink-0 w-[350px] md:w-[450px] px-4">
                                    <TestimonialCard review={review} index={index} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="container-custom mx-auto flex justify-center items-center mt-16 px-4 sm:px-6 lg:px-8 relative z-10">
                {!isLoading && !user?.isReviewed && user?.role !== "ADMIN" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            variant="default"
                            size="md"
                            className="shadow-lg shadow-primary/20 cursor-pointer"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    router.push("/login");
                                } else {
                                    router.push("/user-dashboard/review");
                                }
                            }}
                        >
                            {/* <Plus className="mr-2 h-5 w-5" /> */}
                            Write a Review
                        </Button>
                    </motion.div>
                )}
            </div>

            <style jsx global>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 5s linear infinite;
                    width: max-content;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section >
    );
}
