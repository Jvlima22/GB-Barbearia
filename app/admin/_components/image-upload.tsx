"use client"

import React, { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/app/_components/ui/button"
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react"
import { uploadImage } from "@/app/_actions/upload-image"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
    value?: string
    onChange: (_url: string) => void
    disabled?: boolean
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            toast.error("A imagem deve ter no máximo 10MB")
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append("file", file)

            const url = await uploadImage(formData)
            onChange(url)
            toast.success("Imagem enviada com sucesso!")
        } catch (error) {
            toast.error("Erro ao enviar imagem.")
        } finally {
            setIsUploading(false)
        }
    }

    const onRemove = () => {
        onChange("")
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative h-[150px] w-[150px] rounded-md overflow-hidden border border-white/10">
                        <div className="z-10 absolute top-1 right-1">
                            <Button
                                type="button"
                                onClick={onRemove}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                            >
                                <XIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            src={value}
                            alt="Preview"
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => !disabled && fileInputRef.current?.click()}
                        className={`
              h-[150px] w-[150px] rounded-md border-2 border-dashed border-white/10 
              flex flex-col items-center justify-center gap-2 cursor-pointer
              hover:bg-white/5 transition
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
                    >
                        {isUploading ? (
                            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                            <>
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                <span className="text-xs text-gray-400">Upload Imagem</span>
                            </>
                        )}
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled || isUploading}
                />
            </div>
            <p className="text-[10px] text-gray-400 italic">
                * Recomendado: 800x800px, máx 10MB.
            </p>
        </div>
    )
}

export default ImageUpload
