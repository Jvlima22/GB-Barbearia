"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/_components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { toast } from "sonner"
import { upsertOperatingDay } from "@/app/_actions/upsert-operating-day"
import {
  upsertOperatingException,
  deleteOperatingException,
} from "@/app/_actions/operating-exceptions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  Check,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/_components/ui/dialog"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Calendar } from "@/app/_components/ui/calendar"
import { cn } from "@/app/_lib/utils"

interface OperatingDay {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isOpen: boolean
}

interface OperatingException {
  id: string
  date: Date
  startTime: string | null
  endTime: string | null
  isOpen: boolean
  description: string | null
}

interface OperatingHoursManagerProps {
  operatingDays: OperatingDay[]
  operatingExceptions: OperatingException[]
}

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

const OperatingHoursManager = ({
  operatingDays,
  operatingExceptions,
}: OperatingHoursManagerProps) => {
  const [localOperatingDays, setLocalOperatingDays] = useState(operatingDays)
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [exceptionStartTime, setExceptionStartTime] = useState("09:00")
  const [exceptionEndTime, setExceptionEndTime] = useState("19:00")
  const [exceptionIsOpen, setExceptionIsOpen] = useState(true)
  const [exceptionDescription, setExceptionDescription] = useState("")

  // Sync local state when props change
  useEffect(() => {
    setLocalOperatingDays(operatingDays)
  }, [operatingDays])

  const handleDayUpdate = async (day: any) => {
    try {
      await upsertOperatingDay({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        isOpen: day.isOpen,
      })
      toast.success("Horário atualizado!")
    } catch (error) {
      toast.error("Erro ao atualizar horário.")
    }
  }

  const handleAddException = async () => {
    if (!selectedDate) return
    try {
      await upsertOperatingException({
        date: selectedDate,
        startTime: exceptionIsOpen ? exceptionStartTime : undefined,
        endTime: exceptionIsOpen ? exceptionEndTime : undefined,
        isOpen: exceptionIsOpen,
        description: exceptionDescription,
      })
      toast.success("Exceção adicionada!")
      setIsExceptionDialogOpen(false)
      // Reset form
      setExceptionDescription("")
      setExceptionIsOpen(true)
    } catch (error) {
      toast.error("Erro ao adicionar exceção.")
    }
  }

  const handleDeleteException = async (id: string) => {
    try {
      await deleteOperatingException(id)
      toast.success("Exceção removida!")
    } catch (error) {
      toast.error("Erro ao remover exceção.")
    }
  }

  const maskTime = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 4)
    if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2)}`
    }
    return cleanValue
  }

  return (
    <div className="flex flex-col gap-8">
      {/* WEEKLY SCHEDULE */}
      <Card className="border-white/10 bg-[#1A1A1A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ClockIcon className="h-5 w-5 text-primary" />
            Padrão Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {DAYS_OF_WEEK.map((dayName, index) => {
            const dayData = localOperatingDays.find(
              (d) => d.dayOfWeek === index,
            ) || {
              dayOfWeek: index,
              startTime: "09:00",
              endTime: "19:00",
              isOpen: true,
            }

            const updateLocalDay = (updates: any) => {
              const updated = { ...dayData, ...updates }
              setLocalOperatingDays((prev) => {
                const exists = prev.find((d) => d.dayOfWeek === index)
                if (exists) {
                  return prev.map((d) => (d.dayOfWeek === index ? updated : d))
                }
                return [...prev, updated]
              })
              return updated
            }

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-[#222] p-4"
              >
                <div className="flex min-w-[120px] flex-col gap-1">
                  <span className="text-sm font-bold text-white">
                    {dayName}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => {
                        const updated = updateLocalDay({
                          isOpen: !dayData.isOpen,
                        })
                        handleDayUpdate(updated)
                      }}
                      className={cn(
                        "flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-all",
                        dayData.isOpen
                          ? "border-primary bg-primary text-white"
                          : "border-white/20 bg-transparent",
                      )}
                    >
                      {dayData.isOpen && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-xs text-gray-400">
                      {dayData.isOpen ? "Aberto" : "Fechado"}
                    </span>
                  </div>
                </div>

                {dayData.isOpen && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-400">Das</Label>
                      <Input
                        value={dayData.startTime}
                        onChange={(e) => {
                          const val = maskTime(e.target.value)
                          const updated = updateLocalDay({ startTime: val })
                          if (val.length === 5) handleDayUpdate(updated)
                        }}
                        className="h-8 w-20 bg-[#1A1A1A] text-xs text-white"
                        maxLength={5}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-400">até</Label>
                      <Input
                        value={dayData.endTime}
                        onChange={(e) => {
                          const val = maskTime(e.target.value)
                          const updated = updateLocalDay({ endTime: val })
                          if (val.length === 5) handleDayUpdate(updated)
                        }}
                        className="h-8 w-20 bg-[#1A1A1A] text-xs text-white"
                        maxLength={5}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* EXCEPTIONS */}
      <Card className="border-white/10 bg-[#1A1A1A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Exceções do Calendário (Feriados/Datas Específicas)
          </CardTitle>
          <Dialog
            open={isExceptionDialogOpen}
            onOpenChange={setIsExceptionDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Adicionar Exceção
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-[#1D1D1D] text-white">
              <DialogHeader>
                <DialogTitle>Nova Exceção</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label>Data</Label>
                  <PopoverPrimitive.Root
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverPrimitive.Trigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-10 w-full border-white/10 bg-[#222] pl-3 text-left font-normal hover:bg-[#333] hover:text-white",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverPrimitive.Trigger>
                    <PopoverPrimitive.Content
                      className="z-50 w-auto rounded-xl border border-white/10 bg-[#1A1A1A] p-0 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                      align="start"
                      sideOffset={4}
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          setIsCalendarOpen(false)
                        }}
                        locale={ptBR}
                        classNames={{
                          day_selected:
                            "bg-[#3EABFD] text-white hover:bg-[#3EABFD] hover:text-white rounded-xl",
                        }}
                      />
                    </PopoverPrimitive.Content>
                  </PopoverPrimitive.Root>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Descrição (opcional)</Label>
                  <Input
                    placeholder="Ex: Natal, Reforma..."
                    value={exceptionDescription}
                    onChange={(e) => setExceptionDescription(e.target.value)}
                    className="border-white/10 bg-[#222]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div
                    onClick={() => setExceptionIsOpen(!exceptionIsOpen)}
                    className={cn(
                      "flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-all",
                      exceptionIsOpen
                        ? "border-primary bg-primary text-white"
                        : "border-white/20 bg-transparent",
                    )}
                  >
                    {exceptionIsOpen && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <Label
                    className="cursor-pointer"
                    onClick={() => setExceptionIsOpen(!exceptionIsOpen)}
                  >
                    Barbearia estará aberta nesta data?
                  </Label>
                </div>

                {exceptionIsOpen && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Início</Label>
                      <Input
                        value={exceptionStartTime}
                        onChange={(e) =>
                          setExceptionStartTime(maskTime(e.target.value))
                        }
                        maxLength={5}
                        className="border-white/10 bg-[#222]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Fim</Label>
                      <Input
                        value={exceptionEndTime}
                        onChange={(e) =>
                          setExceptionEndTime(maskTime(e.target.value))
                        }
                        maxLength={5}
                        className="border-white/10 bg-[#222]"
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsExceptionDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddException}>Salvar Exceção</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {operatingExceptions.map((exception) => (
            <div
              key={exception.id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-[#222] p-4"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  {format(exception.date, "dd 'de' MMMM", { locale: ptBR })}
                </span>
                <span className="text-xs text-gray-400">
                  {exception.description || "Sem descrição"}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      exception.isOpen ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {exception.isOpen ? "Aberto" : "Fechado"}
                  </span>
                  {exception.isOpen && (
                    <span className="text-xs text-gray-400">
                      {exception.startTime} - {exception.endTime}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDeleteException(exception.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {operatingExceptions.length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma exceção cadastrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OperatingHoursManager
