"use client";

import { useState } from "react";
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
    Wrench,
    Zap,
    Layout,
} from "lucide-react";
import { IService } from "@/types";
import DynamicIcon from "@/components/common/DynamicIcon";
import {
    createServiceAction,
    updateServiceAction,
    deleteServiceAction,
} from "@/actions/service.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface ServiceManagerProps {
    services: IService[];
    token: string;
    onRefresh: () => void;
}

export function ServiceManager({ services, token, onRefresh }: ServiceManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<IService | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleOpen = (item?: IService) => {
        setEditingItem(item || null);
        setIsOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            icon: {
                name: formData.get("iconName"),
                library: formData.get("iconLibrary"),
                color: formData.get("iconColor"),
                bgColor: formData.get("iconBgColor"),
            },
            isPublish: formData.get("isPublish") === "on",
        };

        setLoading(true);

        const result = editingItem
            ? await updateServiceAction(editingItem.id, data, token)
            : await createServiceAction(data, token);

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
        const result = await deleteServiceAction(deleteId, token);
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
                    <Wrench className="h-5 w-5 text-primary" />
                    My Services
                </h2>
                <Button
                    variant="default"
                    size="md"
                    // icon="Plus"
                    onClick={() => handleOpen()}
                    className="cursor-pointer"
                >
                    Add Service
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item) => (
                    <Card key={item.id} className="group overflow-hidden rounded-2xl border shadow-lg bg-muted/20 hover:shadow-xl hover:shadow-primary-400/25 transition-all">
                        <CardHeader className="">
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
                        <CardContent className="p-5 pt-2 space-y-3">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                {!item.isPublish && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500 text-white font-bold uppercase">Draft</span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
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
                                {editingItem ? "Update Service" : "Add New Service"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Service Name</Label>
                                <Input
                                    name="name"
                                    defaultValue={editingItem?.name || ""}
                                    placeholder="e.g. Logo Design"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icon Library</Label>
                                    <Input
                                        name="iconLibrary"
                                        defaultValue={editingItem?.icon?.library || "io"}
                                        placeholder="e.g. io, fa, md"
                                        required
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon Name</Label>
                                    <Input
                                        name="iconName"
                                        defaultValue={editingItem?.icon?.name || ""}
                                        placeholder="e.g. IoLogoOctocat"
                                        required
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icon Color (Hex)</Label>
                                    <Input
                                        name="iconColor"
                                        type="text"
                                        defaultValue={editingItem?.icon?.color || "#"}
                                        placeholder="#1877F2"
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    name="description"
                                    defaultValue={editingItem?.description || ""}
                                    placeholder="Complete branding package including logo..."
                                    className="rounded-xl resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <Label>Publish Publicly</Label>
                                <Switch name="isPublish" defaultChecked={editingItem ? editingItem.isPublish : true} />
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
                    <DialogHeader><DialogTitle>Delete Service</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">Are you sure? This service will be removed from your portfolio.</div>
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
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
