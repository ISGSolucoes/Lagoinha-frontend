import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Search, Edit, Trash2, Calendar, User, Church, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SituationService } from "../services/optionsService"

const API_URL = "http://localhost:3001/api"

interface Situacao {
  CD_SITUACAO: number
  NOME: string
}

interface IgrejaOption {
  ID: number
  LABEL: string
  CD_CIDADE?: number
  LOCALIZACAO?: string
}

interface GrowthGroupApi {
  CD_SUPERVISAO: number
  NOME_SUPERVISAO: string
  CD_GC: number
  NOME: string
  DESCRICAO?: string | null
  ENDERECO?: string | null
  NRO?: string | null
  BAIRRO?: string | null
  REGIAO?: string | null
  CD_CIDADE?: number | null
  CEP?: string | null
  CD_SITUACAO?: number | null
  CD_LIDER?: number | null
  NOME_LIDER?: string | null
  CD_COLIDER?: number | null
  NOME_COLIDER?: string | null
  EMAIL?: string | null
  DT_REUNIAO?: string | null
}

interface FormDataState {
  cd_gc: number | null
  nome: string
  descricao: string
  cd_igreja: string
  cd_lider: string
  cd_colider: string
  dataReuniao: string
  horarioReuniao: string
  localReuniao: string
  cd_situacao: string
}

const initialFormData: FormDataState = {
  cd_gc: null,
  nome: "",
  descricao: "",
  cd_igreja: "",
  cd_lider: "",
  cd_colider: "",
  dataReuniao: "",
  horarioReuniao: "",
  localReuniao: "",
  cd_situacao: "",
}

function splitDateTime(dateTime: string | null | undefined) {
  if (!dateTime) return { data: "", hora: "" }

  const date = new Date(dateTime)
  if (Number.isNaN(date.getTime())) return { data: "", hora: "" }

  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, "0")
  const dia = String(date.getDate()).padStart(2, "0")
  const hora = String(date.getHours()).padStart(2, "0")
  const minuto = String(date.getMinutes()).padStart(2, "0")

  return { data: `${ano}-${mes}-${dia}`, hora: `${hora}:${minuto}` }
}

function buildDateTime(data: string, hora: string) {
  if (!data) return null
  const horaFinal = hora && hora.trim() !== "" ? hora : "00:00"
  return `${data}T${horaFinal}:00`
}

