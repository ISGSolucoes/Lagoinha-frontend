import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { Bell, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type StoredUser = {
  CD_USUARIO?: number | string
  NOME?: string
  EMAIL?: string
  cd_usuario?: number | string
  nome?: string
  email?: string
}

function safeParseUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user")
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getUserName(u: StoredUser | null) {
  return (u?.NOME || u?.nome || "Usuário").trim()
}

function getUserEmail(u: StoredUser | null) {
  return (u?.EMAIL || u?.email || "").trim()
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  const first = parts[0]?.[0] ?? "U"
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
  return (first + last).toUpperCase()
}

export default function DashboardLayout() {
  const navigate = useNavigate()

  const user = safeParseUser()
  const name = getUserName(user)
  const email = getUserEmail(user)
  const initials = getInitials(name)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="h-full px-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                <div className="hidden md:flex">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      className="w-64 pl-10 bg-background/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 ml-4 rounded-md px-2 py-1 hover:bg-muted/50">
                      <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {initials}
                        </span>
                      </div>
                      <div className="hidden md:block text-sm text-left">
                        <p className="font-medium leading-4">{name}</p>
                        <p className="text-muted-foreground text-xs leading-4">
                          {email || "sem email"}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
