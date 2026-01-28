"use client"

import { Service } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { useState } from "react"
import ServiceBookingSheet from "./service-booking-sheet"
import ItemDetailsDialog from "./item-details-dialog"

interface ServiceItemProps {
  service: Service
  barbershop?: {
    id: string
    name: string
    address: string
    imageUrl: string
  }
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const handleBookingClick = () => {
    setIsBookingSheetOpen(true)
  }

  return (
    <>
      <Card
        className="min-w-[167px] flex-shrink-0 cursor-pointer rounded-2xl transition-all hover:border-[#3EABFD]/50 lg:w-[185px]"
        onClick={() => setIsDetailsDialogOpen(true)}
      >
        <CardContent className="p-0 px-1 pt-1">
          {/* IMAGEM */}
          <div className="relative h-[159px] w-full">
            <Image
              alt={service.name}
              fill
              className="rounded-2xl object-cover"
              src={service.imageUrl}
            />
          </div>

          {/* TEXTO */}
          <div className="px-1 py-3">
            <h3 className="truncate text-sm font-semibold text-white">
              {service.name}
            </h3>
            <p className="truncate text-xs text-gray-400">
              {service.description}
            </p>
            <p className="text-xs font-bold" style={{ color: "#3EABFD" }}>
              R$ {Number(service.price).toFixed(2)}
            </p>
            <Button
              variant="secondary"
              className="mt-3 w-full rounded-xl bg-[#102332] hover:bg-[#3EABFD]"
              onClick={(e) => {
                e.stopPropagation()
                handleBookingClick()
              }}
            >
              <span className="text-xs text-white">Agendar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ItemDetailsDialog
        item={{
          ...service,
          price: Number(service.price),
          type: "service",
        }}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        onAction={handleBookingClick}
      />

      <ServiceBookingSheet
        service={{ ...service, price: Number(service.price) }}
        isOpen={isBookingSheetOpen}
        onClose={() => setIsBookingSheetOpen(false)}
      />
    </>
  )
}

export default ServiceItem
