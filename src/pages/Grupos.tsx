import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Search, Edit, Trash2, Calendar, User, Church } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Grupos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    igreja: "",
    lider: "",
    diaReuniao: "",
    horarioReuniao: "",
    localReuniao: "",
    situacao: ""
  })

  const { toast } = useToast()

  // Mock data
  const grupos = [
    {
      id: 1,
      nome: "GC Juventude",
      descricao: "Grupo de crescimento para jovens de 18 a 30 anos",
      igreja: "Igreja Central",
      lider: "João Silva",
      diaReuniao: "Sábado",
      horarioReuniao: "19:00",
      localReuniao: "Sala 1 - Igreja Central",
      membros: 15,
      situacao: "Ativo"
    },
    {
      id: 2,
      nome: "GC Casais",
      descricao: "Grupo para casais em busca de crescimento espiritual",
      igreja: "Igreja Norte",
      lider: "Maria Santos",
      diaReuniao: "Domingo",
      horarioReuniao: "17:00",
      localReuniao: "Casa da Família Santos",
      membros: 8,
      situacao: "Ativo"
    },
    {
      id: 3,
      nome: "GC Empresários",
      descricao: "Grupo focado em princípios cristãos nos negócios",
      igreja: "Igreja Central",
      lider: "Pedro Oliveira",
      diaReuniao: "Quinta-feira",
      horarioReuniao: "18:30",
      localReuniao: "Escritório Central",
      membros: 12,
      situacao: "Ativo"
    }
  ]

  const igrejas = [
    { value: "igreja-central", label: "Igreja Central" },
    { value: "igreja-norte", label: "Igreja Norte" },
    { value: "igreja-sul", label: "Igreja Sul" }
  ]

  const lideres = [
    { value: "joao-silva", label: "João Silva" },
    { value: "maria-santos", label: "Maria Santos" },
    { value: "pedro-oliveira", label: "Pedro Oliveira" }
  ]

  const diasSemana = [
    { value: "domingo", label: "Domingo" },
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" }
  ]

  const situacoes = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
    { value: "pausado", label: "Pausado" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Grupo de crescimento cadastrado!",
      description: "O grupo foi adicionado ao sistema com sucesso.",
    })
    setIsDialogOpen(false)
    // Reset form
    setFormData({
      nome: "",
      descricao: "",
      igreja: "",
      lider: "",
      diaReuniao: "",
      horarioReuniao: "",
      localReuniao: "",
      situacao: ""
    })
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const filteredGrupos = grupos.filter(grupo => 
    grupo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.igreja.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.lider.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grupos de Crescimento</h1>
          <p className="text-muted-foreground">Gerencie os grupos de crescimento das igrejas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Grupo de Crescimento</DialogTitle>
              <DialogDescription>
                Preencha os dados do grupo de crescimento que será cadastrado.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Grupo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => updateFormData("nome", e.target.value)}
                    placeholder="Ex: GC Juventude"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => updateFormData("descricao", e.target.value)}
                    placeholder="Descrição do grupo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="igreja">Igreja</Label>
                    <Select onValueChange={(value) => updateFormData("igreja", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a igreja" />
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
                    <Label htmlFor="lider">Líder</Label>
                    <Select onValueChange={(value) => updateFormData("lider", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o líder" />
                      </SelectTrigger>
                      <SelectContent>
                        {lideres.map((lider) => (
                          <SelectItem key={lider.value} value={lider.value}>
                            {lider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diaReuniao">Dia da Reunião</Label>
                    <Select onValueChange={(value) => updateFormData("diaReuniao", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map((dia) => (
                          <SelectItem key={dia.value} value={dia.value}>
                            {dia.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horarioReuniao">Horário</Label>
                    <Input
                      id="horarioReuniao"
                      type="time"
                      value={formData.horarioReuniao}
                      onChange={(e) => updateFormData("horarioReuniao", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localReuniao">Local da Reunião</Label>
                  <Input
                    id="localReuniao"
                    value={formData.localReuniao}
                    onChange={(e) => updateFormData("localReuniao", e.target.value)}
                    placeholder="Ex: Sala 1 - Igreja Central"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situacao">Situação</Label>
                  <Select onValueChange={(value) => updateFormData("situacao", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      {situacoes.map((situacao) => (
                        <SelectItem key={situacao.value} value={situacao.value}>
                          {situacao.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-warm hover:opacity-90 transition-opacity">
                  Cadastrar Grupo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{grupos.length}</p>
                <p className="text-muted-foreground text-sm">Grupos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{grupos.reduce((acc, grupo) => acc + grupo.membros, 0)}</p>
                <p className="text-muted-foreground text-sm">Total de Membros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Church className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{Math.round(grupos.reduce((acc, grupo) => acc + grupo.membros, 0) / grupos.length)}</p>
                <p className="text-muted-foreground text-sm">Média por Grupo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Grupos de Crescimento
          </CardTitle>
          <CardDescription>
            Lista de todos os grupos de crescimento cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Igreja</TableHead>
                <TableHead>Líder</TableHead>
                <TableHead>Reunião</TableHead>
                <TableHead>Membros</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrupos.map((grupo) => (
                <TableRow key={grupo.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{grupo.nome}</div>
                      <div className="text-sm text-muted-foreground">{grupo.descricao}</div>
                    </div>
                  </TableCell>
                  <TableCell>{grupo.igreja}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    {grupo.lider}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{grupo.diaReuniao} {grupo.horarioReuniao}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{grupo.localReuniao}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10">
                      {grupo.membros}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={grupo.situacao === "Ativo" ? "default" : "secondary"}>
                      {grupo.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}