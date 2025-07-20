import { useState } from "react"
import { 
  Home, 
  Church,
  Users, 
  UserPlus, 
  MapPin, 
  Settings, 
  BarChart3,
  User,
  Building,
  Shield,
  Activity
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Mock user type - in real app this would come from authentication context
const userType = {
  FL_ADM_GERAL: '1',
  FL_ADM_GCS: '1', 
  FL_LIDER_GC: '1'
}

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    showFor: () => true
  },
  {
    title: "Cadastros",
    items: [
      { 
        title: "Igrejas", 
        url: "/igrejas", 
        icon: Church,
        showFor: () => userType.FL_ADM_GERAL === '1'
      },
      { 
        title: "Grupos de Crescimento", 
        url: "/grupos", 
        icon: Users,
        showFor: () => userType.FL_ADM_GCS === '1'
      },
      { 
        title: "Membros", 
        url: "/membros", 
        icon: UserPlus,
        showFor: () => userType.FL_LIDER_GC === '1'
      },
      { 
        title: "Cidades", 
        url: "/cidades", 
        icon: MapPin,
        showFor: () => userType.FL_ADM_GERAL === '1'
      },
      { 
        title: "Estados", 
        url: "/estados", 
        icon: Building,
        showFor: () => userType.FL_ADM_GERAL === '1'
      },
      { 
        title: "Tipos de Usuário", 
        url: "/tipos-usuario", 
        icon: Shield,
        showFor: () => userType.FL_ADM_GERAL === '1'
      },
      { 
        title: "Situações", 
        url: "/situacoes", 
        icon: Activity,
        showFor: () => userType.FL_ADM_GERAL === '1'
      }
    ]
  },
  {
    title: "Relatórios", 
    items: [
      { 
        title: "Membros por Grupo", 
        url: "/relatorios/membros-grupo", 
        icon: BarChart3,
        showFor: () => true
      }
    ]
  },
  { 
    title: "Perfil", 
    url: "/perfil", 
    icon: User,
    showFor: () => true
  }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary" : "hover:bg-sidebar-accent/50"

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-warm p-2 rounded-lg">
            <Church className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sidebar-foreground">SGI</h2>
              <p className="text-xs text-sidebar-foreground/70">Sistema de Gestão</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {menuItems.map((section, sectionIndex) => {
          if (section.items) {
            // This is a group with sub-items
            const visibleItems = section.items.filter(item => item.showFor())
            if (visibleItems.length === 0) return null

            return (
              <SidebarGroup key={sectionIndex}>
                {!collapsed && (
                  <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider">
                    {section.title}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavCls}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          } else {
            // This is a single item
            if (!section.showFor()) return null

            return (
              <SidebarGroup key={sectionIndex}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to={section.url} className={getNavCls}>
                          <section.icon className="h-4 w-4" />
                          {!collapsed && <span>{section.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          }
        })}
      </SidebarContent>
    </Sidebar>
  )
}