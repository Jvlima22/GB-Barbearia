"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"
import { Button } from "./ui/button"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CopyIcon,
  QrCodeIcon,
  Settings2Icon,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface PixCheckoutDialogProps {
  isOpen: boolean
  onClose: () => void
  amount: string
  serviceName: string
  gateway: string
  hasActiveBank?: boolean
}

const PixCheckoutDialog = ({
  isOpen,
  onClose,
  amount,
  serviceName,
  gateway,
  hasActiveBank = true,
}: PixCheckoutDialogProps) => {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const provider = gateway.replace("_", " ")

  const handleCopyCode = () => {
    if (!hasActiveBank) return
    navigator.clipboard.writeText(
      "00020126480014br.gov.bcb.pix0126sua-chave-pix-de-testes520400005303986540550.005802BR5911TGL BARBER6009SAO PAULO62070503***6304C0DE",
    )
    toast.success("Código PIX copiado!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md rounded-2xl border-white/10 bg-[#1A1A1A] p-6 sm:w-full">
        <DialogHeader className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${hasActiveBank ? "bg-primary/20" : "bg-yellow-500/20"}`}
          >
            {hasActiveBank ? (
              <QrCodeIcon className="h-8 w-8 text-primary" />
            ) : (
              <AlertTriangleIcon className="h-8 w-8 text-yellow-500" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            {hasActiveBank ? "Pagamento PIX" : "Pagamento Indisponível"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-400">
            {hasActiveBank ? (
              <>
                Escaneie o QR Code ou copie o código PIX abaixo para pagar com o
                banco configurado:{" "}
                <strong className="text-primary">{provider}</strong>
              </>
            ) : (
              "O sistema de pagamentos online ainda não foi ativado para este estabelecimento."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-6">
          {hasActiveBank && (
            <div className="rounded-xl border border-white/10 bg-[#121212] p-4 text-center">
              <h3 className="mb-2 text-sm font-semibold text-gray-400">
                {serviceName}
              </h3>
              <p className="text-3xl font-bold text-white">R$ {amount}</p>
            </div>
          )}

          {hasActiveBank ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2">
                <QrCodeIcon className="h-full w-full text-black" />
              </div>
              <p className="text-xs text-gray-500">
                Código válido por 30 minutos.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-2 text-center text-white">
              <div className="w-full rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-6">
                <p className="text-sm italic leading-relaxed text-yellow-500/80">
                  &quot;O administrador precisa conectar uma conta bancária
                  (Mercado Pago, Asaas ou Itaú) no painel de controle para
                  habilitar esta função.&quot;
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {hasActiveBank ? (
              <>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-primary/50 text-xs text-primary hover:bg-primary/20 sm:text-sm"
                  onClick={handleCopyCode}
                >
                  <CopyIcon className="h-4 w-4" />
                  Copiar Código PIX (Testes)
                </Button>

                <Button className="w-full text-xs sm:text-sm" asChild>
                  <Link href="/bookings?success=true">
                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                    Simular Pagamento Concluído
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {isAdmin && (
                  <Button className="w-full gap-2 text-xs sm:text-sm" asChild>
                    <Link href="/admin?tab=bancos">
                      <Settings2Icon className="h-4 w-4" />
                      Configurar agora
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-xs text-gray-400 hover:bg-white/5 hover:text-white sm:text-sm"
                  onClick={onClose}
                >
                  Fechar aviso
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PixCheckoutDialog
