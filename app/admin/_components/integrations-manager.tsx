"use client";

import { useState } from "react";
import { Bank } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/_components/ui/dialog";
import { upsertBankCredential } from "@/app/_actions/upsert-bank-credential";
import { toast } from "sonner";
import { CheckCircle2Icon, WalletIcon, PlusIcon, GlobeIcon, LayoutGridIcon, ListIcon, InfoIcon, ExternalLinkIcon } from "lucide-react";

const getBankHelpInstructions = (provider: string) => {
  switch (provider) {
    case "ITAU":
      return {
        steps: [
          "Acesse o portal Itaú for Developers (devportal.itau.com.br).",
          "Faça login com os dados da conta Empresas do titular.",
          "Crie uma nova 'Aplicação' na seção de Pix ou Cobrança.",
          "Copie o 'Client ID' e 'Client Secret' (Token Temporário) gerados e cole aqui."
        ],
        link: "https://devportal.itau.com.br/"
      };
    case "BRADESCO":
      return {
        steps: [
          "Acesse o portal Bradesco Developers (api.bradesco).",
          "Selecione a API Pix ou Boleto no Catálogo de APIs.",
          "Siga o fluxo de geração de chaves e certificados de produção.",
          "Faça o upload/cole o arquivo .pem gerado aqui para efetivar as cobranças."
        ],
        link: "https://api.bradesco/"
      };
    case "MERCADO_PAGO":
      return {
        steps: [
          "Acesse o Mercado Pago Developers (mercadopago.com.br/developers).",
          "Vá no menu superior 'Suas integrações'.",
          "Acesse a seção 'Credenciais de Produção'.",
          "Copie o 'Acess Token' (Token de Produção) e insira abaixo no campo 'Client Secret'."
        ],
        link: "https://www.mercadopago.com.br/developers/"
      };
    case "PICPAY":
      return {
        steps: [
          "Acesse o Painel Lojista do PicPay (painel-lojista.picpay.com).",
          "Vá no menu Configurações > Integrações e APIs.",
          "Encontre a opção de Gerar Tokens (x-seller-token).",
          "Copie a chave ativa e cole aqui para habilitar sua carteira."
        ],
        link: "https://studio.picpay.com/"
      };
    case "CUSTOM":
      return {
        steps: [
          "Acesse o painel de desenvolvedor do seu Gateway de Pagamento (ex: Asaas, Pagar.me, Vindi).",
          "Procure pelo serviço chamado 'Webhooks' ou 'Notificações de Pagamentos'.",
          "Adicione a URL do seu sistema na plataforma para os avisos acontecerem de forma automática."
        ],
        link: ""
      };
    default:
      return { steps: [], link: "" };
  }
};

interface IntegrationsManagerProps {
  banks: any[]; // Extended Bank type with credentials check
}

const getBankLogo = (provider: string, imageUrl: string) => {
  if (provider === "ITAU") return "https://logodownload.org/wp-content/uploads/2014/05/itau-logo-2.png";
  if (provider === "BRADESCO") return "https://logodownload.org/wp-content/uploads/2018/09/bradesco-logo-4.png";
  if (provider === "MERCADO_PAGO") return "https://cdn.shopify.com/app-store/listing_images/4f3dc60a0ef8beee2a168713fe20181f/icon/CIHzwOjZsI0DEAE=.png";
  if (provider === "PICPAY") return "https://www.pngall.com/wp-content/uploads/13/PayPal-Logo-PNG.png";
  return imageUrl;
};

