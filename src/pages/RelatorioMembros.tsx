import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Filter, Church, Users, FileText, PieChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RelatorioMembros() {
  const [filtroIgreja, setFiltroIgreja] = useState("")
  const [filtroGrupo, setFiltroGrupo] = useState("")
  const { toast } = useToast()

  // Mock data
  const igrejas = [
    { value: "todas", label: "Todas as Igrejas" },
    { value: "igreja-central", label: "Igreja Central" },
    { value: "igreja-norte", label: "Igreja Norte" },
    { value: "igreja-sul", label: "Igreja Sul" }
  ]

  const grupos = [
    { value: "todos", label: "Todos os Grupos" },
    { value: "gc-juventude", label: "GC Juventude" },
    { value: "gc-casais", label: "GC Casais" },
    { value: "gc-empresarios", label: "GC Empresários" }
  ]

  const dadosRelatorio = [
    {
      igreja: "Igreja Central",
      grupo: "GC Juventude",
      lider: "João Silva",
      totalMembros: 15,
      ativosMes: 12,
      visitantesMes: 2,
      crescimento: "+3"
    },
    {
      igreja: "Igreja Central", 
      grupo: "GC Empresários",
      lider: "Pedro Oliveira",
      totalMembros: 12,
      ativosMes: 10,
      visitantesMes: 1,
      crescimento: "+2"
    },
    {
      igreja: "Igreja Norte",
      grupo: "GC Casais", 
      lider: "Maria Santos",
      totalMembros: 8,
      ativosMes: 7,
      visitantesMes: 1,
      crescimento: "+1"
    }
  ]

  const resumoGeral = {
    totalIgrejas: 3,
    totalGrupos: 3,
    totalMembros: 35,
    crescimentoMes: 6,
    mediaMembrosPorGrupo: Math.round(35 / 3)
  }

  const handleExportPDF = () => {
    toast({
      title: "Exportando relatório",
      description: "O PDF será baixado em instantes.",
    })
    // Aqui seria implementada a exportação real
  }

  const handleExportExcel = () => {
    toast({
      title: "Exportando relatório",
      description: "O Excel será baixado em instantes.",
    })
    // Aqui seria implementada a exportação real
  }

  // Simular filtros aplicados
  const dadosFiltrados = dadosRelatorio.filter(item => {
    if (filtroIgreja && filtroIgreja !== "todas" && !item.igreja.toLowerCase().includes(filtroIgreja)) {
      return false
    }
    if (filtroGrupo && filtroGrupo !== "todos" && !item.grupo.toLowerCase().includes(filtroGrupo)) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatório de Membros por Grupo</h1>
          <p className="text-muted-foreground">Acompanhe o crescimento e distribuição dos membros</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportPDF} 
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button 
            onClick={handleExportExcel}
            className="bg-gradient-warm hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </CardTitle>
          <CardDescription>
            Selecione os filtros para personalizar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Igreja</label>
              <Select value={filtroIgreja} onValueChange={setFiltroIgreja}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma igreja" />
                </SelectTrigger>
                <SelectContent>
                  {igrejas.map((igreja) => (
                    <SelectItem key={igreja.value} value={igreja.value}>
                      {igreja.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grupo de Crescimento</label>
              <Select value={filtroGrupo} onValueChange={setFiltroGrupo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  {grupos.map((grupo) => (
                    <SelectItem key={grupo.value} value={grupo.value}>
                      {grupo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Church className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{resumoGeral.totalIgrejas}</p>
                <p className="text-muted-foreground text-sm">Igrejas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{resumoGeral.totalGrupos}</p>
                <p className="text-muted-foreground text-sm">Grupos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PieChart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{resumoGeral.totalMembros}</p>
                <p className="text-muted-foreground text-sm">Total Membros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{resumoGeral.mediaMembrosPorGrupo}</p>
                <p className="text-muted-foreground text-sm">Média/Grupo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50 bg-gradient-warm/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="text-primary text-2xl font-bold">+{resumoGeral.crescimentoMes}</div>
              <div>
                <p className="text-primary text-sm font-medium">Crescimento</p>
                <p className="text-muted-foreground text-xs">Este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Area - Visual representation */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Distribuição de Membros por Grupo
          </CardTitle>
          <CardDescription>
            Visualização gráfica da distribuição de membros nos grupos de crescimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dadosFiltrados.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.grupo}</span>
                    <span className="text-muted-foreground text-sm ml-2">({item.igreja})</span>
                  </div>
                  <span className="font-bold">{item.totalMembros} membros</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-warm h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(item.totalMembros / resumoGeral.totalMembros) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Detalhamento por Grupo de Crescimento
          </CardTitle>
          <CardDescription>
            Informações detalhadas de cada grupo de crescimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Igreja</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Líder</TableHead>
                <TableHead>Total Membros</TableHead>
                <TableHead>Ativos (Mês)</TableHead>
                <TableHead>Visitantes (Mês)</TableHead>
                <TableHead>Crescimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosFiltrados.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.igreja}</TableCell>
                  <TableCell className="font-medium">{item.grupo}</TableCell>
                  <TableCell>{item.lider}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10">
                      {item.totalMembros}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.ativosMes}</TableCell>
                  <TableCell>{item.visitantesMes}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      {item.crescimento}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Analysis */}
      <Card className="shadow-soft border-border/50 bg-gradient-warm/5">
        <CardHeader>
          <CardTitle className="text-primary">Análise do Período</CardTitle>
          <CardDescription>
            Insights baseados nos dados do relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Destaques Positivos:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• GC Juventude teve o maior crescimento (+3 membros)</li>
                <li>• Taxa de visitantes em alta (4 novos visitantes)</li>
                <li>• 100% dos grupos mantiveram atividade regular</li>
                <li>• Igreja Central apresenta maior número de grupos ativos</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Oportunidades de Melhoria:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Igreja Sul precisa de novos grupos de crescimento</li>
                <li>• Foco em conversão de visitantes em membros</li>
                <li>• Capacitação de novos líderes para expansão</li>
                <li>• Estratégias para grupos menores crescerem</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}