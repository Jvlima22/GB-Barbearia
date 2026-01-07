"use client"

import { Button } from "./ui/button"
import { CalendarIcon, HomeIcon, LogOutIcon } from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import UserIcon from "./user-icon"

const SidebarSheet = () => {
  const { data } = useSession()
  const handleLogoutClick = () => signOut()

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
        <Button className="justify-start gap-2" asChild>
          <Link href="/bookings" className="text-white">
            <CalendarIcon size={18} color="#FFFFFF" />
            Agendamentos
          </Link>
        </Button>

        {(data?.user as any)?.role === "ADMIN" && (
          <Button className="justify-start gap-2" asChild>
            <Link href="/admin" className="text-white">
              <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-[10px] text-white">
                A
              </div>
              Painel Administrativo
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose className="text-white" key={option.title} asChild>
            <Button className="justify-start gap-2" asChild>
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  alt={option.title}
                  src={option.imageUrl}
                  height={18}
                  width={18}
                />
                {option.title}
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