const IntegrationsManager = ({ banks }: IntegrationsManagerProps) => {
  const [selectedBank, setSelectedBank] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Form state
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const handleOpenBank = (bank: any) => {
    setSelectedBank(bank);
    setClientId("");
    setClientSecret("");
    setPublicKey("");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Preencha Client ID e Client Secret");
      return;
    }

    try {
      setIsLoading(true);
      await upsertBankCredential({
        bankId: selectedBank.id,
        clientId,
        clientSecret,
        publicKey,
        environment: "PRODUCTION", // Defaulting to production for now, can be improved.
      });
      toast.success("Credenciais salvas com sucesso!");
      setIsDialogOpen(false);
      // Optional: Refresh page to get updated banks state
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar as credenciais");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Integrações Bancárias</h2>
          <p className="text-sm text-gray-400">
            Conecte as suas contas para receber os pagamentos diretamente. O dinheiro cai direto na sua conta, em seu CNPJ/CPF, sem intermediários.
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-[#1A1A1A] rounded-lg border border-white/10 p-1">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <LayoutGridIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" 
        : "flex flex-col gap-3"
      }>
        {banks.map((bank) => {
          const hasCredentials = bank.credentials && bank.credentials.length > 0;
          
          if (viewMode === "list") {
            return (
              <div
                key={bank.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1A1A1A] p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={getBankLogo(bank.provider, bank.imageUrl)} 
                      alt={bank.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <WalletIcon className="h-5 w-5 text-primary hidden" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{bank.name}</h3>
                      {hasCredentials && (
                        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {hasCredentials
                        ? `Conectado em ${bank.credentials[0]?.environment === "PRODUCTION" ? "Produção" : "Testes"}`
                        : "Nenhuma conta vinculada"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasCredentials ? "outline" : "default"}
                  onClick={() => handleOpenBank(bank)}
                  disabled={!bank.isActive} // In case some banks are "coming soon"
                >
                  {bank.isActive
                    ? (hasCredentials ? "Atualizar" : "Conectar")
                    : "Em Breve"}
                </Button>
              </div>
            );
          }
          return (
            <div
              key={bank.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1A1A1A] p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={getBankLogo(bank.provider, bank.imageUrl)} 
                      alt={bank.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <WalletIcon className="h-5 w-5 text-primary hidden" />
                  </div>
                  <h3 className="font-bold text-white">{bank.name}</h3>
                </div>
                {hasCredentials && (
                  <CheckCircle2Icon className="h-6 w-6 text-green-500" />
                )}
              </div>
              <p className="min-h-[40px] text-sm text-gray-400">
                {hasCredentials
                  ? `Conectado em ambiente de ${bank.credentials[0]?.environment === "PRODUCTION" ? "Produção" : "Testes"}.`
                  : "Nenhuma conta vinculada."}
              </p>
              <Button
                variant={hasCredentials ? "outline" : "default"}
                className="w-full mt-2"
                onClick={() => handleOpenBank(bank)}
                disabled={!bank.isActive} // In case some banks are "coming soon"
              >
                {bank.isActive
                  ? (hasCredentials ? "Atualizar Credenciais" : "Conectar")
                  : "Em Breve"}
              </Button>
            </div>
          );
        })}
        {/* Custom Gateway Option */}
        {viewMode === "grid" ? (
          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-white/20 bg-[#1A1A1A]/50 p-6 hover:border-primary/50 transition-colors cursor-pointer"
               onClick={() => handleOpenBank({ name: "Gateway Customizado (API/Webhook)", provider: "CUSTOM" })}
          >
             <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 shrink-0">
                  <GlobeIcon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-white">Integração Universal</h3>
              </div>
              <p className="min-h-[40px] text-sm text-gray-400">
                  Conecte com qualquer gateway de pagamento do mundo (Pagar.me, Asaas, PagBank) via Webhook genérico.
              </p>
              <Button variant="outline" className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10">
                <PlusIcon className="mr-2 h-4 w-4" /> Configurar Webhook
              </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-dashed border-white/20 bg-[#1A1A1A]/50 p-4 hover:border-primary/50 transition-colors cursor-pointer"
               onClick={() => handleOpenBank({ name: "Gateway Customizado (API/Webhook)", provider: "CUSTOM" })}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shrink-0">
                <GlobeIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white">Integração Universal</h3>
                <p className="text-sm text-gray-400">
                  Conecte com Asaas, Pagar.me, PagBank, Vindi via Webhook
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <PlusIcon className="mr-2 h-4 w-4" /> Configurar Webhook
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-white/10 bg-[#1A1A1A] sm:max-w-[450px]">
          <DialogHeader>
            <div className="flex items-center justify-between mr-6">
              <DialogTitle className="text-white">Conectar {selectedBank?.name}</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10" 
                onClick={() => setIsHelpDialogOpen(true)}
                title="Como configurar?"
              >
                <InfoIcon className="h-5 w-5" />
              </Button>
            </div>
            <DialogDescription className="text-gray-400 mt-2">
              Insira as credenciais geradas no painel do banco. Elas serão criptografadas e não ficarão expostas em nosso banco de dados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Client ID</label>
              <Input
                placeholder="Insira o Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="border-white/10 bg-[#222]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Client Secret (Token Temporário)</label>
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
                <label className="text-sm font-medium text-white">Chave Pública (Opcional - mTLS)</label>
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
                <label className="text-sm font-medium text-white">URL do Webhook (Seu Endpoint)</label>
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
                <label className="text-sm font-medium text-white">PicPay Seller Token (x-seller-token)</label>
                <Input
                  placeholder="Insira o Seller Token"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="border-white/10 bg-[#222]"
                />
              </div>
            )}
            {selectedBank?.provider === "MERCADO_PAGO" && (
              <p className="text-xs text-blue-400 bg-blue-400/10 p-2 rounded border border-blue-400/20">
                Para o Mercado Pago, o "Client.Secret" equivale ao seu "Access Token" de Produção (APP_USR-...). O Client ID pode ser a sua Chave Pública (APP_USR-...).
              </p>
            )}
            {selectedBank?.provider === "BRADESCO" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Certificado .PEM (Chave Privada)</label>
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
              {isLoading ? "Salvando..." : "Salvar Segurança"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="border-white/10 bg-[#1A1A1A] sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-white">Como configurar {selectedBank?.name}?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Siga os passos abaixo para encontrar suas credenciais do parceiro.
            </DialogDescription>
          </DialogHeader>

          {selectedBank && (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-4 text-sm text-gray-300 flex flex-col gap-3 my-2">
              <ul className="list-decimal list-inside space-y-2">
                {getBankHelpInstructions(selectedBank.provider).steps.map((step, i) => (
                  <li key={i} className="leading-snug">{step}</li>
                ))}
              </ul>
              {getBankHelpInstructions(selectedBank.provider).link && (
                <a 
                  href={getBankHelpInstructions(selectedBank.provider).link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-white hover:text-gray-300 hover:underline font-bold mt-2 pb-1"
                >
                  Acessar Documentação da API <ExternalLinkIcon className="ml-1 h-4 w-4" />
                </a>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsHelpDialogOpen(false)}>
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsManager;
