/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Pencil,
    Trash2,
    Loader2,
    Plus,
    FolderKanban,
    Link as LinkIcon,
    Star,
    LayoutGrid,
    ExternalLink,
    Tags
} from "lucide-react";
import { IProject } from "@/types";
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
} from "@/actions/project.action";
import { projectService } from "@/services/project.service";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectManagerProps {
    projects: IProject[];
    token: string;
    onRefresh: () => void;
}

export function ProjectManager({ projects, token, onRefresh }: ProjectManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<IProject | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);

    const {
        file: thumbnailFile,
        isCompressing,
        handleFileChange: handleThumbnailChange,
        reset: resetThumbnail,
        inputRef: thumbnailRef,
    } = useImageUpload({ maxSizeMB: 5 });

    useEffect(() => {
        projectService.getCategories().then(({ data }) => {
            if (data) setCategories(data);
        });
    }, []);

    const handleOpen = (item?: IProject) => {
        setEditingItem(item || null);
        resetThumbnail();
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const tagsInput = formData.get("tags") as string;
        const tags = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

        const jsonData = {
            title: formData.get("title"),
            description: formData.get("description"),
            liveUrl: formData.get("liveUrl"),
            behanceUrl: formData.get("behanceUrl"),
            tags: tags,
            isFeatured: formData.get("isFeatured") === "on",
            isPublished: formData.get("isPublished") === "on",
            categoryId: formData.get("categoryId"),
        };

        if (!jsonData.categoryId) {
            toast.error("Please select a category");
            return;
        }

        const finalFormData = new FormData();
        finalFormData.append("data", JSON.stringify(jsonData));

        if (thumbnailFile) {
            finalFormData.append("thumbnail", thumbnailFile);
        }

        setLoading(true);

        try {
            const result = editingItem
                ? await updateProjectAction(editingItem.id, finalFormData, token)
                : await createProjectAction(finalFormData, token);

            if (result.success) {
                toast.success(result.message);
                setIsOpen(false);
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Project save error:", error);
            toast.error("An unexpected error occurred while saving.");
            resetThumbnail();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        const result = await deleteProjectAction(deleteId, token);
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
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    Project Portfolio
                </h2>
                <Button
                    size="md"
                    variant="default"
                    onClick={() => handleOpen()}
                    className="cursor-pointer">
                    Add Project
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((item) => (
                    <Card key={item.id} className="p-0 group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <div className="relative aspect-video overflow-hidden">
                            {item.thumbnail ? (
                                <Image
                                    src={item.thumbnail}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                    <FolderKanban className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 z-10">
                                {item.isFeatured && (
                                    <div className="bg-yellow-500 text-white p-1 rounded-full shadow-sm">
                                        <Star className="h-3 w-3 fill-current" />
                                    </div>
                                )}
                                {!item.isPublished && (
                                    <div className="bg-slate-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm">
                                        Draft
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
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
                                    onClick={() => { setDeleteId(item.id); setIsDeleteOpen(true); }}
                                    className="h-9 w-9 shadow-none cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-5 space-y-3">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg truncate">{item.title}</h3>
                                <p className="text-xs text-primary font-bold uppercase tracking-wider">{item.category?.name || "Uncategorized"}</p>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {item.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">#{tag}</span>
                                ))}
                                {item.tags.length > 3 && <span className="text-[10px] text-muted-foreground font-medium">+{item.tags.length - 3} others</span>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="rounded-3xl sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Update Project" : "Add New Project"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Project Title</Label>
                                <Input
                                    name="title"
                                    defaultValue={editingItem?.title || ""}
                                    placeholder="Enter project name..."
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Category</Label>
                                <Select name="categoryId" defaultValue={editingItem?.categoryId || ""}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Thumbnail Image</Label>
                                <Input
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    ref={thumbnailRef}
                                    onChange={handleThumbnailChange}
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
                                        Max 5MB · Auto-compressed to WebP
                                    </p>
                                )}
                                {editingItem?.thumbnail && (
                                    <p className="text-[10px] text-muted-foreground mt-1">Current: {editingItem.thumbnail.split('/').pop()}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> Live URL</Label>
                                <Input
                                    name="liveUrl"
                                    defaultValue={editingItem?.liveUrl || ""}
                                    placeholder="https://..."
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Behance URL</Label>
                                <Input
                                    name="behanceUrl"
                                    defaultValue={editingItem?.behanceUrl || ""}
                                    placeholder="https://behance.net/..."
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" /> Tags (comma separated)</Label>
                                <Input
                                    name="tags"
                                    defaultValue={editingItem?.tags.join(", ") || ""}
                                    placeholder="React, Next.js, Tailwind..."
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    name="description"
                                    defaultValue={editingItem?.description || ""}
                                    placeholder="Describe the project..."
                                    required
                                    className="rounded-xl resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <Label className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> Featured Project</Label>
                                <Switch name="isFeatured" defaultChecked={editingItem?.isFeatured || false} />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <Label>Published</Label>
                                <Switch name="isPublished" defaultChecked={editingItem ? editingItem.isPublished : true} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => setIsOpen(false)}
                                disabled={loading}
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
                    <DialogHeader><DialogTitle>Delete Project</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">Are you sure? This project will be removed from your portfolio.</div>
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
