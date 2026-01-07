import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { redirect } from "next/navigation"
import { getAdminSummary } from "../_data/get-admin-summary"
import Header from "../_components/header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card"
import { Badge } from "../_components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, PackageIcon, ScissorsIcon } from "lucide-react"

const AdminPage = async () => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    return redirect("/")
  }

  const { bookings, purchases, services } = await getAdminSummary()

  const totalRevenue =
    bookings.reduce((acc, booking) => acc + Number(booking.service.price), 0) +
    purchases.reduce(
      (acc, purchase) =>
        acc + Number(purchase.product.price) * purchase.quantity,
      0,
    )

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Header />

      <div className="container mx-auto px-5 py-6">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Painel Administrativo
        </h1>

        {/* METRICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Agendamentos
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {bookings.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Produtos Vendidos
              </CardTitle>
              <PackageIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {purchases.reduce((acc, p) => acc + p.quantity, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Serviços Ativos
              </CardTitle>
              <ScissorsIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {services.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Receita Total
              </CardTitle>
              <span className="font-bold text-primary">R$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalRevenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Últimos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-[#222] p-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {booking.user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {booking.service.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-white">
                      {format(booking.date, "dd/MM HH:mm", { locale: ptBR })}
                    </span>
                    <Badge
                      variant="outline"
                      className="h-5 border-white text-[10px] text-white"
                    >
                      Confirmado
                    </Badge>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nenhum agendamento encontrado.
                </p>
              )}
            </CardContent>
          </Card>

          {/* RECENT PURCHASES */}
          <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Vendas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {purchases.slice(0, 5).map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-[#222] p-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {purchase.user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {purchase.product.name} ({purchase.quantity}x)
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-white">
                      R${" "}
                      {(
                        Number(purchase.product.price) * purchase.quantity
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {format(purchase.createdAt, "dd/MM HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {purchases.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nenhuma venda encontrada.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
