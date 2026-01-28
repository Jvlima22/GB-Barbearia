"use client"

import { Prisma } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { deleteBooking } from "../_actions/delete-bookings"
import { toast } from "sonner"
import { useState } from "react"
import BookingSummary from "./booking-summary"
import { useSession } from "next-auth/react"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true
    }
  }>
  settings?: any // Using any to avoid type issues for now, or define a subset type
}

// TODO: receber agendamento como prop
const BookingItem = ({ booking, settings }: BookingItemProps) => {
  const { data: session } = useSession()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Use settings if available, otherwise mock
  const barbershop = settings ? {
    name: settings.name,
    address: settings.address,
    imageUrl: settings.imageUrl,
    phones: settings.phones || [],
  } : {
    name: "GB Barbearia",
    address: "Rua das Doninhas, 253 - Cotia, SP",
    imageUrl: "/Logo-GB.jpeg",
    phones: ["(11) 99999-9999"],
  }
  const isConfirmed = isFuture(booking.date)
  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      setIsSheetOpen(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva. Tente novamente.")
    }
  }
  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }
  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger className="w-full min-w-[90%] rounded-xl border-white bg-[#3EABFD]">
        <Card className="min-w-[90%]">
          <CardContent className="flex justify-between p-0">
            {/* ESQUERDA */}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                className="w-fit text-white"
                variant={isConfirmed ? "default" : "secondary"}
              >
                {isConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h3 className="font-semibold text-white">
                {booking.service.name}
              </h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={barbershop.imageUrl} />
                </Avatar>
                <p className="text-sm text-white">{barbershop.name}</p>
              </div>
            </div>
            {/* DIREITA */}
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm capitalize text-white">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl text-white">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm text-white">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[85%] bg-[#121212] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left text-white">
            Informações da Reserva
          </SheetTitle>
        </SheetHeader>

        <div className="relative mt-6 flex h-[180px] w-full items-end">
          <Image
            alt={`Mapa da barbearia ${barbershop.name}`}
            src="/map.svg"
            fill
            className="rounded-xl object-cover"
          />

          <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
            <CardContent className="flex items-center gap-3 rounded-xl border border-white px-5 py-3">
              <Avatar>
                <AvatarImage src={barbershop.imageUrl} />
              </Avatar>
              <div>
                <h3 className="font-bold text-white">{barbershop.name}</h3>
                <p className="text-xs text-white">{barbershop.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Badge
            className="w-fit text-white"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <div className="mb-3 mt-6 text-white">
            <BookingSummary
              barbershop={barbershop}
              service={booking.service}
              selectedDate={booking.date}
            />
          </div>

          <div className="space-y-3 text-white">
            {barbershop.phones.map((phone, index) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </div>
        <SheetFooter className="mt-6">
          <div className="flex items-center gap-3">
            <SheetClose asChild>
              <Button className="w-full rounded-xl border border-white text-white">
                Voltar
              </Button>
            </SheetClose>
            {isConfirmed && (session?.user as any)?.role === "ADMIN" && (
              <Dialog>
                <DialogTrigger className="w-full rounded-xl border border-red-500">
                  <Button variant="destructive" className="w-full text-white">
                    Cancelar Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] bg-[#1D1D1D] text-white">
                  <DialogHeader>
                    <DialogTitle>Você deseja cancelar sua reserva?</DialogTitle>
                    <DialogDescription>
                      Ao cancelar, você perderá sua reserva e não poderá
                      recuperá-la. Essa ação é irreversível.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-row gap-3">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full rounded-xl">
                        Voltar
                      </Button>
                    </DialogClose>
                    <DialogClose className="w-full rounded-xl">
                      <Button
                        onClick={handleCancelBooking}
                        className="w-full rounded-xl border border-red-500 bg-red-500 text-white"
                      >
                        Confirmar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BookingItem
