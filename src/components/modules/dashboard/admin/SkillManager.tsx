"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pencil,
    Trash2,
    Loader2,
    Zap,
    Cpu,
} from "lucide-react";
import { ISkill } from "@/types";
import DynamicIcon from "@/components/common/DynamicIcon";
import {
    createSkillAction,
    updateSkillAction,
    deleteSkillAction,
} from "@/actions/skill.action";
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

interface Category {
    id: string;
    name: string;
}

interface SkillManagerProps {
    skills: ISkill[];
    categories: Category[];
    token: string;
    onRefresh: () => void;
}

export function SkillManager({ skills, categories, token, onRefresh }: SkillManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<ISkill | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleOpen = (item?: ISkill) => {
        setEditingItem(item || null);
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name"),
            level: formData.get("level"),
            categoryId: formData.get("categoryId"),
            icon: {
                name: formData.get("iconName"),
                library: formData.get("iconLibrary"),
                color: formData.get("iconColor"),
            },
        };

        setLoading(true);

        const result = editingItem
            ? await updateSkillAction(editingItem.id, data, token)
            : await createSkillAction(data, token);

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
        const result = await deleteSkillAction(deleteId, token);
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
                    <Cpu className="h-5 w-5 text-primary" />
                    Technical Skills
                </h2>
                <Button
                    variant="default"
                    size="md"
                    onClick={() => handleOpen()}
                    className="cursor-pointer"
                >
                    Add Skill
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((item) => (
                    <Card key={item.id} className="group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <CardHeader className="p-5 pb-2">
                            <div className="flex justify-between items-start">
                                <div
                                    className="rounded-xl"
                                    style={{
                                        color: item.icon?.color || "var(--primary)"
                                    }}
                                >
                                    {item.icon ? (
                                        <DynamicIcon icon={item.icon} size={48} />
                                    ) : (
                                        <Zap className="h-6 w-6" />
                                    )}
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
                                        onClick={() => { setDeleteId(item.id); setIsDeleteOpen(true); }}
                                        className="h-8 w-8 rounded-sm cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-2 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    item.level === 'Expert' ? 'bg-green-500/20 text-green-600' :
                                    item.level === 'Recently Learned' ? 'bg-blue-500/20 text-blue-600' :
                                    'bg-orange-500/20 text-orange-600'
                                }`}>
                                    {item.level}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Category: {item.category?.name}</p>
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
                                {editingItem ? "Update Skill" : "Add New Skill"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Skill Name</Label>
                                <Input
                                    name="name"
                                    defaultValue={editingItem?.name || ""}
                                    placeholder="e.g. Adobe Photoshop"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select name="categoryId" defaultValue={editingItem?.categoryId || ""}>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Level</Label>
                                    <Select name="level" defaultValue={editingItem?.level || "Expert"}>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Expert">Expert</SelectItem>
                                            <SelectItem value="Recently Learned">Recently Learned</SelectItem>
                                            <SelectItem value="Learning">Learning</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icon Library</Label>
                                    <Input
                                        name="iconLibrary"
                                        defaultValue={editingItem?.icon?.library || "si"}
                                        placeholder="e.g. si, fa, io"
                                        required
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon Name</Label>
                                    <Input
                                        name="iconName"
                                        defaultValue={editingItem?.icon?.name || ""}
                                        placeholder="e.g. SiAdobephotoshop"
                                        required
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Icon Color (Hex)</Label>
                                <Input
                                    name="iconColor"
                                    type="text"
                                    defaultValue={editingItem?.icon?.color || "#"}
                                    placeholder="#31A8FF"
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
                                className="cursor-pointer">
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
                    <DialogHeader><DialogTitle>Delete Skill</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">Are you sure? This skill will be removed from your portfolio.</div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={loading}
                            className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="md"
                            onClick={handleDelete}
                            disabled={loading}
                            className="cursor-pointer">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