export default function Grupos() {
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [grupos, setGrupos] = useState<GrowthGroupApi[]>([])
  const [igrejas, setIgrejas] = useState<IgrejaOption[]>([])
  const [situacoes, setSituacoes] = useState<Situacao[]>([])

  const [formData, setFormData] = useState<FormDataState>(initialFormData)

  const updateFormData = (field: keyof FormDataState, value: string | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === null ? "" : String(value),
    }))
  }

  const resetForm = () => setFormData(initialFormData)

  const fetchIgrejas = async () => {
    const response = await fetch(`${API_URL}/church`)
    if (!response.ok) throw new Error("Não foi possível carregar as igrejas")
    const data = await response.json()
    setIgrejas(Array.isArray(data) ? data : [])
  }

  const fetchSituacoes = async () => {
    const response = await SituationService.getSituations()
    const situacoesArray = response.data
    setSituacoes(Array.isArray(situacoesArray) ? situacoesArray : [])
  }

  const fetchGrupos = async () => {
    const response = await fetch(`${API_URL}/growthGroup`)
    if (!response.ok) throw new Error("Não foi possível carregar os grupos")
    const data = await response.json()
    setGrupos(Array.isArray(data) ? data : [])
  }

  const loadPage = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchGrupos(), fetchIgrejas(), fetchSituacoes()])
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a tela de grupos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage()
  }, [])

  const getIgrejaLabel = (grupo: GrowthGroupApi) => {
    if (grupo.NOME_SUPERVISAO) return grupo.NOME_SUPERVISAO
    const igreja = igrejas.find((item) => Number(item.ID) === Number(grupo.CD_SUPERVISAO))
    return igreja?.LABEL || `Igreja #${grupo.CD_SUPERVISAO ?? "-"}`
  }

  const getSituacaoLabel = (cdSituacao?: number | null) => {
    const situacao = situacoes.find((item) => Number(item.CD_SITUACAO) === Number(cdSituacao))
    return situacao?.NOME || "Não informado"
  }

  const filteredGrupos = useMemo(() => {
    return grupos.filter((grupo) => {
      const termo = searchTerm.toLowerCase()
      return (
        String(grupo.NOME || "").toLowerCase().includes(termo) ||
        String(grupo.DESCRICAO || "").toLowerCase().includes(termo) ||
        String(grupo.NOME_SUPERVISAO || "").toLowerCase().includes(termo) ||
        String(grupo.NOME_LIDER || "").toLowerCase().includes(termo)
      )
    })
  }, [grupos, searchTerm])

  // ✅ Stats reais (sem “0 membros” fake)
  const totalGrupos = grupos.length
  const totalComLider = grupos.filter((g) => !!g.CD_LIDER).length
  const totalComColider = grupos.filter((g) => !!g.CD_COLIDER).length

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
  }

  const handleNovo = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = async (id: number) => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/growthGroup/${id}`)
      if (!response.ok) throw new Error("Não foi possível buscar o grupo por id")

      const grupo: GrowthGroupApi = await response.json()
      if (!grupo || !grupo.CD_GC) throw new Error("Grupo não encontrado")

      const { data, hora } = splitDateTime(grupo.DT_REUNIAO)

      setFormData({
        cd_gc: grupo.CD_GC,
        nome: grupo.NOME || "",
        descricao: grupo.DESCRICAO || "",
        cd_igreja: grupo.CD_SUPERVISAO ? String(grupo.CD_SUPERVISAO) : "",
        cd_lider: grupo.CD_LIDER ? String(grupo.CD_LIDER) : "",
        cd_colider: grupo.CD_COLIDER ? String(grupo.CD_COLIDER) : "",
        dataReuniao: data,
        horarioReuniao: hora,
        localReuniao: grupo.ENDERECO || "",
        cd_situacao: grupo.CD_SITUACAO ? String(grupo.CD_SITUACAO) : "",
      })

      setIsDialogOpen(true)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do grupo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmar = window.confirm("Deseja realmente inativar este GC?")
    if (!confirmar) return

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/growthGroup/${id}`, { method: "DELETE" })
      const json = await response.json()

      if (!response.ok || json?.success === false) {
        throw new Error(json?.erro || json?.error || "Não foi possível inativar o GC")
      }

      toast({
        title: "GC inativado com sucesso!",
        description: "O grupo foi inativado no sistema.",
      })

      await fetchGrupos()
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível inativar o GC.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast({ title: "Validação", description: "O nome do grupo é obrigatório.", variant: "destructive" })
      return
    }
    if (!formData.cd_igreja) {
      toast({ title: "Validação", description: "Selecione a igreja.", variant: "destructive" })
      return
    }
    if (!formData.cd_situacao) {
      toast({ title: "Validação", description: "Selecione a situação.", variant: "destructive" })
      return
    }

    const igrejaSelecionada = igrejas.find((item) => Number(item.ID) === Number(formData.cd_igreja))
    if (!igrejaSelecionada?.CD_CIDADE) {
      toast({ title: "Validação", description: "A igreja selecionada não possui cidade vinculada.", variant: "destructive" })
      return
    }

    try {
      setSaving(true)

      const payload = {
        CD_IGREJA: Number(formData.cd_igreja),
        NOME: formData.nome.trim(),
        DESCRICAO: formData.descricao.trim() || null,
        ENDERECO: formData.localReuniao.trim() || null,
        NRO: null,
        BAIRRO: null,
        CD_CIDADE: Number(igrejaSelecionada.CD_CIDADE),
        CEP: null,
        CD_SITUACAO: Number(formData.cd_situacao),
        CD_LIDER: formData.cd_lider ? Number(formData.cd_lider) : null,
        EMAIL: null,
        DT_REUNIAO: buildDateTime(formData.dataReuniao, formData.horarioReuniao),
        CD_COLIDER: formData.cd_colider ? Number(formData.cd_colider) : null,
      }

      const isEditing = !!formData.cd_gc
      const url = isEditing ? `${API_URL}/growthGroup/${formData.cd_gc}` : `${API_URL}/growthGroup`
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await response.json()

      if (!response.ok || json?.success === false) {
        throw new Error(json?.erro || json?.error || "Não foi possível salvar o GC")
      }

      toast({
        title: isEditing ? "Grupo atualizado com sucesso!" : "Grupo cadastrado com sucesso!",
        description: isEditing ? "As informações do grupo foram atualizadas." : "O grupo foi adicionado ao sistema.",
      })

      setIsDialogOpen(false)
      resetForm()
      await fetchGrupos()
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível salvar o GC.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grupos de Crescimento</h1>
          <p className="text-muted-foreground">Gerencie os grupos de crescimento das igrejas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90 transition-opacity" onClick={handleNovo}>
              <Plus className="h-4 w-4 mr-2" />
              Novo GC
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formData.cd_gc ? "Editar Grupo de Crescimento" : "Cadastrar Novo Grupo de Crescimento"}
              </DialogTitle>
              <DialogDescription>Preencha os dados do grupo de crescimento.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Grupo</Label>
                  <Input id="nome" value={formData.nome} onChange={(e) => updateFormData("nome", e.target.value)} placeholder="Ex: GC Juventude" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" value={formData.descricao} onChange={(e) => updateFormData("descricao", e.target.value)} placeholder="Descrição do grupo" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="igreja">Igreja</Label>
                    <Select value={formData.cd_igreja} onValueChange={(value) => updateFormData("cd_igreja", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a igreja" />
                      </SelectTrigger>
                      <SelectContent>
                        {igrejas.map((igreja) => (
                          <SelectItem key={igreja.ID} value={String(igreja.ID)}>
                            {igreja.LABEL}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cd_lider">Líder (código)</Label>
                    <Input id="cd_lider" value={formData.cd_lider} onChange={(e) => updateFormData("cd_lider", e.target.value)} placeholder="Ex: 10" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataReuniao">Dia da Reunião</Label>
                    <Input id="dataReuniao" type="date" value={formData.dataReuniao} onChange={(e) => updateFormData("dataReuniao", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horarioReuniao">Horário</Label>
                    <Input id="horarioReuniao" type="time" value={formData.horarioReuniao} onChange={(e) => updateFormData("horarioReuniao", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localReuniao">Local da Reunião</Label>
                  <Input id="localReuniao" value={formData.localReuniao} onChange={(e) => updateFormData("localReuniao", e.target.value)} placeholder="Ex: Sala 1 - Igreja Central" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cd_colider">Co-líder (código)</Label>
                    <Input id="cd_colider" value={formData.cd_colider} onChange={(e) => updateFormData("cd_colider", e.target.value)} placeholder="Ex: 20" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situacao">Situação</Label>
                    <Select value={formData.cd_situacao} onValueChange={(value) => updateFormData("cd_situacao", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a situação" />
                      </SelectTrigger>
                      <SelectContent>
                        {situacoes.map((situacao) => (
                          <SelectItem key={situacao.CD_SITUACAO} value={String(situacao.CD_SITUACAO)}>
                            {situacao.NOME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-gradient-warm hover:opacity-90 transition-opacity" disabled={saving}>
                  {saving ? "Salvando..." : formData.cd_gc ? "Salvar Alterações" : "Cadastrar Grupo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar grupos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalGrupos}</p>
                <p className="text-muted-foreground text-sm">Total de Grupos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalComLider}</p>
                <p className="text-muted-foreground text-sm">Com Líder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Church className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalComColider}</p>
                <p className="text-muted-foreground text-sm">Com Co-líder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Grupos de Crescimento
          </CardTitle>
          <CardDescription>Lista de todos os grupos de crescimento cadastrados</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Carregando grupos...</div>
          ) : (
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Igreja</TableHead>
                    <TableHead>Líder</TableHead>
                    <TableHead>Reunião</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrupos.map((grupo) => (
                    <TableRow key={grupo.CD_GC}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{grupo.NOME}</div>
                          <div className="text-sm text-muted-foreground">{grupo.DESCRICAO || "Sem descrição"}</div>
                        </div>
                      </TableCell>

                      <TableCell>{getIgrejaLabel(grupo)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{grupo.NOME_LIDER || (grupo.CD_LIDER ? `Código ${grupo.CD_LIDER}` : "Não informado")}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {grupo.DT_REUNIAO ? new Date(grupo.DT_REUNIAO).toLocaleString("pt-BR") : "Não informado"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{grupo.ENDERECO || "Local não informado"}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{grupo.REGIAO || "Não informado"}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge>{getSituacaoLabel(grupo.CD_SITUACAO)}</Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(grupo.CD_GC)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(grupo.CD_GC)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredGrupos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Nenhum grupo encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}