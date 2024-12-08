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
      <CardContent className="flex flex-row items-center justify-between p-5">
        {/* Logo */}
        <Link href="/">
          <Image
            alt="TLS Barber"
            src="/Logo.svg"
            height={18}
            width={120}
            className="lg:ml-32"
          />
        </Link>

        {/* Botões (somente para desktop) */}
        <div className="hidden items-center lg:mr-[120px] lg:flex">
          {/* Botão "Agendamentos" */}
          <Button
            variant="default"
            className="mr-6 flex justify-start gap-2"
            asChild
          >
            <Link href="/bookings">
              <CalendarIcon className="h-4 w-4" />
              Agendamentos
            </Link>
          </Button>

          {/* Menu Hamburger (somente para mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>

        {/* Menu Hamburger (somente para mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="lg:hidden">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
