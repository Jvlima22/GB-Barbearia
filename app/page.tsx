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
import CombinedServiceItem from "./_components/combined-service-item"

const Home = async () => {
  const session = await getServerSession(authOptions)

  const popularProducts = await db.product.findMany({
    take: 10,
  })
  const popularServices = await db.service.findMany({
    take: 10,
  })

  // Fetch all services to use for recommendations
  const allServices = await db.service.findMany()

  // Function to combine services in pairs
  const combineServicesInPairs = (services: any[]) => {
    const pairs = []
    for (let i = 0; i < services.length; i += 2) {
      if (i + 1 < services.length) {
        // Combine two services
        pairs.push({
          id: `combined_${services[i].id}_${services[i + 1].id}`,
          name: `${services[i].name} + ${services[i + 1].name}`,
          description: `${services[i].description} e ${services[i + 1].description}`,
          imageUrl: services[i].imageUrl, // Using the first service's image
          price: Number(services[i].price) + Number(services[i + 1].price), // Combined price
          services: [
            {
              ...services[i],
              price: Number(services[i].price),
            },
            {
              ...services[i + 1],
              price: Number(services[i + 1].price),
            },
          ], // Store both services for reference with converted prices
        })
      } else {
        // If there's an odd number of services, add the last one as a single
        pairs.push({
          id: services[i].id,
          name: services[i].name,
          description: services[i].description,
          imageUrl: services[i].imageUrl,
          price: Number(services[i].price),
          services: [
            {
              ...services[i],
              price: Number(services[i].price),
            },
          ],
        })
      }
    }
    return pairs
  }

  // Reorder services to put "Corte degradê" and "Barba" first for the recommendation
  const orderedForRecommendation = [
    allServices.find((s) => s.name.toLowerCase().includes("degradê")),
    allServices.find((s) => s.name.toLowerCase().includes("barba")),
    allServices.find((s) => s.name.toLowerCase().includes("disfarçado")),
    allServices.find((s) => s.name.toLowerCase().includes("sobrancelha")),
    allServices.find((s) => s.name.toLowerCase().includes("social")),
    allServices.find((s) => s.name.toLowerCase().includes("alisamento")),
  ].filter((s): s is any => !!s)

  // Create combined service pairs for recommendations
  const recommendedServicePairs = combineServicesInPairs(
    orderedForRecommendation.length > 0
      ? orderedForRecommendation
      : allServices.slice(0, 6),
  )

  const confirmedBookings = await getConfirmedBookings()

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
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* DIREITA - RECOMENDADOS */}
          <div className="flex-1">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-white lg:mt-[-24px]">
              Recomendados
            </h2>
            <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
              {recommendedServicePairs.slice(0, 3).map((servicePair: any) => (
                <CombinedServiceItem
                  key={servicePair.id}
                  service={servicePair}
                />
              ))}
            </div>
          </div>
        </div>

        <h2 className="mb-3 mt-6 flex items-center justify-between text-xs font-bold uppercase text-white">
          Serviços populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularServices.map((service: any) => (
            <ServiceItem
              key={service.id}
              service={{ ...service, price: Number(service.price) as any }}
            />
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-xs font-bold uppercase text-white">
          Produtos mais vendidos
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularProducts.map((product: any) => (
            <ProductItem
              key={product.id}
              product={{ ...product, price: Number(product.price) as any }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
