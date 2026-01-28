"use client"

import { Trash2Icon, Loader2Icon } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { deleteBooking } from "@/app/_actions/delete-bookings"
import { toast } from "sonner"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"

interface DeleteBookingButtonProps {
    bookingId: string
}

const DeleteBookingButton = ({ bookingId }: DeleteBookingButtonProps) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteBooking(bookingId)
            toast.success("Agendamento excluído com sucesso!")
        } catch (error: any) {
            toast.error(error.message || "Erro ao excluir agendamento.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2Icon size={16} />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        Esta ação não pode ser desfeita. O agendamento será removido permanentemente do sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#222] border-white/10 text-white hover:bg-[#333]">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteBookingButton
