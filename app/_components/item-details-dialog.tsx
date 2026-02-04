"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ShoppingCartIcon, CalendarIcon, InfoIcon } from "lucide-react"

interface ItemDetailsDialogProps {
  item: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: number
    type: "service" | "product" | "combo"
  }
  isOpen: boolean
  onClose: () => void
  onAction: () => void
}

const ItemDetailsDialog = ({
  item,
  isOpen,
  onClose,
  onAction,
}: ItemDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-2xl border-white/10 bg-[#1A1A1A] p-0 text-white sm:max-w-[450px] [&>button]:right-6 [&>button]:top-6">
        {/* IMAGEM EM DESTAQUE */}
        <div className="relative h-[250px] w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />

          <Badge className="absolute left-5 top-5 bg-[#3EABFD] text-white hover:bg-[#3EABFD]">
            {item.type === "service" && "Serviço"}
            {item.type === "product" && "Produto"}
            {item.type === "combo" && "Combo"}
          </Badge>
        </div>

        <div className="flex flex-col gap-4 p-6 pt-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {item.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalhes sobre o item {item.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#3EABFD]">
              <InfoIcon size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Descrição
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {item.description}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-gray-500">Preço</span>
              <span className="text-2xl font-bold text-[#3EABFD]">
                R$ {item.price.toFixed(2)}
              </span>
            </div>

            <Button
              className="gap-2 rounded-xl bg-[#3EABFD] px-6 font-bold text-white hover:bg-[#2e8acb]"
              onClick={() => {
                onAction()
                onClose()
              }}
            >
              {item.type === "product" ? (
                <>
                  <ShoppingCartIcon size={18} />
                  Comprar
                </>
              ) : (
                <>
                  <CalendarIcon size={18} />
                  Agendar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ItemDetailsDialog
