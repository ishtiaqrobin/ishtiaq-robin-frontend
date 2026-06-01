"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    BookOpen
} from "lucide-react";
import { Category } from "@/types/category.type";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface CategoryManagerProps {
    categories: Category[];
    token: string;
    onRefresh: () => void;
}

export function CategoryManager({ categories, token, onRefresh }: CategoryManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setDescription(category.description || "");
        } else {
            setEditingCategory(null);
            setName("");
            setDescription("");
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        setLoading(true);
        const payload = { name, description };

        const { error } = editingCategory
            ? await categoryService.updateCategory(token, editingCategory.id, payload)
            : await categoryService.createCategory(token, payload);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success(editingCategory ? "Category updated successfully" : "Category created successfully");
            setIsDialogOpen(false);
            onRefresh();
        }
        setLoading(false);
    };

    const handleDeleteClick = (id: string) => {
        setCategoryIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryIdToDelete) return;

        setLoading(true);
        const { error } = await categoryService.deleteCategory(token, categoryIdToDelete);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Category deleted successfully");
            onRefresh();
        }
        setIsDeleteDialogOpen(false);
        setCategoryIdToDelete(null);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    All Categories ({categories.length})
                </h2>
                <Button
                    onClick={() => handleOpenDialog()}
                    size="md"
                    className="cursor-pointer">
                    Add New Category
                </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.id} className="group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <CardHeader className="">
                            <div className="flex justify-between items-start">
                                <div className="rounded-xl text-primary">
                                    <BookOpen className="h-10 w-10" />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        className="h-8 w-8 rounded-sm cursor-pointer"
                                        onClick={() => handleOpenDialog(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 rounded-sm cursor-pointer"
                                        onClick={() => handleDeleteClick(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-2 space-y-3">
                            <h3 className="font-bold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {category.description || "No description provided"}
                            </p>
                        </CardContent>
                    </Card>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                        <p className="text-muted-foreground">No categories found. Create your first category.</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-3xl sm:max-w-md overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Update Category" : "Add New Category"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Mathematics, Programming..."
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description (Optional)</Label>
                            <Textarea
                                id="desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell us more about this category..."
                                rows={4}
                                className="rounded-xl resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            size="md"
                            onClick={handleSave}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {editingCategory ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-3xl max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-muted-foreground">
                        Are you sure? This category and its associated data will be removed.
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={loading}
                            className="cursor-pointer flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="md"
                            onClick={confirmDelete}
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
