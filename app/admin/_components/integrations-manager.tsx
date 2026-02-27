"use client"

import { useState } from "react"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/_components/ui/dialog"
import { upsertBankCredential } from "@/app/_actions/upsert-bank-credential"
import { toast } from "sonner"
import {
  CheckCircle2Icon,
  WalletIcon,
  PlusIcon,
  GlobeIcon,
  LayoutGridIcon,
  ListIcon,
  InfoIcon,
  ExternalLinkIcon,
} from "lucide-react"

const getBankHelpInstructions = (provider: string) => {
  switch (provider) {
    case "ITAU":
      return {
        steps: [
          "Acesse o portal Itaú for Developers (devportal.itau.com.br).",
          "Faça login com os dados da conta Empresas do titular.",
          "Crie uma nova 'Aplicação' na seção de Pix ou Cobrança.",
          "Copie o 'Client ID' e 'Client Secret' (Token Temporário) gerados e cole aqui.",
        ],
        link: "https://devportal.itau.com.br/",
      }
    case "BRADESCO":
      return {
        steps: [
          "Acesse o portal Bradesco Developers (api.bradesco).",
          "Selecione a API Pix ou Boleto no Catálogo de APIs.",
          "Siga o fluxo de geração de chaves e certificados de produção.",
          "Faça o upload/cole o arquivo .pem gerado aqui para efetivar as cobranças.",
        ],
        link: "https://api.bradesco/",
      }
    case "MERCADO_PAGO":
      return {
        steps: [
          "Acesse o Mercado Pago Developers (mercadopago.com.br/developers).",
          "Vá no menu superior 'Suas integrações'.",
          "Acesse a seção 'Credenciais de Produção'.",
          "Copie o 'Acess Token' (Token de Produção) e insira abaixo no campo 'Client Secret'.",
        ],
        link: "https://www.mercadopago.com.br/developers/",
      }
    case "PICPAY":
      return {
        steps: [
          "Acesse o Painel Lojista do PicPay (painel-lojista.picpay.com).",
          "Vá no menu Configurações > Integrações e APIs.",
          "Encontre a opção de Gerar Tokens (x-seller-token).",
          "Copie a chave ativa e cole aqui para habilitar sua carteira.",
        ],
        link: "https://studio.picpay.com/",
      }
    case "CUSTOM":
      return {
        steps: [
          "Acesse o painel de desenvolvedor do seu Gateway de Pagamento (ex: Asaas, Pagar.me, Vindi).",
          "Procure pelo serviço chamado 'Webhooks' ou 'Notificações de Pagamentos'.",
          "Adicione a URL do seu sistema na plataforma para os avisos acontecerem de forma automática.",
        ],
        link: "",
      }
    default:
      return { steps: [], link: "" }
  }
}

interface IntegrationsManagerProps {
  banks: any[] // Extended Bank type with credentials check
}

const getBankLogo = (provider: string, imageUrl: string) => {
  if (provider === "ITAU")
    return "https://logodownload.org/wp-content/uploads/2014/05/itau-logo-2.png"
  if (provider === "BRADESCO")
    return "https://logodownload.org/wp-content/uploads/2018/09/bradesco-logo-4.png"
  if (provider === "MERCADO_PAGO")
    return "https://cdn.shopify.com/app-store/listing_images/4f3dc60a0ef8beee2a168713fe20181f/icon/CIHzwOjZsI0DEAE=.png"
  if (provider === "PICPAY")
    return "https://www.pngall.com/wp-content/uploads/13/PayPal-Logo-PNG.png"
  return imageUrl
}

