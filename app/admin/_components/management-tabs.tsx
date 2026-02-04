"use client"

import { useState } from "react"
import { Button } from "@/app/_components/ui/button"
import ServicesTable from "./services-table"
import ProductsTable from "./products-table"
import CombosTable from "./combos-table"
import SettingsForm from "./settings-form"
import { Service, Product, Settings } from "@prisma/client"
import {
  LayoutDashboardIcon,
  PackageIcon,
  ScissorsIcon,
  StarsIcon,
  SettingsIcon,
  ClockIcon,
} from "lucide-react"
import OperatingHoursManager from "./operating-hours-manager"

interface ManagementTabsProps {
  services: Service[]
  products: Product[]
  combos: (any & { service1: Service; service2: Service })[]
  settings: Settings
  operatingDays: any[]
  operatingExceptions: any[]
  children: React.ReactNode // Dashboard content
}

const ManagementTabs = ({
  services,
  products,
  combos,
  settings,
  operatingDays,
  operatingExceptions,
  children,
}: ManagementTabsProps) => {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "services"
    | "products"
    | "combos"
    | "settings"
    | "operating-hours"
  >("dashboard")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-white/10 pb-4 lg:gap-4 [&::-webkit-scrollbar]:hidden">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          onClick={() => setActiveTab("dashboard")}
          className="h-9 px-3 text-xs lg:h-10 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <LayoutDashboardIcon className="mr-2 h-4 w-4 lg:mr-0" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "services" ? "default" : "ghost"}
          onClick={() => setActiveTab("services")}
          className="h-9 px-3 text-xs lg:h-10 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <ScissorsIcon className="mr-2 h-4 w-4 lg:mr-0" />
          Serviços
        </Button>
        <Button
          variant={activeTab === "products" ? "default" : "ghost"}
          onClick={() => setActiveTab("products")}
          className="h-9 px-3 text-xs lg:h-10 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <PackageIcon className="mr-2 h-4 w-4 lg:mr-0" />
          Produtos
        </Button>
        <Button
          variant={activeTab === "combos" ? "default" : "ghost"}
          onClick={() => setActiveTab("combos")}
          className="h-9 px-3 text-xs lg:h-10 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <StarsIcon className="mr-2 h-4 w-4 lg:mr-0" />
          Combos
        </Button>
        <Button
          variant={activeTab === "operating-hours" ? "default" : "ghost"}
          onClick={() => setActiveTab("operating-hours")}
          className="h-9 px-3 text-xs lg:h-10 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <ClockIcon className="mr-2 h-4 w-4 lg:mr-0" />
          Horários
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          onClick={() => setActiveTab("settings")}
          className="h-9 px-3 text-xs lg:h-10 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <SettingsIcon className="mr-2 h-4 w-4 lg:mr-0" />
          Configurações
        </Button>
      </div>

      <div className="mt-2">
        {activeTab === "dashboard" && children}
        {activeTab === "services" && <ServicesTable services={services} />}
        {activeTab === "products" && <ProductsTable products={products} />}
        {activeTab === "combos" && (
          <CombosTable combos={combos} services={services} />
        )}
        {activeTab === "settings" && <SettingsForm settings={settings} />}
        {activeTab === "operating-hours" && (
          <OperatingHoursManager
            operatingDays={operatingDays}
            operatingExceptions={operatingExceptions}
          />
        )}
      </div>
    </div>
  )
}

export default ManagementTabs
