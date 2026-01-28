"use client"

import { Button } from "@/app/_components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/_components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form"
import { Input } from "@/app/_components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ServiceSchema, serviceSchema } from "../_schemas"
import { upsertService } from "@/app/_actions/upsert-service"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import ImageUpload from "./image-upload"

interface UpsertServiceDialogProps {
    defaultValues?: ServiceSchema
}

const UpsertServiceDialog = ({ defaultValues }: UpsertServiceDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
        defaultValues: defaultValues || {
            name: "",
            description: "",
            imageUrl: "",
            price: 0,
        },
    })

    const onSubmit = async (data: ServiceSchema) => {
        try {
            await upsertService({
                ...data,
            })
            toast.success("Serviço salvo com sucesso!")
            setIsOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Erro ao salvar serviço.")
        }
    }

    const isFormValid = !!(
        form.watch("name") &&
        form.watch("description") &&
        form.watch("imageUrl") &&
        form.watch("price") > 0
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={defaultValues ? "ghost" : "default"} className="w-full">
                    {defaultValues ? "Editar" : "Adicionar serviço"}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{defaultValues ? "Editar" : "Adicionar"} serviço</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Preencha os dados abaixo para {defaultValues ? "editar" : "criar"} o serviço.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Corte de Cabelo" {...field} className="bg-[#222] border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Corte social completo..." {...field} className="bg-[#222] border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço (R$)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="Ex: 50.00" {...field} className="bg-[#222] border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imagem</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-white/10 text-white"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className={`transition-all duration-300 ${isFormValid ? "bg-[#3EABFD] text-white hover:bg-[#2e8acb]" : "bg-primary text-black"}`}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpsertServiceDialog
