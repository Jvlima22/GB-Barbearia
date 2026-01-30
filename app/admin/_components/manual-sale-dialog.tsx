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
        <Button className="gap-2 bg-green-600 text-white hover:bg-green-700">
          <ShoppingCartIcon size={18} />
          Nova venda
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#1A1A1A] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova venda manual</DialogTitle>
          <DialogDescription className="text-gray-400">
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
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="border-white/10 bg-[#222]">
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
                  <FormLabel>Produto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="border-white/10 bg-[#222]">
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
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="border-white/10 bg-[#222]"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-white/10 text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-[#3EABFD] text-white hover:bg-[#2e8acb]"
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirmar venda
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ManualSaleDialog
