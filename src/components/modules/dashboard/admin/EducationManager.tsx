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
    GraduationCap,
    Calendar,
    MapPin,
    Building2,
} from "lucide-react";
import { IEducation } from "@/types";
import {
    createEducationAction,
    updateEducationAction,
    deleteEducationAction,
} from "@/actions/education.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface EducationManagerProps {
    educations: IEducation[];
    token: string;
    onRefresh: () => void;
}

export function EducationManager({ educations, token, onRefresh }: EducationManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<IEducation | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleOpen = (item?: IEducation) => {
        setEditingItem(item || null);
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            degree: formData.get("degree"),
            institution: formData.get("institution"),
            board: formData.get("board"),
            startDate: new Date(formData.get("startDate") as string).toISOString(),
            endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string).toISOString() : null,
            result: formData.get("result"),
            group: formData.get("group"),
        };

        setLoading(true);

        const result = editingItem
            ? await updateEducationAction(editingItem.id, data, token)
            : await createEducationAction(data, token);

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
        const result = await deleteEducationAction(deleteId, token);
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
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Education History
                </h2>
                <Button
                    variant="default"
                    size="md"
                    // icon={Plus}
                    onClick={() => handleOpen()}
                    className="cursor-pointer"
                >
                    Add Education
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {educations.map((item) => (
                    <Card key={item.id} className="group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <CardHeader className="">
                            <div className="flex justify-between items-start">
                                <div className="rounded-xl text-primary">
                                    <GraduationCap className="h-10 w-10" />
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
                                <h3 className="font-bold text-lg">{item.degree}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {item.institution}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[10px]">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(item.startDate).getFullYear()} - {item.endDate ? new Date(item.endDate).getFullYear() : "Present"}
                                </div>
                                {item.result && (
                                    <div className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase">
                                        Result: {item.result}
                                    </div>
                                )}
                                {item.group && (
                                    <div className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase">
                                        Group: {item.group}
                                    </div>
                                )}
                            </div>
                            {item.board && (
                                <p className="text-[11px] text-muted-foreground font-medium italic">
                                    Board: {item.board}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="rounded-3xl sm:max-w-xl overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Update Education" : "Add New Education"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Degree / Certification</Label>
                                <Input
                                    name="degree"
                                    defaultValue={editingItem?.degree || ""}
                                    placeholder="e.g. B.Sc in Computer Science"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Institution</Label>
                                <Input
                                    name="institution"
                                    defaultValue={editingItem?.institution || ""}
                                    placeholder="e.g. University of Example"
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

                            <div className="space-y-2">
                                <Label>Board (Optional)</Label>
                                <Input
                                    name="board"
                                    defaultValue={editingItem?.board || ""}
                                    placeholder="e.g. Dhaka Board"
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Group / Major (Optional)</Label>
                                <Input
                                    name="group"
                                    defaultValue={editingItem?.group || ""}
                                    placeholder="e.g. Science"
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Result</Label>
                                <Input
                                    name="result"
                                    defaultValue={editingItem?.result || ""}
                                    placeholder="e.g. GPA 4.75 out of 5.00"
                                    required
                                    className="rounded-xl"
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
                    <DialogHeader><DialogTitle>Delete Education Record</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">
                        Are you sure? This education record will be removed from your portfolio.
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
