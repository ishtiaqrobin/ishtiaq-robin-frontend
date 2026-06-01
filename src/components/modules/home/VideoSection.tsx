"use client";

import { useEffect, useState } from "react";
import { videoService } from "@/services/video.service";
import { IVideo } from "@/types";
import SectionTitle from "@/components/common/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";

import { VideoCard } from "./card/VideoCard";
import { useInView } from "react-intersection-observer";

export function VideoSection() {
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    useEffect(() => {
        videoService.getVideos().then(({ data }) => {
            if (data) {
                setVideos(data.filter(v => v.isPublish));
            }
            setIsLoading(false);
        });
    }, []);

    if (!isLoading && videos.length === 0) return null;

    return (
        <section id="videos" ref={ref} className="py-24 relative overflow-hidden bg-transparent">
            {/* Video Wave Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.07]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20 50 10 T 100 10' stroke='%234f46e5' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: "160px 32px"
            }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full -z-10" />

            <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    subtitle="My Favorite Videos"
                    title="Featured Videos"
                    description="Watch my tutorials, project demos, and insights into my creative process"
                />

                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
                        {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="aspect-video w-full rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 ${videos.length > 1 ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-12 mt-16`}>
                        {videos.map((item, index) => (
                            <VideoCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
