"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Pencil,
    Trash2,
    Loader2,
    Image as ImageIconLucide,
} from "lucide-react";
import { IGallery } from "@/types";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
    createGalleryAction,
    updateGalleryAction,
    deleteGalleryAction,
} from "@/actions/gallery.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface GalleryManagerProps {
    galleries: IGallery[];
    token: string;
    onRefresh: () => void;
}

export function GalleryManager({ galleries, token, onRefresh }: GalleryManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<IGallery | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isPublish, setIsPublish] = useState(true);

    const {
        file: compressedFile,
        preview,
        isCompressing,
        handleFileChange,
        reset: resetImage,
        inputRef: fileRef,
    } = useImageUpload({ maxSizeMB: 5 });

    const handleOpen = (item?: IGallery) => {
        setEditingItem(item || null);
        setIsPublish(item ? (item.isPublish ?? true) : true);
        resetImage();
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const title = (form.elements.namedItem("title") as HTMLInputElement)?.value?.trim();
        const description = (form.elements.namedItem("description") as HTMLTextAreaElement)?.value?.trim();

        // Require image for new entries
        if (!compressedFile && !editingItem) {
            toast.error("Please select an image to upload.");
            return;
        }

        // Build FormData: non-file fields as JSON under "data" key
        const formData = new FormData();
        const jsonPayload: Record<string, unknown> = { isPublish };
        if (title) jsonPayload.title = title;
        if (description) jsonPayload.description = description;

        formData.append("data", JSON.stringify(jsonPayload));
        if (compressedFile) formData.append("image", compressedFile);

        setLoading(true);

        try {
            const result = editingItem
                ? await updateGalleryAction(editingItem.id, formData, token)
                : await createGalleryAction(formData, token);

            if (result.success) {
                toast.success(result.message);
                setIsOpen(false);
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Gallery save error:", error);
            toast.error("An unexpected error occurred while saving.");
            resetImage(); // Clear input if it failed
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        const result = await deleteGalleryAction(deleteId, token);
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
                    <ImageIconLucide className="h-5 w-5 text-primary" />
                    Portfolio Gallery
                </h2>
                <Button
                    size="md"
                    variant="default"
                    onClick={() => handleOpen()}
                    className="cursor-pointer">
                    Add Image
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleries.map((item) => (
                    <Card key={item.id} className="p-0 group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all gap-2">
                        <div className="relative aspect-square overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.title || "Gallery Item"}
                                fill
                                className="object-cover transition-transform group-hover:scale-110 duration-500"
                            />
                            {!item.isPublish && (
                                <div className="absolute top-2 right-2 bg-slate-500/90 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider z-10 shadow-sm">
                                    Draft
                                </div>
                            )}
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm duration-500">
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleOpen(item)}
                                    className="h-9 w-9 cursor-pointer"
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
                                    className="h-9 w-9 shadow-none cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4 space-y-1">
                            <h3 className="font-bold truncate text-sm">{item.title || "Untitled Artwork"}</h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Gallery Item</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="rounded-3xl sm:max-w-lg overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Update Gallery Item" : "Add New Image"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="font-bold">Image File</Label>
                                {preview && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/20 shadow-inner">
                                        <Image src={preview} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    ref={fileRef}
                                    onChange={handleFileChange}
                                    disabled={isCompressing}
                                    className="rounded-xl cursor-pointer"
                                />
                                {isCompressing ? (
                                    <p className="text-[11px] text-primary flex items-center gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Compressing image…
                                    </p>
                                ) : (
                                    <p className="text-[11px] text-muted-foreground">
                                        Max 5MB · Auto-compressed to WebP · JPEG, PNG, GIF supported
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    name="title"
                                    defaultValue={editingItem?.title || ""}
                                    placeholder="Artwork or Project title..."
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold">Description</Label>
                                <Textarea
                                    name="description"
                                    defaultValue={editingItem?.description || ""}
                                    placeholder="Brief details about this piece..."
                                    className="rounded-xl resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                                <div className="space-y-0.5">
                                    <Label className="font-bold">Publish Publicly</Label>
                                    <p className="text-[10px] text-muted-foreground">Display this image in your public gallery</p>
                                </div>
                                <Switch
                                    checked={isPublish}
                                    onCheckedChange={setIsPublish}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => setIsOpen(false)}
                                disabled={loading || isCompressing}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                size="md"
                                disabled={loading || isCompressing}
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
                    <DialogHeader><DialogTitle>Delete Gallery Item</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">
                        Are you sure? This image will be permanently removed from your gallery.
                    </div>
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
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
