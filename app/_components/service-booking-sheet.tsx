"use client"

import { setHours, setMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { useState } from "react"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface ServiceBookingSheetProps {
  service: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: number
  }
  isOpen: boolean
  onClose: () => void
}

const ServiceBookingSheet = ({
  service,
  isOpen,
  onClose,
}: ServiceBookingSheetProps) => {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  // Generate time slots (every 30 minutes from 9am to 7pm)
  const timeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour !== 19) {
        // Don't add 30 min slot for the last hour
        slots.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }
    return slots
  }

  const handleBooking = async () => {
    if (!selectedDate || !hour || !session?.user) {
      toast.error("Por favor, selecione uma data e horário.")
      return
    }

    try {
      setLoading(true)

      // Create the date with selected date and selected hour
      const [hours, minutes] = hour.split(":").map(Number)
      const bookingDate = setHours(setMinutes(selectedDate, minutes), hours)

      // Call the create booking action
      await createBooking({
        serviceId: service.id,
        date: bookingDate,
      })

      toast.success("Reserva criada com sucesso!")
      onClose()
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Erro ao criar reserva. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] bg-[#121212] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left text-white">
            Agendar {service.name.toLowerCase()}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6">
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-white">
              Selecione a data
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                // Disable past dates
                return date < new Date()
              }}
              locale={ptBR}
              classNames={{
                day_selected:
                  "bg-[#3EABFD] text-white hover:bg-[#3EABFD] hover:text-white rounded-xl",
              }}
            />
          </div>

          {selectedDate && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-white">
                Selecione o horário
              </h3>
              <div className="grid grid-cols-3 gap-2 text-white">
                {timeSlots().map((time) => {
                  const [hours, minutes] = time.split(":").map(Number)
                  const dateTime = setHours(
                    setMinutes(selectedDate, minutes),
                    hours,
                  )

                  // Disable past times on the current day
                  const isPastTime =
                    selectedDate.toDateString() === new Date().toDateString() &&
                    dateTime < new Date()

                  return (
                    <Button
                      key={time}
                      variant={hour === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setHour(time)}
                      disabled={isPastTime}
                      className={`rounded-xl text-xs text-white ${hour === time ? "border border-[#3EABFD] bg-[#3EABFD]" : "border border-white"}`}
                    >
                      {time}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <Button
            className="mt-6 w-full rounded-xl bg-[#3EABFD] text-white hover:bg-[#102332]"
            onClick={handleBooking}
            disabled={!selectedDate || !hour || loading}
          >
            {loading ? "Agendando..." : `Agendar ${service.name.toLowerCase()}`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ServiceBookingSheet
