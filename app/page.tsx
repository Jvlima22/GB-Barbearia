import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import ProductItem from "./_components/product-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"
import ServiceItem from "./_components/service-item"
import ScrollableContainer from "./_components/scrollable-container"
import CombinedServiceItem from "./_components/combined-service-item"

const Home = async () => {
  const session = await getServerSession(authOptions)

  const popularProducts = await db.product.findMany({
    take: 10,
  })
  const popularServices = await db.service.findMany({
    take: 10,
  })

  // Fetch combos from database
  const combos = await (db as any).combo.findMany({
    include: {
      service1: true,
      service2: true,
    },
  })

  // Format combos for recommendations
  const recommendedServicePairs = combos.map((combo: any) => ({
    id: `combined_${combo.service1Id}_${combo.service2Id}`,
    name: combo.name,
    description: combo.description,
    imageUrl: combo.imageUrl,
    price: Number(combo.price),
    services: [
      { ...combo.service1, price: Number(combo.service1.price) },
      { ...combo.service2, price: Number(combo.service2.price) },
    ],
  }))

  const confirmedBookings = await getConfirmedBookings()
  // Fetch settings
  const settings = await db.settings.findFirst()

  return (
    <div>
      {/* header */}
      <Header />
      <div className="p-5 lg:ml-32 lg:mt-[-80px] lg:p-[150px]">
        <div className="mt-6 lg:flex lg:gap-10">
          {/* ESQUERDA */}
          <div className="lg:w-[480px]">
            {/* TEXTO */}
            <h2 className="text-xl font-bold text-white">
              Olá, {session?.user ? session.user.name : "bem vindo"}!
            </h2>
            <p>
              <span className="capitalize text-white">
                {format(new Date(), "EEEE, dd", { locale: ptBR })}
              </span>
              <span className="text-white">&nbsp;de&nbsp;</span>
              <span className="capitalize text-white">
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
            <div className="relative mt-6 h-[150px] w-full lg:mt-6 lg:h-[220px] lg:w-full">
              <Image
                alt="Agende nos melhores com TLS Barber"
                src="Banner-01.svg"
                fill
                className="rounded-xl object-cover"
              />
            </div>

            {/* AGENDAMENTOS MÓVEIS SEPARADOS DOS DESKTOP? Não, apenas condicional */}
            {confirmedBookings.length > 0 && (
              <>
                <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-white">
                  Agendamentos
                </h2>

                {/* AGENDAMENTO */}
                <div className="flex w-full gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {confirmedBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={JSON.parse(JSON.stringify(booking))}
                      settings={JSON.parse(JSON.stringify(settings))}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* DIREITA - RECOMENDADOS */}
          <div className="flex-1 min-w-0">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-white lg:mt-[-24px]">
              Recomendados
            </h2>
            <ScrollableContainer maxW="lg:max-w-[872px]">
              {recommendedServicePairs.map((servicePair: any) => (
                <CombinedServiceItem
                  key={servicePair.id}
                  service={servicePair}
                />
              ))}
            </ScrollableContainer>
          </div>
        </div>

        <h2 className="mb-3 mt-6 flex items-center justify-between text-xs font-bold uppercase text-white">
          Serviços populares
        </h2>
        <ScrollableContainer maxW="lg:max-w-[1391px]">
          {popularServices.map((service: any) => (
            <ServiceItem
              key={service.id}
              service={{ ...service, price: Number(service.price) as any }}
            />
          ))}
        </ScrollableContainer>

        <h2 className="mb-3 mt-10 text-xs font-bold uppercase text-white">
          Produtos mais vendidos
        </h2>
        <ScrollableContainer maxW="lg:max-w-[1391px]">
          {popularProducts.map((product: any) => (
            <ProductItem
              key={product.id}
              product={{ ...product, price: Number(product.price) as any }}
            />
          ))}
        </ScrollableContainer>
      </div>
    </div>
  )
}

export default Home
