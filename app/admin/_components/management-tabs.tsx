"use client"

import { useState } from "react"
import { Button } from "@/app/_components/ui/button"
import ServicesTable from "./services-table"
import ProductsTable from "./products-table"
import CombosTable from "./combos-table"
import SettingsForm from "./settings-form"
import { Service, Product, Settings } from "@prisma/client"
import { LayoutDashboardIcon, PackageIcon, ScissorsIcon, StarsIcon, SettingsIcon } from "lucide-react"

interface ManagementTabsProps {
    services: Service[]
    products: Product[]
    combos: (any & { service1: Service; service2: Service })[]
    settings: Settings
    children: React.ReactNode // Dashboard content
}

const ManagementTabs = ({
    services,
    products,
    combos,
    settings,
    children,
}: ManagementTabsProps) => {
    const [activeTab, setActiveTab] = useState<"dashboard" | "services" | "products" | "combos" | "settings">("dashboard")

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden whitespace-nowrap">
                <Button
                    variant={activeTab === "dashboard" ? "default" : "ghost"}
                    onClick={() => setActiveTab("dashboard")}
                    className="gap-2"
                >
                    <LayoutDashboardIcon className="h-4 w-4" />
                    Dashboard
                </Button>
                <Button
                    variant={activeTab === "services" ? "default" : "ghost"}
                    onClick={() => setActiveTab("services")}
                    className="gap-2"
                >
                    <ScissorsIcon className="h-4 w-4" />
                    Serviços
                </Button>
                <Button
                    variant={activeTab === "products" ? "default" : "ghost"}
                    onClick={() => setActiveTab("products")}
                    className="gap-2"
                >
                    <PackageIcon className="h-4 w-4" />
                    Produtos
                </Button>
                <Button
                    variant={activeTab === "combos" ? "default" : "ghost"}
                    onClick={() => setActiveTab("combos")}
                    className="gap-2"
                >
                    <StarsIcon className="h-4 w-4" />
                    Combos
                </Button>
                <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    onClick={() => setActiveTab("settings")}
                    className="gap-2"
                >
                    <SettingsIcon className="h-4 w-4" />
                    Configurações
                </Button>
            </div>

            <div className="mt-2">
                {activeTab === "dashboard" && children}
                {activeTab === "services" && <ServicesTable services={services} />}
                {activeTab === "products" && <ProductsTable products={products} />}
                {activeTab === "combos" && <CombosTable combos={combos} services={services} />}
                {activeTab === "settings" && <SettingsForm settings={settings} />}
            </div>
        </div>
    )
}

export default ManagementTabs
