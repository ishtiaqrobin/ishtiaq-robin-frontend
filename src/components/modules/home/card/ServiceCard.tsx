"use client";

// import { motion } from "framer-motion";
import { motion } from "motion/react";

import { IService } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import DynamicIcon from "@/components/common/DynamicIcon";
import { Zap } from "lucide-react";

interface ServiceCardProps {
    service: IService;
    index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
    const { name, description, icon } = service;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <Card className="p-6 md:p-8 h-full group shadow-lg hover:shadow-2xl shadow-primary-400/25 hover:shadow-primary-400/50 transition-all duration-500 cursor-default gap-2">
                <div className="mb-3 inline-flex rounded-2xl transition-all duration-500 w-fit">
                    <div
                        className="text-3xl group-hover:text-primary-400 transition-all group-hover:scale-105 transform duration-500"
                        style={{
                            color: icon?.color || "var(--primary)"
                        }}>
                        {icon ? (
                            <DynamicIcon icon={icon} size={64} />
                        ) : (
                            <Zap size={64} />
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {name}
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>
            </Card>
        </motion.div>
    );
}
