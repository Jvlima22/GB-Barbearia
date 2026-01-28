"use client"

import { Product } from "@prisma/client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { Trash2Icon } from "lucide-react"
import { deleteProduct } from "@/app/_actions/delete-product"
import { toast } from "sonner"
import UpsertProductDialog from "./upsert-product-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"

interface ProductsTableProps {
    products: Product[]
}

const ProductsTable = ({ products }: ProductsTableProps) => {
    const handleDeleteClick = async (id: string) => {
        try {
            await deleteProduct(id)
            toast.success("Produto excluído com sucesso!")
        } catch (error) {
            toast.error("Erro ao excluir produto.")
        }
    }

    return (
        <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-xl">Gerenciar produtos</CardTitle>
                <div className="w-fit">
                    <UpsertProductDialog />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#222] text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Nome</th>
                                <th className="px-4 py-3">Descrição</th>
                                <th className="px-4 py-3">Preço</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5">
                                    <td className="px-4 py-3 font-medium text-white">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 max-w-xs truncate">
                                        {product.description}
                                    </td>
                                    <td className="px-4 py-3">
                                        {Number(product.price).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <UpsertProductDialog
                                            defaultValues={{
                                                id: product.id,
                                                name: product.name,
                                                description: product.description,
                                                imageUrl: product.imageUrl,
                                                price: Number(product.price),
                                            }}
                                        />

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-500">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Esta ação não pode ser desfeita. Isso excluirá
                                                        permanentemente o produto &quot;{product.name}&quot;.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-[#222] border-white/10 text-white">
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteClick(product.id)}
                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                    >
                                                        Excluir
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center">
                                        Nenhum produto cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductsTable
