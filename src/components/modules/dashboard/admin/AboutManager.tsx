"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pencil,
    Trash2,
    Loader2,
    ImageIcon,
    Plus,
    User,
    LayoutTemplate,
    Trash,
    LucideIcon,
} from "lucide-react";
import { IAbout } from "@/types/about.type";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
    createAboutAction,
    updateAboutAction,
    deleteAboutAction,
} from "@/actions/about.action";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AboutManagerProps {
    about: IAbout | null;
    token: string;
    onRefresh: () => void;
}

// --- Reusable Sub-Components ---

interface ImageUpdateModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    preview: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onSave: () => void;
    loading: boolean;
    isCompressing: boolean;
    fileRef: React.RefObject<HTMLInputElement | null>;
    isEditing: boolean;
}

const ImageUpdateModal = ({
    isOpen,
    onOpenChange,
    title,
    preview,
    onFileChange,
    onSave,
    loading,
    isCompressing,
    fileRef,
    isEditing,
}: ImageUpdateModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-3xl sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" /> Select New Image
                    </Label>
                    {preview && (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                        </div>
                    )}
                    <Input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={onFileChange}
                        disabled={isCompressing}
                        className="rounded-xl cursor-pointer file:cursor-pointer file:text-primary file:font-medium"
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
                </div>
            </div>
            <DialogFooter>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="rounded-lg px-6"
                >
                    Cancel
                </Button>
                <Button size="sm" onClick={onSave} disabled={loading || isCompressing} className="rounded-lg px-8">
                    {(loading || isCompressing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? "Update" : "Upload"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
    title?: string;
}

const DeleteConfirmationModal = ({
    isOpen,
    onOpenChange,
    onConfirm,
    loading,
    title = "Confirm Delete",
}: DeleteConfirmationModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-3xl max-w-[400px]">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-muted-foreground">
                Are you sure you want to delete the About record? This will remove all images.
            </div>
            <DialogFooter className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="rounded-lg px-6"
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={loading}
                    className="rounded-lg px-6"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

interface ImageActionCardProps {
    title: string;
    icon: LucideIcon;
    imageSrc?: string | null;
    onUpdate: () => void;
    onDelete: () => void;
    isEditing: boolean;
    updateLabel: string;
    deleteLabel: string;
}

const ImageActionCard = ({
    title,
    icon: Icon,
    imageSrc,
    onUpdate,
    onDelete,
    isEditing,
    updateLabel,
    deleteLabel,
}: ImageActionCardProps) => (
    <Card className="border-none shadow-sm bg-muted/20 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative w-full aspect-auto bg-muted/40">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        width={300}
                        height={300}
                        className="w-64 h-64 rounded-xl object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-40">
                        <ImageIcon className="h-10 w-10" />
                        <p className="text-sm">No image uploaded</p>
                    </div>
                )}
            </div>
            <div className="flex gap-3 justify-center md:justify-end">
                <Button
                    size="sm"
                    className="w-full md:w-auto cursor-pointer"
                    onClick={onUpdate}
                >
                    {isEditing ? `Update ${updateLabel}` : `Upload ${updateLabel}`}
                </Button>
                {imageSrc && (
                    <Button
                        size="sm"
                        variant="destructive"
                        className="w-full md:w-auto cursor-pointer"
                        onClick={onDelete}
                    >
                        Delete {deleteLabel}
                    </Button>
                )}
            </div>
        </CardContent>
    </Card>
);

export function AboutManager({ about, token, onRefresh }: AboutManagerProps) {
    // Hero Section State
    const [isHeroUpdateOpen, setIsHeroUpdateOpen] = useState(false);
    const [isHeroDeleteOpen, setIsHeroDeleteOpen] = useState(false);
    const [heroLoading, setHeroLoading] = useState(false);

    const {
        file: heroFile,
        preview: heroPreview,
        isCompressing: heroCompressing,
        handleFileChange: handleHeroFileChange,
        reset: resetHero,
        inputRef: heroImgRef,
    } = useImageUpload({ maxSizeMB: 5 });

    // About Me Section State
    const [isAboutMeUpdateOpen, setIsAboutMeUpdateOpen] = useState(false);
    const [isAboutMeDeleteOpen, setIsAboutMeDeleteOpen] = useState(false);
    const [aboutMeLoading, setAboutMeLoading] = useState(false);

    const {
        file: aboutMeFile,
        preview: aboutMePreview,
        isCompressing: aboutMeCompressing,
        handleFileChange: handleAboutMeFileChange,
        reset: resetAboutMe,
        inputRef: aboutMeImgRef,
    } = useImageUpload({ maxSizeMB: 5 });

    const isEditing = !!about;


    const handleSaveHero = async () => {
        if (!heroFile && !isEditing) {
            toast.error("Please select a hero image");
            return;
        }

        const formData = new FormData();
        if (heroFile) formData.append("heroImg", heroFile);

        setHeroLoading(true);
        try {
            const result = isEditing
                ? await updateAboutAction(about.id, formData, token)
                : await createAboutAction(formData, token);

            if (result.success) {
                toast.success(result.message);
                setIsHeroUpdateOpen(false);
                resetHero();
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Hero image save error:", error);
            toast.error("An unexpected error occurred while saving.");
            resetHero();
        } finally {
            setHeroLoading(false);
        }
    };

    const handleSaveAboutMe = async () => {
        if (!aboutMeFile && !isEditing) {
            toast.error("Please select an about me image");
            return;
        }

        const formData = new FormData();
        if (aboutMeFile) formData.append("aboutMeImg", aboutMeFile);

        setAboutMeLoading(true);
        try {
            const result = isEditing
                ? await updateAboutAction(about.id, formData, token)
                : await createAboutAction(formData, token);

            if (result.success) {
                toast.success(result.message);
                setIsAboutMeUpdateOpen(false);
                resetAboutMe();
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("About me image save error:", error);
            toast.error("An unexpected error occurred while saving.");
            resetAboutMe();
        } finally {
            setAboutMeLoading(false);
        }
    };

    const confirmDelete = async (loadingSetter: (val: boolean) => void, dialogSetter: (val: boolean) => void) => {
        if (!about?.id) return;
        loadingSetter(true);
        const result = await deleteAboutAction(about.id, token);
        if (result.success) {
            toast.success(result.message);
            onRefresh();
        } else {
            toast.error(result.message);
        }
        dialogSetter(false);
        loadingSetter(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Manage About Assets</h2>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 rounded-xl bg-muted/50">
                    <TabsTrigger
                        value="hero"
                        className="rounded-lg py-2.5 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                        Hero Section Image
                    </TabsTrigger>
                    <TabsTrigger
                        value="aboutMe"
                        className="rounded-lg py-2.5 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                        About Me Image
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="space-y-6">
                    <ImageActionCard
                        title="Current Hero Image"
                        icon={LayoutTemplate}
                        imageSrc={about?.heroImg}
                        onUpdate={() => setIsHeroUpdateOpen(true)}
                        onDelete={() => setIsHeroDeleteOpen(true)}
                        isEditing={isEditing}
                        updateLabel="Hero Image"
                        deleteLabel="Hero Image"
                    />
                </TabsContent>

                <TabsContent value="aboutMe" className="space-y-6">
                    <ImageActionCard
                        title="Current About Me Image"
                        icon={User}
                        imageSrc={about?.aboutMeImg}
                        onUpdate={() => setIsAboutMeUpdateOpen(true)}
                        onDelete={() => setIsAboutMeDeleteOpen(true)}
                        isEditing={isEditing}
                        updateLabel="About Image"
                        deleteLabel="About Image"
                    />
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <ImageUpdateModal
                isOpen={isHeroUpdateOpen}
                onOpenChange={setIsHeroUpdateOpen}
                title={isEditing ? "Update Hero Image" : "Upload Hero Image"}
                preview={heroPreview}
                onFileChange={handleHeroFileChange}
                onSave={handleSaveHero}
                loading={heroLoading}
                isCompressing={heroCompressing}
                fileRef={heroImgRef}
                isEditing={isEditing}
            />

            <ImageUpdateModal
                isOpen={isAboutMeUpdateOpen}
                onOpenChange={setIsAboutMeUpdateOpen}
                title={isEditing ? "Update About Image" : "Upload About Image"}
                preview={aboutMePreview}
                onFileChange={handleAboutMeFileChange}
                onSave={handleSaveAboutMe}
                loading={aboutMeLoading}
                isCompressing={aboutMeCompressing}
                fileRef={aboutMeImgRef}
                isEditing={isEditing}
            />

            <DeleteConfirmationModal
                isOpen={isHeroDeleteOpen}
                onOpenChange={setIsHeroDeleteOpen}
                onConfirm={() => confirmDelete(setHeroLoading, setIsHeroDeleteOpen)}
                loading={heroLoading}
            />

            <DeleteConfirmationModal
                isOpen={isAboutMeDeleteOpen}
                onOpenChange={setIsAboutMeDeleteOpen}
                onConfirm={() => confirmDelete(setAboutMeLoading, setIsAboutMeDeleteOpen)}
                loading={aboutMeLoading}
            />
        </div>
    );
}

