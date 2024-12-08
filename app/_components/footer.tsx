import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="px-5 py-6">
          <div className="flex flex-nowrap items-center justify-between sm:flex-wrap sm:justify-center sm:gap-2">
            <p className="text-sm text-gray-400">
              © 2024 Copyright <span className="font-bold">TLS Barber</span>
            </p>
            <Link href="https://www.tglsolutions.com.br">
              <Image
                alt="TGL Solutions"
                src="/logo-tgl.svg"
                height={18}
                width={120}
                className="ml-4"
              />
            </Link>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
