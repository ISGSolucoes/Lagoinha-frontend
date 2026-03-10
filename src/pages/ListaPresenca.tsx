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
        // Passo A: Busca a lista base de membros cadastrados no GC
        const resMembros = await axios.get(`${API_URL}/attendance/members/1/${selectedGrupo}`);
        const listaMembros: Membro[] = resMembros.data;
        setMembrosAtivos(listaMembros);

        // Passo B: Busca se já existe gravação de frequência para esta data
        const dataFormatada = format(selectedDate, "yyyy-MM-dd");
        const resHistorico = await axios.get(`${API_URL}/attendance/history`, {
          params: { cdIgreja: 1, cdGc: selectedGrupo, data: dataFormatada }
        });

        console.log('Historico', resHistorico.data)

        const historicoNoBanco = resHistorico.data;
        const novoEstadoPresenca: Record<number, boolean> = {};

        if (historicoNoBanco && historicoNoBanco.length > 0) {
          historicoNoBanco.forEach((item: any) => {
            const isPresente = item.FL_PRESENCA?.trim() === 'S';
            novoEstadoPresenca[item.CD_MEMBRO] = isPresente;
          });
        } else {
          // Caso não exista registro no banco, inicializamos todos como AUSENTES (false)
          // O usuário então marcará quem compareceu
          listaMembros.forEach((m) => {
            novoEstadoPresenca[m.ID] = false;
          });
        }

        setPresencas(novoEstadoPresenca);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao sincronizar dados com o servidor",
          variant: "destructive"
        });
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
    membrosAtivos.forEach(m => { novas[m.ID] = true });
    setPresencas(novas)
  }

  const marcarTodosAusentes = () => {
    const novas: Record<number, boolean> = {}
    membrosAtivos.forEach(m => { novas[m.ID] = false });
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
        description: `Lista de presença atualizada para o dia ${format(selectedDate, "dd/MM/yyyy")}.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível gravar os dados no banco Firebird.",
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
              <PopoverContent className="w-auto p-0" align="start">
                <div className="sr-only">
                  <h2>Selecione uma data</h2>
                  <p>Calendário para escolha da data do evento</p>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  locale={ptBR}
                  initialFocus
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
            <Button variant="outline" onClick={marcarTodosPresentes} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <Check className="h-4 w-4 mr-2" /> Marcar Todos Presentes
            </Button>
            <Button variant="outline" onClick={marcarTodosAusentes} className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
              <X className="h-4 w-4 mr-2" /> Marcar Todos Ausentes
            </Button>
            <Button onClick={salvarPresencas} className="bg-primary text-white hover:opacity-90">
              <Save className="h-4 w-4 mr-2" /> Salvar Presenças
            </Button>
          </div>

          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Membros do Grupo</CardTitle>
              <CardDescription>Clique no card do membro para alternar entre presente e ausente</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <Loader2 className="animate-spin h-10 w-10 text-primary" />
                  <p className="text-muted-foreground">Sincronizando com o banco Firebird...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {membrosAtivos.map((membro) => {
                    const presente = presencas[membro.ID] || false;
                    return (
                      <div
                        key={membro.ID}
                        onClick={() => togglePresenca(membro.ID)}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md select-none",
                          presente
                            ? "border-green-200 bg-green-50/50 text-green-700"
                            : "border-red-100 bg-red-50/30 text-red-700 opacity-80"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{membro.NOME}</h3>
                            <p className="text-xs font-medium uppercase tracking-wider opacity-60">{membro.SITUACAO}</p>
                          </div>
                          <Badge className={cn(
                            "shadow-none",
                            presente ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"
                          )}>
                            {presente ? (
                              <><Check className="h-3 w-3 mr-1" /> Presente</>
                            ) : (
                              <><X className="h-3 w-3 mr-1" /> Ausente</>
                            )}
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

function StatCard({ icon, label, value, color = "" }: any) {
  return (
    <Card className="shadow-soft border-border/50">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-secondary/50 rounded-xl">{icon}</div>
        <div>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
          <p className="text-muted-foreground text-xs uppercase tracking-tighter font-semibold">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}