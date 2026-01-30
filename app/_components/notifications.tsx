"use client"

import {
  BellIcon,
  CalendarIcon,
  PackageIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useEffect, useState, useRef } from "react"
import { getNotifications } from "../_actions/get-notifications"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const Notifications = () => {
  const { data } = useSession()
  const [notifications, setNotifications] = useState<{
    bookings: any[]
    purchases: any[]
  }>({
    bookings: [],
    purchases: [],
  })
  const [hasNew, setHasNew] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const lastNotifiedIdRef = useRef<string | null>(null)
  const soundEnabledRef = useRef(true)

  const isAdmin = (data?.user as any)?.role === "ADMIN"

  // Carregar preferência de som
  useEffect(() => {
    const saved = localStorage.getItem("notificationSoundEnabled")
    if (saved !== null) {
      const isEnabled = saved === "true"
      setSoundEnabled(isEnabled)
      soundEnabledRef.current = isEnabled
    }
  }, [])

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    soundEnabledRef.current = newValue
    localStorage.setItem("notificationSoundEnabled", String(newValue))
  }

  const triggerNotificationSound = (type: "booking" | "purchase") => {
    if (!soundEnabledRef.current) return

    const audioFile =
      type === "booking" ? "/sounds/appointments.mp3" : "/sounds/sale.mp3"
    const audio = new Audio(audioFile)

    audio.play().catch(() => {
      try {
        const AudioContextClass =
          (window as any).AudioContext || (window as any).webkitAudioContext
        if (!AudioContextClass) return

        const context = new AudioContextClass()
        const osc = context.createOscillator()
        const gain = context.createGain()

        osc.connect(gain)
        gain.connect(context.destination)

        osc.type = "sine"
        osc.frequency.value = type === "booking" ? 880 : 1200

        gain.gain.setValueAtTime(0.1, context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)

        osc.start()
        osc.stop(context.currentTime + 0.5)
      } catch (e) {
        // Silently fail if audio context also fails
      }
    })
  }

  useEffect(() => {
    if (!isAdmin) return

    const checkNewActivities = async () => {
      try {
        const response = await getNotifications()
        setNotifications(response)

        const allItems = [
          ...response.bookings.map((b: any) => ({ ...b, type: "booking" })),
          ...response.purchases.map((p: any) => ({ ...p, type: "purchase" })),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        const mostRecent = allItems[0]

        if (mostRecent) {
          if (
            lastNotifiedIdRef.current &&
            lastNotifiedIdRef.current !== mostRecent.id
          ) {
            const isFresh =
              new Date().getTime() - new Date(mostRecent.createdAt).getTime() <
              60000
            if (isFresh) {
              triggerNotificationSound(
                mostRecent.type as "booking" | "purchase",
              )
              setHasNew(true)
            }
          }
          lastNotifiedIdRef.current = mostRecent.id
        }

        const lastSeen = localStorage.getItem("lastNotificationCheck")
        if (!lastSeen) {
          setHasNew(
            response.bookings.length > 0 || response.purchases.length > 0,
          )
        } else {
          const lastCheckTime = new Date(lastSeen).getTime()
          const hasNewItem = allItems.some(
            (item: any) => new Date(item.createdAt).getTime() > lastCheckTime,
          )
          setHasNew(hasNewItem)
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error)
      }
    }

    checkNewActivities()
    const intervalId = setInterval(checkNewActivities, 30000)
    return () => clearInterval(intervalId)
  }, [isAdmin])

  const onPopoverOpenChange = (open: boolean) => {
    if (open) {
      setHasNew(false)
      localStorage.setItem("lastNotificationCheck", new Date().toISOString())
    }
  }

  if (!isAdmin) return null

  const activitiesList = [
    ...notifications.bookings.map((b) => ({ ...b, type: "booking" })),
    ...notifications.purchases.map((p) => ({ ...p, type: "purchase" })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <Popover onOpenChange={onPopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative mr-2 h-10 w-10 rounded-xl bg-[#102332] hover:bg-[#102332]/80"
        >
          <BellIcon className="h-5 w-5 text-white" />
          {hasNew && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-white/10 bg-[#1A1A1A] p-0 text-white"
        align="end"
      >
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">Notificações</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => triggerNotificationSound("booking")}
              className="h-6 w-6 p-0 text-gray-600 hover:text-white"
              title="Testar Som"
            >
              <Volume2Icon className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSound}
            className="h-8 px-2 text-gray-400 hover:bg-white/5"
          >
            {soundEnabled ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-green-500">
                  Som On
                </span>
                <Volume2Icon className="h-4 w-4 text-green-500" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Som Off
                </span>
                <VolumeXIcon className="h-4 w-4 text-gray-500" />
              </div>
            )}
          </Button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {activitiesList.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Nenhuma atividade recente.
            </div>
          ) : (
            activitiesList.map((activity: any) => (
              <div
                key={activity.id}
                className="border-b border-white/5 p-4 transition-colors last:border-0 hover:bg-white/5"
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    {activity.type === "booking" ? (
                      <CalendarIcon className="h-4 w-4 text-blue-400" />
                    ) : (
                      <PackageIcon className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold">
                        {activity.user.name || "Cliente"}
                      </span>
                      {activity.type === "booking" ? (
                        <>
                          {" "}
                          agendou{" "}
                          <span className="text-blue-400">
                            {activity.service?.name || activity.combo?.name}
                          </span>
                        </>
                      ) : (
                        <>
                          {" "}
                          comprou{" "}
                          <span className="text-green-400">
                            {activity.product.name}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-500">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notifications