const IntegrationsManager = ({ banks }: IntegrationsManagerProps) => {
  const [selectedBank, setSelectedBank] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Form state
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [publicKey, setPublicKey] = useState("")

  const handleOpenBank = (bank: any) => {
    setSelectedBank(bank)
    setClientId("")
    setClientSecret("")
    setPublicKey("")
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Preencha Client ID e Client Secret")
      return
    }

    try {
      setIsLoading(true)
      await upsertBankCredential({
        bankId: selectedBank.id,
        clientId,
        clientSecret,
        publicKey,
        environment: "PRODUCTION", // Defaulting to production for now, can be improved.
      })
      toast.success("Credenciais salvas com sucesso!")
      setIsDialogOpen(false)
      // Optional: Refresh page to get updated banks state
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar as credenciais")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
        <div>
          <h2 className="text-lg font-bold text-white lg:text-xl">
            Integrações Bancárias
          </h2>
          <p className="text-xs text-gray-400 lg:text-sm">
            Conecte as suas contas para receber os pagamentos diretamente. O
            dinheiro cai direto na sua conta, em seu CNPJ/CPF, sem
            intermediários.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex w-fit self-end rounded-lg border border-white/10 bg-[#1A1A1A] p-1 lg:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md p-2 transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <LayoutGridIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-md p-2 transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-3"
        }
      >
        {banks.map((bank) => {
          const hasCredentials = bank.credentials && bank.credentials.length > 0

          if (viewMode === "list") {
            return (
              <div
                key={bank.id}
                className="flex flex-row items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#1A1A1A] p-3 transition-colors hover:border-primary/50 lg:p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg lg:h-10 lg:w-10">
                    <img
                      src={getBankLogo(bank.provider, bank.imageUrl)}
                      alt={bank.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden",
                        )
                      }}
                    />
                    <WalletIcon className="hidden h-4 w-4 text-primary lg:h-5 lg:w-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <h3 className="truncate text-xs font-bold text-white lg:text-base">
                        {bank.name}
                      </h3>
                      {hasCredentials && (
                        <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0 text-green-500 lg:h-4 lg:w-4" />
                      )}
                    </div>
                    <p className="truncate text-[9px] text-gray-400 lg:text-sm">
                      {hasCredentials
                        ? `Conectado em ${bank.credentials[0]?.environment === "PRODUCTION" ? "Produção" : "Testes"}`
                        : "Nenhuma vinculada"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasCredentials ? "outline" : "default"}
                  size="sm"
                  className="h-7 w-auto shrink-0 px-2.5 text-[10px] lg:h-9 lg:px-4 lg:text-sm"
                  onClick={() => handleOpenBank(bank)}
                  disabled={!bank.isActive} // In case some banks are "coming soon"
                >
                  {bank.isActive
                    ? hasCredentials
                      ? "Atualizar"
                      : "Conectar"
                    : "Em Breve"}
                </Button>
              </div>
            )
          }
          return (
            <div
              key={bank.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#1A1A1A] p-4 transition-colors hover:border-primary/50 lg:gap-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg lg:h-10 lg:w-10">
                    <img
                      src={getBankLogo(bank.provider, bank.imageUrl)}
                      alt={bank.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden",
                        )
                      }}
                    />
                    <WalletIcon className="hidden h-4 w-4 text-primary lg:h-5 lg:w-5" />
                  </div>
                  <h3 className="text-sm font-bold leading-tight text-white lg:text-base">
                    {bank.name}
                  </h3>
                </div>
                {hasCredentials && (
                  <CheckCircle2Icon className="h-4 w-4 text-green-500 lg:h-6 lg:w-6" />
                )}
              </div>
              <p className="min-h-[20px] text-xs leading-snug text-gray-400 lg:min-h-[40px] lg:text-sm">
                {hasCredentials
                  ? `Em ambiente de ${bank.credentials[0]?.environment === "PRODUCTION" ? "Produção" : "Testes"}.`
                  : "Nenhuma conta vinculada."}
              </p>
              <Button
                variant={hasCredentials ? "outline" : "default"}
                size="sm"
                className="mt-1 h-8 w-full text-xs lg:mt-2 lg:h-9 lg:text-sm"
                onClick={() => handleOpenBank(bank)}
                disabled={!bank.isActive} // In case some banks are "coming soon"
              >
                {bank.isActive
                  ? hasCredentials
                    ? "Atualizar Chave"
                    : "Conectar"
                  : "Em Breve"}
              </Button>
            </div>
          )
        })}
        {/* Custom Gateway Option */}
        {viewMode === "grid" ? (
          <div
            className="flex cursor-pointer flex-col gap-3 rounded-xl border border-dashed border-white/20 bg-[#1A1A1A]/50 p-4 transition-colors hover:border-primary/50 lg:gap-4 lg:p-6"
            onClick={() =>
              handleOpenBank({
                name: "Gateway Customizado",
                provider: "CUSTOM",
              })
            }
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 lg:h-10 lg:w-10">
                <GlobeIcon className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
              </div>
              <h3 className="text-sm font-bold leading-tight text-white lg:text-base">
                Integração Universal
              </h3>
            </div>
            <p className="min-h-[35px] text-xs leading-snug text-gray-400 lg:min-h-[40px] lg:text-sm">
              Conecte com gateways do mundo (Pagar.me, Asaas, PagBank) via
              Webhook genérico.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 h-8 w-full border-primary/50 text-xs text-primary hover:bg-primary/10 lg:mt-2 lg:h-9 lg:text-sm"
            >
              <PlusIcon className="mr-1.5 h-3 w-3 lg:mr-2 lg:h-4 lg:w-4" />{" "}
              Configurar
            </Button>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-row items-center justify-between gap-2 rounded-xl border border-dashed border-white/20 bg-[#1A1A1A]/50 p-3 transition-colors hover:border-primary/50 lg:p-4"
            onClick={() =>
              handleOpenBank({
                name: "Gateway Customizado",
                provider: "CUSTOM",
              })
            }
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 lg:h-10 lg:w-10">
                <GlobeIcon className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate text-xs font-bold text-white lg:text-base">
                  Integração Universal
                </h3>
                <p className="truncate text-[9px] text-gray-400 lg:text-sm">
                  Conecte com Asaas, Pagar.me, PagBank, Vindi
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-auto shrink-0 border-primary/50 px-2.5 text-[10px] text-primary hover:bg-primary/10 lg:h-9 lg:px-4 lg:text-sm"
            >
              <PlusIcon className="mr-1 hidden h-3 w-3 lg:mr-2 lg:inline lg:h-4 lg:w-4" />{" "}
              Configurar
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-white/10 bg-[#1A1A1A] sm:max-w-[450px]">
          <DialogHeader>
            <div className="mr-6 flex items-center justify-between">
              <DialogTitle className="text-white">
                Conectar {selectedBank?.name}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10 hover:text-white/80"
                onClick={() => setIsHelpDialogOpen(true)}
                title="Como configurar?"
              >
                <InfoIcon className="h-5 w-5" />
              </Button>
            </div>
            <DialogDescription className="mt-2 text-gray-400">
              Insira as credenciais geradas no painel do banco. Elas serão
              criptografadas e não ficarão expostas em nosso banco de dados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">
                Client ID
              </label>
              <Input
                placeholder="Insira o Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="border-white/10 bg-[#222]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">
                Client Secret (Token Temporário)
              </label>
              <Input
                placeholder="Insira o Client Secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="border-white/10 bg-[#222]"
              />
            </div>
            {selectedBank?.provider === "ITAU" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  Chave Pública (Opcional - mTLS)
                </label>
                <Input
                  placeholder="Insira a chave pública se tiver"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="border-white/10 bg-[#222]"
                />
              </div>
            )}
            {selectedBank?.provider === "CUSTOM" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  URL do Webhook (Seu Endpoint)
                </label>
                <Input
                  placeholder="https://seu-gateway.com/webhook"
                  value={publicKey} // reusing pubkey state for custom webhook just for UI logic
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="border-white/10 bg-[#222]"
                />
              </div>
            )}
            {selectedBank?.provider === "PICPAY" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  PicPay Seller Token (x-seller-token)
                </label>
                <Input
                  placeholder="Insira o Seller Token"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="border-white/10 bg-[#222]"
                />
              </div>
            )}
            {selectedBank?.provider === "MERCADO_PAGO" && (
              <p className="rounded border border-blue-400/20 bg-blue-400/10 p-2 text-xs text-blue-400">
                Para o Mercado Pago, o &quot;Client.Secret&quot; equivale ao seu
                &quot;Access Token&quot; de Produção (APP_USR-...). O Client ID
                pode ser a sua Chave Pública (APP_USR-...).
              </p>
            )}
            {selectedBank?.provider === "BRADESCO" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  Certificado .PEM (Chave Privada)
                </label>
                <Input
                  placeholder="Cole aqui o conteúdo do seu certificado pfx/pem gerado..."
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="border-white/10 bg-[#222]"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
              className="border-white/10 text-white"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="border-white/10 bg-[#1A1A1A] sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Como configurar {selectedBank?.name}?
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Siga os passos abaixo para encontrar suas credenciais do parceiro.
            </DialogDescription>
          </DialogHeader>

          {selectedBank && (
            <div className="my-2 flex flex-col gap-3 rounded-md border border-primary/20 bg-primary/10 p-4 text-sm text-gray-300">
              <ul className="list-inside list-decimal space-y-2">
                {getBankHelpInstructions(selectedBank.provider).steps.map(
                  (step, i) => (
                    <li key={i} className="leading-snug">
                      {step}
                    </li>
                  ),
                )}
              </ul>
              {getBankHelpInstructions(selectedBank.provider).link && (
                <a
                  href={getBankHelpInstructions(selectedBank.provider).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center pb-1 font-bold text-white hover:text-gray-300 hover:underline"
                >
                  Acessar Documentação da API{" "}
                  <ExternalLinkIcon className="ml-1 h-4 w-4" />
                </a>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsHelpDialogOpen(false)}>Entendi</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IntegrationsManager
