import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, X, Users, Clock, Save } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ListaPresenca() {
  const [selectedGrupo, setSelectedGrupo] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [presencas, setPresencas] = useState<Record<number, boolean>>({})
  const { toast } = useToast()

  const grupos = [
    { value: "gc-juventude", label: "GC Juventude" },
    { value: "gc-casais", label: "GC Casais" },
    { value: "gc-empresarios", label: "GC Empresários" },
    { value: "gc-mulheres", label: "GC Mulheres" },
    { value: "gc-homens", label: "GC Homens" }
  ]

  // Mock data - membros por grupo
  const membrosPorGrupo = {
    "gc-juventude": [
      { id: 1, nome: "Ana Silva", situacao: "Ativo" },
      { id: 2, nome: "Pedro Santos", situacao: "Ativo" },
      { id: 3, nome: "Maria Oliveira", situacao: "Ativo" },
      { id: 4, nome: "João Costa", situacao: "Ativo" },
      { id: 5, nome: "Carla Lima", situacao: "Ativo" }
    ],
    "gc-casais": [
      { id: 6, nome: "Roberto e Ana", situacao: "Ativo" },
      { id: 7, nome: "Carlos e Maria", situacao: "Ativo" },
      { id: 8, nome: "José e Paula", situacao: "Ativo" }
    ],
    "gc-empresarios": [
      { id: 9, nome: "Fernando Silva", situacao: "Ativo" },
      { id: 10, nome: "Ricardo Santos", situacao: "Ativo" }
    ],
    "gc-mulheres": [
      { id: 11, nome: "Sandra Lima", situacao: "Ativo" },
      { id: 12, nome: "Lucia Costa", situacao: "Ativo" },
      { id: 13, nome: "Isabel Ferreira", situacao: "Ativo" }
    ],
    "gc-homens": [
      { id: 14, nome: "Marcos Silva", situacao: "Ativo" },
      { id: 15, nome: "Paulo Oliveira", situacao: "Ativo" }
    ]
  }

  const membrosAtivos = selectedGrupo ? membrosPorGrupo[selectedGrupo as keyof typeof membrosPorGrupo] || [] : []

  const togglePresenca = (membroId: number) => {
    setPresencas(prev => ({
      ...prev,
      [membroId]: !prev[membroId]
    }))
  }

  const marcarTodosPresentes = () => {
    const novaspresencas: Record<number, boolean> = {}
    membrosAtivos.forEach(membro => {
      novaspresencas[membro.id] = true
    })
    setPresencas(novaspresencas)
  }

  const marcarTodosAusentes = () => {
    const novaspresencas: Record<number, boolean> = {}
    membrosAtivos.forEach(membro => {
      novaspresencas[membro.id] = false
    })
    setPresencas(novaspresencas)
  }

  const salvarPresencas = async () => {
    try {
      // Aqui você faria a chamada para sua API
      // const response = await fetch('/api/presencas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     grupo: selectedGrupo,
      //     data: selectedDate,
      //     presencas: presencas
      //   })
      // })

      toast({
        title: "Presenças salvas!",
        description: `Lista de presença salva para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}`,
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a lista de presença",
        variant: "destructive"
      })
    }
  }

  const presentes = Object.values(presencas).filter(presente => presente).length
  const ausentes = membrosAtivos.length - presentes

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lista de Presença</h1>
        <p className="text-muted-foreground">Controle a presença dos membros nos grupos de crescimento</p>
      </div>

      {/* Filtros */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configuração da Lista
          </CardTitle>
          <CardDescription>
            Selecione o grupo de crescimento e a data para marcar as presenças
          </CardDescription>
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
              <Label>Data do Encontro</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Membros */}
      {selectedGrupo && (
        <>
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{membrosAtivos.length}</p>
                    <p className="text-muted-foreground text-sm">Total de Membros</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Check className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{presentes}</p>
                    <p className="text-muted-foreground text-sm">Presentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <X className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{ausentes}</p>
                    <p className="text-muted-foreground text-sm">Ausentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {membrosAtivos.length > 0 ? Math.round((presentes / membrosAtivos.length) * 100) : 0}%
                    </p>
                    <p className="text-muted-foreground text-sm">Frequência</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações em Lote */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={marcarTodosPresentes}
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar Todos Presentes
            </Button>
            <Button 
              variant="outline" 
              onClick={marcarTodosAusentes}
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <X className="h-4 w-4 mr-2" />
              Marcar Todos Ausentes
            </Button>
            <Button 
              onClick={salvarPresencas}
              className="bg-gradient-warm hover:opacity-90 transition-opacity"
              disabled={membrosAtivos.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Presenças
            </Button>
          </div>

          {/* Lista de Membros */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>
                {grupos.find(g => g.value === selectedGrupo)?.label} - {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription>
                Clique nos membros para marcar presença ou ausência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membrosAtivos.map((membro) => {
                  const presente = presencas[membro.id] || false
                  return (
                    <div
                      key={membro.id}
                      onClick={() => togglePresenca(membro.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                        presente 
                          ? "border-green-200 bg-green-50 text-green-700" 
                          : "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{membro.nome}</h3>
                          <p className="text-sm opacity-70">{membro.situacao}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {presente ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Presente
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <X className="h-3 w-3 mr-1" />
                              Ausente
                            </Badge>
                          )}
                        </div>
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