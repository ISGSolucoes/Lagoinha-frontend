import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, Users, UserPlus, BarChart3, TrendingUp, Calendar } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total de Igrejas",
      value: "12",
      description: "Igrejas cadastradas",
      icon: Church,
      trend: "+2 este mês"
    },
    {
      title: "Grupos de Crescimento",
      value: "45",
      description: "GCs ativos",
      icon: Users,
      trend: "+5 novos grupos"
    },
    {
      title: "Membros Cadastrados",
      value: "1,234",
      description: "Membros totais",
      icon: UserPlus,
      trend: "+89 este mês"
    },
    {
      title: "Taxa de Crescimento",
      value: "7.2%",
      description: "Crescimento mensal",
      icon: TrendingUp,
      trend: "↗️ 2.1% vs mês anterior"
    }
  ]

  const recentActivities = [
    { action: "Nova igreja cadastrada", details: "Igreja do Vale", time: "2 horas atrás" },
    { action: "Grupo de crescimento criado", details: "GC Juventude - Igreja Central", time: "5 horas atrás" },
    { action: "15 novos membros", details: "Cadastrados na Igreja Norte", time: "1 dia atrás" },
    { action: "Relatório gerado", details: "Membros por GC - Janeiro", time: "2 dias atrás" }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao Sistema de Gestão de Igrejas e Grupos de Crescimento
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-soft border-border/50 hover:shadow-glow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-primary mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-lg bg-gradient-warm/10 border border-primary/20 cursor-pointer hover:bg-gradient-warm/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Church className="h-4 w-4 text-primary" />
                  <span className="font-medium">Cadastrar Igreja</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-warm/10 border border-primary/20 cursor-pointer hover:bg-gradient-warm/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Novo Grupo de Crescimento</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-warm/10 border border-primary/20 cursor-pointer hover:bg-gradient-warm/20 transition-colors">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <span className="font-medium">Cadastrar Membro</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-warm/10 border border-primary/20 cursor-pointer hover:bg-gradient-warm/20 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Gerar Relatório</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}