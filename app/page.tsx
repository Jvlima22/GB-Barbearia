import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"

const Home = async () => {
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  const confirmedBookings = await getConfirmedBookings()

  return (
    <div>
      {/* header */}
      <Header />
      <div className="p-5 lg:ml-32 lg:mt-[35px]">
        {/* TEXTO */}
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "bem vindo"}!
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>

        {/* BUSCA */}
        <div className="mt-6">
          <Search />
        </div>

        {/* BUSCA RÁPIDA */}
        <div className="mt-6 flex gap-3 overflow-x-scroll lg:hidden [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              className="gap-2"
              variant="secondary"
              key={option.title}
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  width={16}
                  height={16}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* IMAGEM */}
        <div className="relative mt-6 h-[150px] w-full lg:h-[150px] lg:w-[418px]">
          <Image
            alt="Agende nos melhores com TLS Barber"
            src="Banner-01.svg"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <div className="mt-6 lg:flex lg:justify-between lg:gap-10">
          {/* Texto e Input no lado esquerdo */}
          <div className="lg:w-2/3">
            {confirmedBookings.length > 0 && (
              <>
                <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
                  Agendamentos
                </h2>

                {/* AGENDAMENTO */}
                <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {confirmedBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={JSON.parse(JSON.stringify(booking))}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recomendados ao lado direito */}
          <div className="lg:mr-[120px] lg:mt-[-340px]">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Recomendados
            </h2>
            <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
              {barbershops.slice(0, 3).map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </div>
        </div>

        <h2 className="mb-3 mt-6 flex items-center justify-between text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-xs font-bold uppercase text-gray-400">
          Mais visitados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
