"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Pencil,
    Trash2,
    Loader2,
    Plus,
    Briefcase,
    Calendar,
    MapPin,
    Building2,
} from "lucide-react";
import { IExperience } from "@/types";
import {
    createExperienceAction,
    updateExperienceAction,
    deleteExperienceAction,
} from "@/actions/experience.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface ExperienceManagerProps {
    experiences: IExperience[];
    token: string;
    onRefresh: () => void;
}

export function ExperienceManager({ experiences, token, onRefresh }: ExperienceManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<IExperience | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleOpen = (item?: IExperience) => {
        setEditingItem(item || null);
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            company: formData.get("company"),
            title: formData.get("title"),
            startDate: new Date(formData.get("startDate") as string).toISOString(),
            endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string).toISOString() : null,
            location: formData.get("location"),
            description: formData.get("description"),
        };

        setLoading(true);

        const result = editingItem
            ? await updateExperienceAction(editingItem.id, data, token)
            : await createExperienceAction(data, token);

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
        const result = await deleteExperienceAction(deleteId, token);
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
                    <Briefcase className="h-5 w-5 text-primary" />
                    Professional Experience
                </h2>
                <Button
                    size={"md"}
                    onClick={() => handleOpen()}
                    className="cursor-pointer"
                >
                    {/* <Plus className="mr-2 h-4 w-4" /> */}
                    Add Experience
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((item) => (
                    <Card key={item.id} className="group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <CardHeader className="">
                            <div className="flex justify-between items-start">
                                <div className="rounded-xl text-primary">
                                    <Briefcase className="h-10 w-10" />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleOpen(item)}
                                        className="h-8 w-8 rounded-sm cursor-pointer"
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
                                        className="h-8 w-8 rounded-sm cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-2 space-y-3">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {item.company}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[10px]">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(item.startDate).getFullYear()} - {item.endDate ? new Date(item.endDate).getFullYear() : "Present"}
                                </div>
                                {item.location && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase">
                                        <MapPin className="h-3 w-3" />
                                        {item.location}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Update Modal */}
            {/* Create/Update Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="rounded-3xl sm:max-w-xl overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Update Experience" : "Add New Experience"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Job Title</Label>
                                <Input
                                    name="title"
                                    defaultValue={editingItem?.title || ""}
                                    placeholder="e.g. Senior Graphic Designer"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Company Name</Label>
                                <Input
                                    name="company"
                                    defaultValue={editingItem?.company || ""}
                                    placeholder="e.g. Creative Agency Ltd."
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    defaultValue={editingItem?.startDate ? new Date(editingItem.startDate).toISOString().split('T')[0] : ""}
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>End Date (Optional)</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    defaultValue={editingItem?.endDate ? new Date(editingItem.endDate).toISOString().split('T')[0] : ""}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Location</Label>
                                <Input
                                    name="location"
                                    defaultValue={editingItem?.location || ""}
                                    placeholder="e.g. Dhaka, Bangladesh (Remote)"
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    name="description"
                                    defaultValue={editingItem?.description || ""}
                                    placeholder="Describe your responsibilities, achievements, etc..."
                                    required
                                    className="rounded-xl resize-none"
                                    rows={5}
                                />
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
                    <DialogHeader><DialogTitle>Delete Experience Record</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">
                        Are you sure? This experience record will be removed from your portfolio.
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
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
