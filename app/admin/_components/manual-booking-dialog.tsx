"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { CalendarIcon, Loader2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

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
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Calendar } from "@/app/_components/ui/calendar"
import { cn } from "@/app/_lib/utils"

import { ManualBookingSchema, manualBookingSchema } from "../_schemas"
import { createManualBooking } from "@/app/_actions/create-manual-booking"
import { getSettings } from "@/app/_actions/get-settings"

interface ManualBookingDialogProps {
    users: any[]
    services: any[]
}

const ManualBookingDialog = ({ users, services }: ManualBookingDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const form = useForm<ManualBookingSchema>({
        resolver: zodResolver(manualBookingSchema),
        defaultValues: {
            userId: "",
            serviceId: "",
            hour: "",
        },
    })

    const [settings, setSettings] = useState<any | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings()
                setSettings(data)
            } catch (error) {
                console.error("Erro ao carregar configurações:", error)
            }
        }
        fetchSettings()
    }, [])

    // Reset form when dialog opens to ensure clean state
    useEffect(() => {
        if (isOpen) {
            form.reset({
                userId: "",
                serviceId: "",
                hour: "",
                date: undefined as any,
            })
        }
    }, [isOpen, form])

    const onSubmit = async (data: ManualBookingSchema) => {
        try {
            await createManualBooking(data)
            toast.success("Agendamento manual criado com sucesso!")
            setIsOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Erro ao criar agendamento manual.")
        }
    }

    const timeSlots = () => {
        const startHour = settings ? Number(settings.startHour?.split(":")[0]) : 9
        const endHour = settings ? Number(settings.endHour?.split(":")[0]) : 19

        const slots = []
        for (let hour = startHour; hour <= endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`)
            if (hour !== endHour) {
                slots.push(`${hour.toString().padStart(2, "0")}:30`)
            }
        }
        return slots
    }

    const isFormValid = !!(
        form.watch("userId") &&
        form.watch("serviceId") &&
        form.watch("date") &&
        form.watch("hour")
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-[#3EABFD] text-white hover:bg-[#2e8acb]">
                    <PlusIcon size={18} />
                    Novo agendamento
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo agendamento manual</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Crie um agendamento direto no sistema sem passar pelo Stripe.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cliente</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#222] border-white/10">
                                                <SelectValue placeholder="Selecione um cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.name || user.email}
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
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Serviço</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#222] border-white/10">
                                                <SelectValue placeholder="Selecione um serviço" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data</FormLabel>
                                        <PopoverPrimitive.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                            <PopoverPrimitive.Trigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-10 pl-3 text-left font-normal bg-[#222] border-white/10 hover:bg-[#333] hover:text-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Selecione</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverPrimitive.Trigger>
                                            <PopoverPrimitive.Content
                                                className="z-50 w-auto p-0 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                                                align="start"
                                                sideOffset={4}
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange(date)
                                                            setIsCalendarOpen(false)
                                                        }
                                                    }}
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    locale={ptBR}
                                                />
                                            </PopoverPrimitive.Content>
                                        </PopoverPrimitive.Root>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hour"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Horário</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 bg-[#222] border-white/10">
                                                    <SelectValue placeholder="Horário" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white h-[200px]">
                                                {timeSlots().map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
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
                                className={cn(
                                    "transition-all duration-300",
                                    isFormValid ? "bg-[#3EABFD] text-white hover:bg-[#2e8acb]" : "bg-primary text-black"
                                )}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Criar agendamento
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ManualBookingDialog
