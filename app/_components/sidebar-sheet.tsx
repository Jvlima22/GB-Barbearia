"use client"

import { Button } from "./ui/button"
import { CalendarIcon, HomeIcon, LogOutIcon } from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import UserIcon from "./user-icon"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

const SidebarSheet = () => {
  const { data } = useSession()
  const router = useRouter()
  const handleLogoutClick = () => signOut()

  const handleBookingsClick = () => {
    if (!data?.user) {
      return toast.error(
        "Você precisa estar logado para ver seus agendamentos.",
      )
    }
    router.push("/bookings")
  }

  return (
    <SheetContent className="overflow-y-auto bg-[#1D1D1D] p-6">
      <SheetHeader>
        <SheetTitle className="text-left text-white">Menu</SheetTitle>
      </SheetHeader>

      <UserIcon />

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" asChild>
            <Link href="/" className="text-white">
              <HomeIcon size={18} color="#FFFFFF" />
              Início
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button className="justify-start gap-2" onClick={handleBookingsClick}>
            <CalendarIcon size={18} color="#FFFFFF" />
            <span className="text-white">Agendamentos</span>
          </Button>
        </SheetClose>

        {(data?.user as any)?.role === "ADMIN" && (
          <Button className="justify-start gap-2" asChild>
            <Link href="/admin" className="text-white">
              <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-[10px] text-white">
                A
              </div>
              Painel administrativo
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose key={option.title} asChild>
            <Button className="justify-start gap-2" asChild>
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  alt={option.title}
                  src={option.imageUrl}
                  height={18}
                  width={18}
                />
                <span className="text-white">{option.title}</span>
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>

      {data?.user && (
        <div className="flex flex-col gap-2 py-5">
          <Button
            className="justify-start gap-2 text-white"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} color="#FFFFFF" />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
