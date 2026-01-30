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
              © 2025 Copyright <span className="font-bold">TLS Barber.</span>
            </p>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Desenvolvido por</span>
              <Link
                href="https://www.tglsolutions.com.br"
                target="_blank"
                className="ml-1"
              >
                <Image
                  alt="TGL Solutions"
                  src="/logo-tgl.svg"
                  height={18}
                  width={120}
                />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
