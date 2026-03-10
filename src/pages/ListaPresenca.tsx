import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, X, Users, Clock, Save, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

const API_URL = "http://localhost:3001/api"

// Interfaces para tipagem
interface Membro {
  ID: number;
  NOME: string;
  SITUACAO: string;
}

interface Grupo {
  CD_GC: number;
  NOME: string;
}

export default function ListaPresenca() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [selectedGrupo, setSelectedGrupo] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [membrosAtivos, setMembrosAtivos] = useState<Membro[]>([])
  const [presencas, setPresencas] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // 1. Carregar a lista de Grupos (Select) ao montar a tela
  useEffect(() => {
    async function fetchGrupos() {
      try {
        const response = await axios.get(`${API_URL}/growthGroup`);
        setGrupos(response.data);
      } catch (error) {
        console.error("Erro ao carregar grupos", error);
      }
    }
    fetchGrupos();
  }, []);

  // 2. Carregar Membros e Histórico quando mudar Grupo ou Data
  useEffect(() => {
    async function carregarDados() {
      if (!selectedGrupo) return;

      setLoading(true);
      try {
        // Busca a lista base de membros do GC
        const resMembros = await axios.get(`${API_URL}/attendance/members/1/${selectedGrupo}`);
        setMembrosAtivos(resMembros.data);

        // Busca se já existe gravação para esta data
        const dataFormatada = format(selectedDate, "yyyy-MM-dd");
        const resHistorico = await axios.get(`${API_URL}/attendance/history`, {
          params: { cdIgreja: 1, cdGc: selectedGrupo, data: dataFormatada }
        });

        // Mapeia o que veio do banco para o estado do React
        const novoEstadoPresenca: Record<number, boolean> = {};
        resHistorico.data.forEach((item: any) => {
          novoEstadoPresenca[item.CD_MEMBRO] = item.FL_PRESENCA === 'S';
        });

        setPresencas(novoEstadoPresenca);
      } catch (error) {
        toast({ title: "Erro", description: "Falha ao sincronizar dados", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [selectedGrupo, selectedDate]);

  const togglePresenca = (membroId: number) => {
    setPresencas(prev => ({
      ...prev,
      [membroId]: !prev[membroId]
    }))
  }

  const marcarTodosPresentes = () => {
    const novas: Record<number, boolean> = {}
    membrosAtivos.forEach(m => novas[m.ID] = true)
    setPresencas(novas)
  }

  const marcarTodosAusentes = () => {
    const novas: Record<number, boolean> = {}
    membrosAtivos.forEach(m => novas[m.ID] = false)
    setPresencas(novas)
  }

  const salvarPresencas = async () => {
    try {
      const payload = {
        CD_IGREJA: 1,
        CD_GC: Number(selectedGrupo),
        DT_EVENTO: format(selectedDate, "yyyy-MM-dd HH:mm:ss"),
        PRESENCAS: membrosAtivos.map(m => ({
          CD_MEMBRO: m.ID,
          FL_PRESENCA: presencas[m.ID] ? 'S' : 'N'
        }))
      };

      await axios.post(`${API_URL}/attendance`, payload);

      toast({
        title: "Presenças salvas!",
        description: `Lista atualizada com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        variant: "destructive"
      })
    }
  }

  const presentes = Object.values(presencas).filter(v => v).length
  const ausentes = membrosAtivos.length - presentes

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lista de Presença</h1>
        <p className="text-muted-foreground">Controle a presença dos membros nos grupos de crescimento</p>
      </div>

      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configuração da Lista
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Grupo de Crescimento</Label>
            <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {grupos.map((g) => (
                  <SelectItem key={g.CD_GC} value={g.CD_GC.toString()}>{g.NOME}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data do Encontro</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {selectedGrupo && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon={<Users className="text-primary" />} label="Total" value={membrosAtivos.length} />
            <StatCard icon={<Check className="text-green-500" />} label="Presentes" value={presentes} color="text-green-600" />
            <StatCard icon={<X className="text-red-500" />} label="Ausentes" value={ausentes} color="text-red-600" />
            <StatCard icon={<Clock className="text-blue-500" />} label="Frequência" value={`${membrosAtivos.length > 0 ? Math.round((presentes / membrosAtivos.length) * 100) : 0}%`} color="text-blue-600" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={marcarTodosPresentes} className="bg-green-50 text-green-700 border-green-200">
              <Check className="h-4 w-4 mr-2" /> Marcar Todos Presentes
            </Button>
            <Button variant="outline" onClick={marcarTodosAusentes} className="bg-red-50 text-red-700 border-red-200">
              <X className="h-4 w-4 mr-2" /> Marcar Todos Ausentes
            </Button>
            <Button onClick={salvarPresencas} className="bg-primary text-white">
              <Save className="h-4 w-4 mr-2" /> Salvar Presenças
            </Button>
          </div>

          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Membros do Grupo</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {membrosAtivos.map((membro) => {
                    const presente = presencas[membro.ID] || false;
                    return (
                      <div
                        key={membro.ID}
                        onClick={() => togglePresenca(membro.ID)}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                          presente ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{membro.NOME}</h3>
                            <p className="text-xs opacity-70">{membro.SITUACAO}</p>
                          </div>
                          <Badge className={presente ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {presente ? "Presente" : "Ausente"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// Componente auxiliar para os cards de estatística
function StatCard({ icon, label, value, color = "" }: any) {
  return (
    <Card className="shadow-soft border-border/50">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-2 bg-secondary rounded-full">{icon}</div>
        <div>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}