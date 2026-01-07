"use client"

import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { useState } from "react"
import ProductPurchaseSheet from "./product-purchase-sheet"

interface ProductItemProps {
  product: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: number
  }
}

const ProductItem = ({ product }: ProductItemProps) => {
  const [isPurchaseSheetOpen, setIsPurchaseSheetOpen] = useState(false)

  return (
    <>
      <Card className="min-w-[167px] rounded-2xl lg:w-[185px]">
        <CardContent className="p-0 px-1 pt-1">
          {/* IMAGEM */}
          <div className="relative h-[159px] w-full">
            <Image
              alt={product.name}
              fill
              className="rounded-2xl object-cover"
              src={product.imageUrl}
            />
          </div>

          {/* TEXTO */}
          <div className="px-1 py-3">
            <h3 className="truncate text-sm font-semibold text-white">
              {product.name}
            </h3>
            <p className="truncate text-xs text-gray-400">
              {product.description}
            </p>
            <p className="text-xs font-bold" style={{ color: "#3EABFD" }}>
              R$ {Number(product.price).toFixed(2)}
            </p>
            <Button
              variant="secondary"
              className="mt-3 w-full rounded-xl bg-[#102332] hover:bg-[#3EABFD]"
              onClick={() => setIsPurchaseSheetOpen(true)}
            >
              <span className="text-xs text-white">Comprar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductPurchaseSheet
        product={product}
        isOpen={isPurchaseSheetOpen}
        onClose={() => setIsPurchaseSheetOpen(false)}
      />
    </>
  )
}

export default ProductItem
