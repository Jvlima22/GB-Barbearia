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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { Input } from "@/app/_components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ComboSchema, comboSchema } from "../_schemas"
import { upsertCombo } from "@/app/_actions/upsert-combo"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { Service } from "@prisma/client"
import ImageUpload from "./image-upload"

interface UpsertComboDialogProps {
    defaultValues?: ComboSchema
    services: Service[]
}

const UpsertComboDialog = ({ defaultValues, services }: UpsertComboDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<ComboSchema>({
        resolver: zodResolver(comboSchema),
        defaultValues: defaultValues || {
            name: "",
            description: "",
            imageUrl: "",
            price: 0,
            service1Id: "",
            service2Id: "",
        },
    })

    const onSubmit = async (data: ComboSchema) => {
        try {
            await upsertCombo(data)
            toast.success("Combo salvo com sucesso!")
            setIsOpen(false)
            form.reset()
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar combo.")
        }
    }

    const isFormValid = !!(
        form.watch("name") &&
        form.watch("description") &&
        form.watch("imageUrl") &&
        form.watch("service1Id") &&
        form.watch("service2Id")
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={defaultValues ? "ghost" : "default"} className="w-full">
                    {defaultValues ? "Editar" : "Adicionar combo"}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>{defaultValues ? "Editar" : "Adicionar"} combo</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Crie uma recomendação combinando dois serviços.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="service1Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serviço 1</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#222] border-white/10 text-white">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#222] border-white/10 text-white">
                                                {services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="service2Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serviço 2</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#222] border-white/10 text-white">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#222] border-white/10 text-white">
                                                {services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Combo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Combo Barba + Cabelo" {...field} className="bg-[#222] border-white/10" />
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
                                        <Input placeholder="Ex: O melhor trato para seu visual..." {...field} className="bg-[#222] border-white/10" />
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
                                    <FormLabel>Preço Promocional (R$)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="Vazio para somar os serviços" {...field} className="bg-[#222] border-white/10" />
                                    </FormControl>
                                    <p className="text-[10px] text-gray-500 italic">Deixe vazio para usar a soma dos serviços selecionados.</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imagem do Combo</FormLabel>
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

export default UpsertComboDialog
