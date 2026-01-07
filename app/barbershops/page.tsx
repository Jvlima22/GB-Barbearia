import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import Search from "../_components/search"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
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
    {
      id: "4",
      name: "The Barber Shop",
      address: "Rua Augusta, 1200, São Paulo",
      imageUrl: "/barbershop-placeholder.jpg",
    },
    {
      id: "5",
      name: "Urban Cuts",
      address: "Avenida Paulista, 1000, São Paulo",
      imageUrl: "/barbershop-placeholder2.jpg",
    },
    {
      id: "6",
      name: "Classic Style",
      address: "Rua Oscar Freire, 300, São Paulo",
      imageUrl: "/barbershop-placeholder3.jpg",
    },
  ]

  // Filter mock barbershops based on search parameters
  let filteredBarbershops = mockBarbershops

  if (searchParams?.title) {
    filteredBarbershops = filteredBarbershops.filter((barbershop) =>
      barbershop.name.toLowerCase().includes(searchParams.title!.toLowerCase()),
    )
  }

  // For service search, we'll just return all barbershops since there's no relation
  if (searchParams?.service) {
    // In a real implementation, we'd check if any services match
    // For now, we'll just return all barbershops
  }

  const barbershops = filteredBarbershops

  return (
    <div>
      <Header />
      <div className="my-6 px-5 lg:ml-32 lg:mt-[40px] lg:px-[150px]">
        <Search />
      </div>
      <div className="p-5 lg:ml-32 lg:mt-[-140px] lg:p-[150px]">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{searchParams?.title || searchParams?.service}
          &quot;
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:h-auto">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopsPage
