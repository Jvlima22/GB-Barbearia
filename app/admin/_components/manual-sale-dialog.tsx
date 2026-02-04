"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, ShoppingCartIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"
import { Input } from "@/app/_components/ui/input"

import { ManualSaleSchema, manualSaleSchema } from "../_schemas"
import { createManualSale } from "@/app/_actions/create-manual-sale"

interface ManualSaleDialogProps {
  users: any[]
  products: any[]
}

const ManualSaleDialog = ({ users, products }: ManualSaleDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<ManualSaleSchema>({
    resolver: zodResolver(manualSaleSchema),
    defaultValues: {
      userId: "",
      productId: "",
      quantity: 1,
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        userId: "",
        productId: "",
        quantity: 1,
      })
    }
  }, [isOpen, form])

  const onSubmit = async (data: ManualSaleSchema) => {
    try {
      await createManualSale(data)
      toast.success("Venda manual realizada com sucesso!")
      setIsOpen(false)
      form.reset()
    } catch (error) {
      toast.error("Erro ao realizar venda manual.")
      console.error(error)
    }
  }

  const selectedProductId = form.watch("productId")
  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const quantity = form.watch("quantity")
  const total = selectedProduct ? Number(selectedProduct.price) * quantity : 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-green-600 px-2 text-xs text-white hover:bg-green-700 lg:w-auto lg:gap-2 lg:px-4 lg:text-sm">
          <ShoppingCartIcon className="h-5 w-5 lg:h-[18px] lg:w-[18px]" />
          Nova venda
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-1rem)] border-white/10 bg-[#1A1A1A] p-3 text-white sm:max-w-[425px] lg:p-6">
        <DialogHeader className="space-y-0.5 lg:space-y-2">
          <DialogTitle className="text-[clamp(0.95rem,4vw,1.125rem)] lg:text-xl">
            Nova venda manual
          </DialogTitle>
          <DialogDescription className="text-[10px] text-gray-400 lg:text-sm">
            Registre a venda de um produto diretamente no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] lg:text-sm">
                    Cliente
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 border-white/10 bg-[#222] text-xs lg:h-10 lg:text-sm">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] border-white/10 bg-[#1A1A1A] text-white">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] lg:text-sm">
                    Produto
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 border-white/10 bg-[#222] text-xs lg:h-10 lg:text-sm">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] border-white/10 bg-[#1A1A1A] text-white">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - R$ {Number(product.price).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] lg:text-sm">
                    Quantidade
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="h-8 border-white/10 bg-[#222] text-xs lg:h-10 lg:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-white/5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total:</span>
                <span className="text-xl font-bold text-white">
                  R${" "}
                  {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <DialogFooter className="flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-9 flex-1 border-white/10 text-white lg:h-10 lg:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-9 flex-1 bg-[#3EABFD] text-white hover:bg-[#2e8acb] lg:h-10 lg:flex-none"
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ManualSaleDialog
