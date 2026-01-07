import { getServerSession } from "next-auth"
import Header from "../_components/header"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"
import BookingItem from "../_components/booking-item"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluded-bookings"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    // TODO: mostrar pop-up de login
    return notFound()
  }
  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()

  return (
    <>
      <Header />
      <div className="p-5 lg:ml-32 lg:mt-[-80px] lg:p-[150px]">
        <h1 className="mb-3 text-xl font-bold text-white">Agendamentos</h1>
        {confirmedBookings.length === 0 && concludedBookings.length === 0 && (
          <p className="text-gray-400">Você não tem agendamentos.</p>
        )}
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <div key={booking.id} className="lg:w-1/2">
                  <BookingItem booking={JSON.parse(JSON.stringify(booking))} />
                </div>
              ))}
            </div>
          </>
        )}
        {concludedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
            <div className="flex flex-col gap-3">
              {concludedBookings.map((booking) => (
                <div key={booking.id} className="lg:w-64">
                  <BookingItem booking={JSON.parse(JSON.stringify(booking))} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Bookings
