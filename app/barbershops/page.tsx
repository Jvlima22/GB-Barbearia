import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import Search from "../_components/search"
import { db } from "../_lib/prisma"
import ServiceItem from "../_components/service-item"
import ProductItem from "../_components/product-item"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const query = String(
    searchParams?.title || searchParams?.service || "",
  ).trim()

  if (!query) {
    return (
      <div>
        <Header />
        <div className="my-6 px-5 lg:ml-32 lg:mt-[40px] lg:px-[150px]">
          <Search />
        </div>
        <div className="p-5 lg:ml-32 lg:mt-[-140px] lg:p-[150px]">
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Digite algo para buscar
          </h2>
        </div>
      </div>
    )
  }

  const isServicesSearch = query.toLowerCase() === "serviços"
  const isProductsSearch = query.toLowerCase() === "produtos"

  // Fetch services
  const services = isServicesSearch
    ? await db.service.findMany()
    : isProductsSearch
      ? []
      : await db.service.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        })

  // Fetch products
  const products = isProductsSearch
    ? await db.product.findMany()
    : isServicesSearch
      ? []
      : await db.product.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        })

  // Since there's no barbershop model in the schema, we'll create mock data
  const mockBarbershops = [
    {
      id: "1",
      name: "Vintage Barber",
      address: "Avenida São Sebastião, 357, São Paulo",
      imageUrl: "/barbershop-placeholder.jpg",
    },
    {
      id: "2",
      name: "Homem Elegante",
      address: "Avenida São Sebastião, 357, São Paulo",
      imageUrl: "/barbershop-placeholder2.jpg",
    },
    {
      id: "3",
      name: "Clássica Cortez",
      address: "Avenida São Sebastião, 357, São Paulo",
      imageUrl: "/barbershop-placeholder3.jpg",
    },
  ]

  const filteredBarbershops =
    isServicesSearch || isProductsSearch
      ? []
      : mockBarbershops.filter((barbershop) =>
          barbershop.name.toLowerCase().includes(query.toLowerCase()),
        )

  const hasResults =
    services.length > 0 || products.length > 0 || filteredBarbershops.length > 0

  return (
    <div>
      <Header />
      <div className="my-6 px-5 lg:ml-32 lg:mt-[40px] lg:px-[150px]">
        <Search />
      </div>
      <div className="p-5 lg:ml-32 lg:mt-[-140px] lg:p-[150px]">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{query}&quot;
        </h2>

        {!hasResults && (
          <p className="text-sm text-gray-400">Nenhum resultado encontrado.</p>
        )}

        {services.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-xs font-bold uppercase text-white">
              Serviços
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
              {services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={{ ...service, price: Number(service.price) as any }}
                />
              ))}
            </div>
          </>
        )}

        {products.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-xs font-bold uppercase text-white">
              Produtos
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
              {products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={{ ...product, price: Number(product.price) as any }}
                />
              ))}
            </div>
          </>
        )}

        {filteredBarbershops.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-xs font-bold uppercase text-white">
              Barbearias
            </h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {filteredBarbershops.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BarbershopsPage
