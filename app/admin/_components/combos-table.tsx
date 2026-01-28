"use client"

import { Service } from "@prisma/client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { Trash2Icon } from "lucide-react"
import { deleteCombo } from "@/app/_actions/delete-combo"
import { toast } from "sonner"
import UpsertComboDialog from "./upsert-combo-dialog"
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

interface CombosTableProps {
    combos: (any & { service1: Service; service2: Service })[]
    services: Service[]
}

const CombosTable = ({ combos, services }: CombosTableProps) => {
    const handleDeleteClick = async (id: string) => {
        try {
            await deleteCombo(id)
            toast.success("Combo excluído com sucesso!")
        } catch (error) {
            toast.error("Erro ao excluir combo.")
        }
    }

    return (
        <Card className="border-white/10 bg-[#1A1A1A]">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-xl">Gerenciar combos</CardTitle>
                <div className="w-fit">
                    <UpsertComboDialog services={services} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#222] text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Nome</th>
                                <th className="px-4 py-3">Serviços</th>
                                <th className="px-4 py-3">Preço</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {combos.map((combo) => (
                                <tr key={combo.id} className="hover:bg-white/5">
                                    <td className="px-4 py-3 font-medium text-white">
                                        {combo.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-4 py-3 max-w-xs truncate">
                                            {combo.service1.name} + {combo.service2.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {Number(combo.price).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <UpsertComboDialog
                                            services={services}
                                            defaultValues={{
                                                id: combo.id,
                                                name: combo.name,
                                                description: combo.description,
                                                imageUrl: combo.imageUrl,
                                                price: Number(combo.price),
                                                service1Id: combo.service1Id,
                                                service2Id: combo.service2Id,
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
                                                        permanentemente o combo &quot;{combo.name}&quot;.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-[#222] border-white/10 text-white">
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteClick(combo.id)}
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
                            {combos.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center">
                                        Nenhum combo cadastrado.
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

export default CombosTable
