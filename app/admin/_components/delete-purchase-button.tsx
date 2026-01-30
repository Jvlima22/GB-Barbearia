"use client"

import { Trash2Icon, Loader2Icon } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { deletePurchase } from "@/app/_actions/delete-purchase"
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

interface DeletePurchaseButtonProps {
  purchaseId: string
}

const DeletePurchaseButton = ({ purchaseId }: DeletePurchaseButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePurchase(purchaseId)
      toast.success("Venda excluída com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir venda.")
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
      <AlertDialogContent className="border-white/10 bg-[#1A1A1A] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir venda?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Esta ação não pode ser desfeita. O registro da venda será removido
            permanentemente do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-[#222] text-white hover:bg-[#333]">
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

export default DeletePurchaseButton
