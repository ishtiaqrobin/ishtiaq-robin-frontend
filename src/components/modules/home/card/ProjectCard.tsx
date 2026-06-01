"use client";

// import { motion } from "framer-motion";
import { motion } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ExternalLink, ArrowUpRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { IProject } from "@/types";
import { BsBehance } from "react-icons/bs";

interface ProjectCardProps {
    item: IProject;
}

export function ProjectCard({ item }: ProjectCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="h-full"
        >
            {/* shadow-lg hover:shadow-2xl shadow-primary-400/25 hover:shadow-primary-400/50 */}
            <Card className="p-0 group relative h-full overflow-hidden rounded-3xl border-none backdrop-blur-2xl shadow-lg hover:shadow-2xl shadow-primary-400/25 hover:shadow-primary-400/50 transition-all duration-500 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-16/11 overflow-hidden">
                    {item.thumbnail ? (
                        <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                            <LayoutGrid className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                    )}

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-primary shadow-lg">
                            {item.category?.name}
                        </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 z-10 backdrop-blur-sm">
                        {item.liveUrl && (
                            <Link
                                href={item.liveUrl}
                                target="_blank"
                                className="h-12 w-12 rounded-full bg-white text-primary flex items-center justify-center hover:scale-105 transition-transform shadow-xl hover:bg-primary hover:text-white duration-500"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </Link>
                        )}
                        {item.behanceUrl && (
                            <Link
                                href={item.behanceUrl}
                                target="_blank"
                                className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-xl hover:bg-white hover:text-[#0057ff] duration-500"
                            >
                                <BsBehance className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                            {item.title}
                            {/* <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" /> */}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed font-medium">
                            {item.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-5 border-t border-primary/5">
                        {item.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-3 py-1 rounded-lg bg-primary/5 text-primary font-bold border border-primary/10 hover:bg-primary hover:text-white transition-colors duration-300">
                                {tag.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
