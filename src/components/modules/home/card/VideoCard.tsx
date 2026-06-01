"use client";

import { useState } from "react";
// import { motion } from "framer-motion";
import { motion } from "motion/react";

import { Play } from "lucide-react";
import Image from "next/image";
import { IVideo } from "@/types";

interface VideoCardProps {
    item: IVideo;
    index: number;
}

export function VideoCard({ item, index }: VideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
        }
        if (url.includes("vimeo.com")) {
            const id = url.split("/").pop();
            return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
        return url;
    };

    const getThumbnailUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
        }
        return ""; // Vimeo thumbnail usually requires API call, so we'll fallback or use a placeholder
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-3xl overflow-hidden backdrop-blur-2xl shadow-lg hover:shadow-2xl shadow-primary-400/25 hover:shadow-primary-400/50 bg-black/80 group duration-500"
        >
            {!isPlaying ? (
                <div
                    className="absolute inset-0 cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                >
                    {/* Thumbnail */}
                    <div className="absolute inset-0">
                        <Image
                            src={getThumbnailUrl(item.videoUrl) || "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop"}
                            alt={item.videoUrl || "Video thumbnail"}
                            fill
                            className="object-cover transition-transform  opacity-80"
                        />
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-105 transition-all shadow-2xl">
                            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-500">
                                <Play className="h-8 w-8 text-white fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="absolute bottom-6 left-8 right-8 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <h3 className="text-white text-xl font-bold mb-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            {item.videoUrl}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                            Click to play video content
                        </p>
                    </div>
                </div>
            ) : (
                <iframe
                    src={getEmbedUrl(item.videoUrl)}
                    title="Video content"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </motion.div >
    );
}
