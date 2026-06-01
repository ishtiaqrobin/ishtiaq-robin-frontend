"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Pencil,
    Trash2,
    Loader2,
    Plus,
    Video,
    Youtube,
    Play,
} from "lucide-react";
import { IVideo } from "@/types";
import {
    createVideoAction,
    updateVideoAction,
    deleteVideoAction,
} from "@/actions/video.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface VideoManagerProps {
    videos: IVideo[];
    token: string;
    onRefresh: () => void;
}

export function VideoManager({ videos, token, onRefresh }: VideoManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<IVideo | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://www.youtube.com/embed/${id}` : url;
        }
        if (url.includes("vimeo.com")) {
            const id = url.split("/").pop();
            return `https://player.vimeo.com/video/${id}`;
        }
        return url;
    };

    const getThumbnailUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
        }
        return null;
    };

    const handleOpen = (item?: IVideo) => {
        setEditingItem(item || null);
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            videoUrl: formData.get("videoUrl"),
            isPublish: formData.get("isPublish") === "on",
        };

        setLoading(true);

        const result = editingItem
            ? await updateVideoAction(editingItem.id, data, token)
            : await createVideoAction(data, token);

        if (result.success) {
            toast.success(result.message);
            setIsOpen(false);
            onRefresh();
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        const result = await deleteVideoAction(deleteId, token);
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
                    <Video className="h-5 w-5 text-primary" />
                    Video Content
                </h2>
                <Button
                    size="md"
                    variant="default"
                    onClick={() => handleOpen()}
                    className="cursor-pointer">
                    Add Video
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((item) => (
                    <Card key={item.id} className="p-0 group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <div
                            className="relative aspect-video bg-black flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                            {playingId === item.id ? (
                                <iframe
                                    src={`${getEmbedUrl(item.videoUrl)}?autoplay=1`}
                                    title="Video player"
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div
                                    className="absolute inset-0 flex items-center justify-center group"
                                    onClick={() => setPlayingId(item.id)}
                                >
                                    {getThumbnailUrl(item.videoUrl) ? (
                                        <Image
                                            src={getThumbnailUrl(item.videoUrl)!}
                                            alt="Video thumbnail"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-muted/20" />
                                    )}
                                    <Play className="h-12 w-12 text-white/50 group-hover:text-primary group-hover:scale-125 transition-all duration-300 z-10" />
                                    {!item.isPublish && (
                                        <div className="absolute top-2 left-2 bg-slate-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm z-10">Draft</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4 space-y-5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Youtube className="h-4 w-4 text-red-500" />
                                <p className="text-xs font-medium truncate flex-1">{item.videoUrl}</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleOpen(item)}
                                        className="h-9 w-9 rounded-md cursor-pointer"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => { setDeleteId(item.id); setIsDeleteOpen(true); }}
                                        className="h-9 w-9 rounded-md cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="rounded-3xl sm:max-w-md overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Update Video" : "Add New Video"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 font-bold"><Youtube className="h-4 w-4 text-red-500" /> Video URL (YouTube/Vimeo)</Label>
                                <Input
                                    name="videoUrl"
                                    defaultValue={editingItem?.videoUrl || ""}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                                <div className="space-y-0.5">
                                    <Label className="font-bold">Publish Publicly</Label>
                                    <p className="text-[10px] text-muted-foreground">Make this video visible on your portfolio</p>
                                </div>
                                <Switch name="isPublish" defaultChecked={editingItem ? editingItem.isPublish : true} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                size="md"
                                type="button"
                                onClick={() => setIsOpen(false)}
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
                                {editingItem ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-3xl max-w-[400px]">
                    <DialogHeader><DialogTitle>Delete Video</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">Are you sure? This video will be permanently removed from your portfolio.</div>
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
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
