import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { CalendarIcon, MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between bg-[#1D1D1D] p-5">
        {/* Logo */}
        <Link href="/">
          <Image
            alt="TLS Barber"
            src="/Logo.svg"
            height={18}
            width={120}
            className="lg:ml-[250px]"
          />
        </Link>

        {/* Botões (somente para desktop) */}
        <div className="hidden items-center lg:mr-[250px] lg:flex">
          {/* Botão "Agendamentos" */}
          <Button
            variant="default"
            className="mr-2 flex justify-start gap-2 rounded-xl bg-[#102332] hover:bg-[#102332]"
            asChild
          >
            <Link href="/bookings" className="text-white">
              <CalendarIcon className="h-4 w-4 text-white" />
              Agendamentos
            </Link>
          </Button>

          {/* Menu Hamburger (somente para mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                style={{ backgroundColor: "#102332", borderRadius: "10px" }}
              >
                <MenuIcon color="#ffffff" />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>

        {/* Menu Hamburger (somente para mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="border border-white lg:hidden"
            >
              <MenuIcon color="#ffffff" />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
