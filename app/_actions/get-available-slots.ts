"use server"

import { db } from "../_lib/prisma"
import { startOfDay, endOfDay } from "date-fns"

interface GetAvailableSlotsProps {
  date: Date
}

// Simple in-memory cache for settings and operating days (they don't change every second)
let cachedSettings: any = null
let cachedStandardDays: any[] = []
let lastCacheUpdate = 0
const CACHE_TTL = 30000 // 30 seconds

export const getAvailableSlots = async ({ date }: GetAvailableSlotsProps) => {
  try {
    const now = Date.now()
    const dayOfWeek = date.getDay()
    const normalizedDate = startOfDay(date)

    // 1. Fetch bookings and exceptions (must be fresh)
    // 2. Fetch settings and standard days (can be cached for a few seconds)
    const fetchTasks: Promise<any>[] = [
      (db as any).operatingException.findUnique({
        where: { date: normalizedDate },
      }),
      (db as any).booking.findMany({
        where: { date: { gte: startOfDay(date), lte: endOfDay(date) } },
        select: { date: true },
      }),
    ]

    if (!cachedSettings || now - lastCacheUpdate > CACHE_TTL) {
      fetchTasks.push((db as any).operatingDay.findMany())
      fetchTasks.push((db as any).settings.findFirst())
    }

    const results = await Promise.all(fetchTasks)
    const exception = results[0]
    const bookings = results[1]

    if (results.length > 2) {
      cachedStandardDays = results[2]
      cachedSettings = results[3]
      lastCacheUpdate = now
    }

    const standardDay = cachedStandardDays.find(
      (d: any) => d.dayOfWeek === dayOfWeek,
    )

    let startTime = "09:00"
    let endTime = "19:00"
    let isOpen = true

    if (exception) {
      isOpen = exception.isOpen
      if (isOpen && exception.startTime && exception.endTime) {
        startTime = exception.startTime
        endTime = exception.endTime
      }
    } else if (standardDay) {
      isOpen = standardDay.isOpen
      if (isOpen) {
        startTime = standardDay.startTime
        endTime = standardDay.endTime
      }
    } else if (cachedSettings) {
      startTime = cachedSettings.startHour || "09:00"
      endTime = cachedSettings.endHour || "19:00"
    }

    if (!isOpen) return []

    // Generate slots
    const slots = []
    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)

    let currentMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    const bookedTimes = new Set(
      bookings.map((b: any) => {
        const bDate = new Date(b.date)
        // Use Brazil Time (UTC-3) conversion if possible, or just ignore for now
        return `${bDate.getHours().toString().padStart(2, "0")}:${bDate.getMinutes().toString().padStart(2, "0")}`
      }),
    )

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60)
      const m = currentMinutes % 60
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      if (!bookedTimes.has(timeStr)) slots.push(timeStr)
      currentMinutes += 30
    }

    return slots
  } catch (error) {
    console.error("Error in getAvailableSlots:", error)
    return []
  }
}
