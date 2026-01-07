import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: {
    id: string
    name: string
    address: string
    imageUrl: string
  }
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] rounded-2xl">
      <CardContent className="p-0 px-1 pt-1">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full">
          <Image
            alt={barbershop.name}
            fill
            className="rounded-2xl object-cover"
            src={barbershop.imageUrl}
          />

          <Badge
            className="absolute left-2 top-2 space-x-1"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-[#3EABFD] text-[#3EABFD]" />
            <p className="text-xs font-semibold text-white">5,0</p>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="px-1 py-3">
          <h3 className="truncate font-semibold text-white">
            {barbershop.name}
          </h3>
          <p className="truncate text-sm text-gray-400">{barbershop.address}</p>
          <Button
            className="mt-3 w-full rounded-xl bg-[#3EABFD] hover:bg-[#102332]"
            asChild
          >
            <Link href={`/barbershops/${barbershop.id}`} className="text-white">
              Reservar
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
