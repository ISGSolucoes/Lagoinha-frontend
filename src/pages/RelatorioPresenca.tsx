import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TrendingUp, Users, Clock, FileText, Download } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default function RelatorioPresenca() {
  const [selectedGrupo, setSelectedGrupo] = useState("")
  const [dataInicial, setDataInicial] = useState<Date>(startOfMonth(new Date()))
  const [dataFinal, setDataFinal] = useState<Date>(endOfMonth(new Date()))
  const [showCustomPeriod, setShowCustomPeriod] = useState(false)

  const grupos = [
    { value: "gc-juventude", label: "GC Juventude" },
    { value: "gc-casais", label: "GC Casais" },
    { value: "gc-empresarios", label: "GC Empresários" },
    { value: "gc-mulheres", label: "GC Mulheres" },
    { value: "gc-homens", label: "GC Homens" }
  ]

  // Mock data - presenças históricas
  const presencasHistoricas = {
    "gc-juventude": [
      {
        membro: { id: 1, nome: "Ana Silva" },
        presencas: [
          { data: "2024-01-07", presente: true },
          { data: "2024-01-14", presente: false },
          { data: "2024-01-21", presente: true },
          { data: "2024-01-28", presente: true }
        ]
      },
      {
        membro: { id: 2, nome: "Pedro Santos" },
        presencas: [
          { data: "2024-01-07", presente: true },
          { data: "2024-01-14", presente: true },
          { data: "2024-01-21", presente: false },
          { data: "2024-01-28", presente: true }
        ]
      },
      {
        membro: { id: 3, nome: "Maria Oliveira" },
        presencas: [
          { data: "2024-01-07", presente: false },
          { data: "2024-01-14", presente: true },
          { data: "2024-01-21", presente: true },
          { data: "2024-01-28", presente: true }
        ]
      }
    ]
  }

  const dadosRelatorio = selectedGrupo ? presencasHistoricas[selectedGrupo as keyof typeof presencasHistoricas] || [] : []

  const calcularEstatisticas = () => {
    if (!dadosRelatorio.length) return { totalEncontros: 0, mediaPresenca: 0, membrosAtivos: 0 }

    const totalEncontros = dadosRelatorio[0]?.presencas.length || 0
    const membrosAtivos = dadosRelatorio.length

    let totalPresencas = 0
    dadosRelatorio.forEach(membro => {
      totalPresencas += membro.presencas.filter(p => p.presente).length
    })

    const mediaPresenca = totalEncontros > 0 && membrosAtivos > 0 
      ? Math.round((totalPresencas / (totalEncontros * membrosAtivos)) * 100) 
      : 0

    return { totalEncontros, mediaPresenca, membrosAtivos }
  }

  const calcularFrequenciaMembro = (presencas: any[]) => {
    const presentes = presencas.filter(p => p.presente).length
    return presencas.length > 0 ? Math.round((presentes / presencas.length) * 100) : 0
  }

  const getFrequenciaColor = (frequencia: number) => {
    if (frequencia >= 80) return "bg-green-100 text-green-800"
    if (frequencia >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const exportarRelatorio = () => {
    // Aqui você implementaria a exportação para PDF/Excel
    console.log("Exportando relatório...")
  }

  const stats = calcularEstatisticas()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatório de Presença</h1>
          <p className="text-muted-foreground">Análise detalhada da frequência dos membros</p>
        </div>
        <Button 
          onClick={exportarRelatorio}
          variant="outline"
          disabled={!selectedGrupo}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Grupo de Crescimento</Label>
              <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
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

            <div className="space-y-2">
              <Label>Período</Label>
              <Select 
                value={showCustomPeriod ? "custom" : "current-month"} 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomPeriod(true)
                  } else {
                    setShowCustomPeriod(false)
                    setDataInicial(startOfMonth(new Date()))
                    setDataFinal(endOfMonth(new Date()))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Mês Atual</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showCustomPeriod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dataInicial && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicial ? format(dataInicial, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataInicial}
                      onSelect={(date) => date && setDataInicial(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dataFinal && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFinal ? format(dataFinal, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataFinal}
                      onSelect={(date) => date && setDataFinal(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Gerais */}
      {selectedGrupo && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.membrosAtivos}</p>
                    <p className="text-muted-foreground text-sm">Membros Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalEncontros}</p>
                    <p className="text-muted-foreground text-sm">Total de Encontros</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.mediaPresenca}%</p>
                    <p className="text-muted-foreground text-sm">Média de Presença</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {format(dataInicial, "MMM", { locale: ptBR })}
                    </p>
                    <p className="text-muted-foreground text-sm">Período</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Relatório Detalhado */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>
                {grupos.find(g => g.value === selectedGrupo)?.label} - Relatório Detalhado
              </CardTitle>
              <CardDescription>
                Frequência individual de cada membro no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosRelatorio.map((dadosMembro) => {
                  const frequencia = calcularFrequenciaMembro(dadosMembro.presencas)
                  const presentes = dadosMembro.presencas.filter(p => p.presente).length
                  const total = dadosMembro.presencas.length

                  return (
                    <div key={dadosMembro.membro.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-medium text-lg">{dadosMembro.membro.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              {presentes} de {total} encontros
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge className={getFrequenciaColor(frequencia)}>
                            {frequencia}% de frequência
                          </Badge>
                        </div>
                      </div>

                      {/* Grid de presenças */}
                      <div className="mt-4">
                        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-2">
                          {dadosMembro.presencas.map((presenca, index) => (
                            <div
                              key={index}
                              className={cn(
                                "w-8 h-8 rounded flex items-center justify-center text-xs font-medium",
                                presenca.presente 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              )}
                              title={`${format(new Date(presenca.data), "dd/MM", { locale: ptBR })} - ${presenca.presente ? "Presente" : "Ausente"}`}
                            >
                              {presenca.presente ? "P" : "A"}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          P = Presente | A = Ausente
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}