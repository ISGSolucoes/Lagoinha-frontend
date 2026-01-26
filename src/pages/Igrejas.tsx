import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Church, Plus, Search, Edit, Trash2, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { locationsEstadosService, locationsCidadesService, SituationService } from '../services/optionsService'
import igrejaService, { Igreja, IgrejaDTO } from '../services/igrejaService'

interface Estado {
  UF: string;
  NOME: string;
}

interface Cidade {
  CD_CIDADE: number;
  NOME: string;
}

interface Situacao {
  CD_SITUACAO: number;
  NOME: string;
}

export default function Igrejas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState<IgrejaDTO>({
    FANTASIA: "",
    RAZAO_SOCIAL: "",
    CNPJ: "",
    ENDERECO: "",
    CEP: "",
    CD_CIDADE: 0,
    fone: "",
    email: "",
    CD_SITUACAO: 0,
  });

  const { toast } = useToast()
  const [igrejas, setIgrejas] = useState<Igreja[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [situacoes, setSituacoes] = useState<Situacao[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [selectedEstado, setSelectedEstado] = useState("")

  // Buscar todas as igrejas
  const fetchIgrejas = async () => {
    try {
      setLoadingData(true)
      const data = await igrejaService.getIgrejas()
      setIgrejas(data)
    } catch (error: any) {
      console.error('Erro ao buscar igrejas:', error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as supervisões",
        variant: "destructive"
      })
    } finally {
      setLoadingData(false)
    }
  }

  // Buscar estados e situações (mantenha igual)
  const fetchEstados = async () => {
    try {
      const response = await locationsEstadosService.getlocationsEstados()
      setEstados(response.data || [])
    } catch (error: any) {
      console.error('Erro ao buscar estados:', error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os estados",
        variant: "destructive"
      })
    }
  }

  const fetchSituacoes = async () => {
    try {
      const response = await SituationService.getSituations()
      setSituacoes(response.data || [])
    } catch (error: any) {
      console.error('Erro ao buscar situações:', error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as situações",
        variant: "destructive"
      })
    }
  }

  // Handler para quando o estado é selecionado
  const handleEstadoChange = async (value: string) => {
    setSelectedEstado(value)
    setFormData(prev => ({
      ...prev,
      CD_CIDADE: 0
    }))

    try {
      const response = await locationsCidadesService.getlocationsCidades(value)
      setCidades(response.data || [])
    } catch (error: any) {
      console.error('Erro ao buscar cidades:', error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as cidades",
        variant: "destructive"
      })
    }
  }

  // Handler para submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação
    if (!formData.CD_CIDADE || formData.CD_CIDADE === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma cidade",
        variant: "destructive"
      })
      return
    }

    if (!formData.CD_SITUACAO || formData.CD_SITUACAO === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma situação",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      if (isEditMode && currentId) {
        await igrejaService.updateIgreja(currentId, formData)
        toast({
          title: "Supervisão atualizada com sucesso!",
          description: "A supervisão foi atualizada no sistema.",
        })
      } else {
        await igrejaService.createIgreja(formData)
        toast({
          title: "Supervisão cadastrada com sucesso!",
          description: "A supervisão foi adicionada ao sistema.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchIgrejas()

    } catch (error: any) {
      console.error('Erro ao salvar supervisão:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.erro || "Não foi possível salvar a supervisão",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handler para editar
  const handleEdit = async (igreja: Igreja) => {
    try {
      // Buscar detalhes completos da igreja
      const response = await igrejaService.getIgrejaById(igreja.id)
      const igrejaDetalhes = response.data

      console.log('Retorno api 2 response: ', response)

      console.log('Retorno api 2 igreja: ', igreja)

      setIsEditMode(true)
      setCurrentId(igreja.id)

      // Se a igreja tiver estado, buscar cidades
      if (igreja.estado) {
        setSelectedEstado(igreja.estado)
        await handleEstadoChange(igreja.estado)
      }

     
      setFormData({
        FANTASIA: response.FANTASIA || igreja.nomeFantasia,
        RAZAO_SOCIAL: response.RAZAO_SOCIAL || igreja.razaoSocial,
        CNPJ: response.CNPJ || igreja.cnpj,
        ENDERECO: response.ENDERECO || igreja.endereco,
        CEP: response.CEP || igreja.cep,
        CD_CIDADE: response.CD_CIDADE || igreja.cd_cidade,
        fone: response.fone || igreja.telefone,
        email: response.email || igreja.email,
        CD_SITUACAO: response.CD_SITUACAO || 1,
        ESTADO: response.estado || igreja.estado
      })

      setIsDialogOpen(true)
    } catch (error) {
      console.error('Erro ao carregar dados para edição:', error)
      // Se falhar ao buscar detalhes, usar dados básicos
      setIsEditMode(true)
      setCurrentId(igreja.id)
      setFormData({
        FANTASIA: igreja.nomeFantasia,
        RAZAO_SOCIAL: "",
        CNPJ: igreja.cnpj,
        ENDERECO: "",
        CEP: "",
        CD_CIDADE: igreja.cd_cidade,
        fone: igreja.telefone,
        email: igreja.email,
        CD_SITUACAO: igreja.situacao === "Ativa" ? 1 : 2,
      })
      setIsDialogOpen(true)
    }
  }

  // Handler para deletar
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta supervisão?")) {
      return
    }

    try {
      await igrejaService.deleteIgreja(id)
      toast({
        title: "Supervisão excluída com sucesso!",
        description: "A supervisão foi removida do sistema.",
      })
      fetchIgrejas()
    } catch (error: any) {
      console.error('Erro ao excluir supervisão:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.erro || "Não foi possível excluir a supervisão",
        variant: "destructive"
      })
    }
  }

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      FANTASIA: "",
      RAZAO_SOCIAL: "",
      CNPJ: "",
      ENDERECO: "",
      CEP: "",
      CD_CIDADE: 0,
      fone: "",
      email: "",
      CD_SITUACAO: 0,
    })
    setSelectedEstado("")
    setIsEditMode(false)
    setCurrentId(null)
    setCidades([])
  }

  // Handler para quando o dialog é fechado
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  // Inicialização
  useEffect(() => {
    fetchIgrejas()
    fetchEstados()
    fetchSituacoes()
  }, [])

  const updateFormData = (field: keyof IgrejaDTO, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const filteredIgrejas = igrejas.filter(igreja =>
    igreja.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    igreja.cnpj.includes(searchTerm)
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supervisões</h1>
          <p className="text-muted-foreground">Gerencie as supervisões cadastradas no sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-warm hover:opacity-90 transition-opacity"
              onClick={() => setIsEditMode(false)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Supervisão
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Supervisão" : "Cadastrar Nova Supervisão"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Atualize os dados da supervisão selecionada."
                  : "Preencha os dados da supervisão que será cadastrada no sistema."
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="FANTASIA">Nome Fantasia *</Label>
                    <Input
                      id="FANTASIA"
                      value={formData.FANTASIA}
                      onChange={(e) => updateFormData("FANTASIA", e.target.value)}
                      placeholder="Nome fantasia"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="RAZAO_SOCIAL">Razão Social</Label>
                    <Input
                      id="RAZAO_SOCIAL"
                      value={formData.RAZAO_SOCIAL}
                      onChange={(e) => updateFormData("RAZAO_SOCIAL", e.target.value)}
                      placeholder="Razão social (opcional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="CNPJ">CNPJ *</Label>
                    <Input
                      id="CNPJ"
                      value={formData.CNPJ}
                      onChange={(e) => updateFormData("CNPJ", e.target.value)}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="CEP">CEP</Label>
                    <Input
                      id="CEP"
                      value={formData.CEP}
                      onChange={(e) => updateFormData("CEP", e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ENDERECO">Endereço</Label>
                  <Input
                    id="ENDERECO"
                    value={formData.ENDERECO}
                    onChange={(e) => updateFormData("ENDERECO", e.target.value)}
                    placeholder="Rua, número, bairro"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={selectedEstado}
                      onValueChange={handleEstadoChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado.UF} value={estado.UF}>
                            {estado.NOME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="CD_CIDADE">Cidade *</Label>
                    <Select
                      value={formData.CD_CIDADE ? String(formData.CD_CIDADE) : ""}
                      onValueChange={(value) => updateFormData("CD_CIDADE", Number(value))}
                      disabled={!selectedEstado || cidades.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedEstado
                              ? "Selecione primeiro o estado"
                              : cidades.length === 0
                                ? "Carregando cidades..."
                                : "Selecione a cidade"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cidades.map((cidade) => (
                          <SelectItem key={cidade.CD_CIDADE} value={String(cidade.CD_CIDADE)}>
                            {cidade.NOME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fone">Telefone</Label>
                    <Input
                      id="fone"
                      value={formData.fone}
                      onChange={(e) => updateFormData("fone", e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="contato@igreja.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="CD_SITUACAO">Situação *</Label>
                  <Select
                    value={formData.CD_SITUACAO ? String(formData.CD_SITUACAO) : ""}
                    onValueChange={(value) => updateFormData("CD_SITUACAO", Number(value))}
                  >
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
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-gradient-warm hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading
                    ? (isEditMode ? "Atualizando..." : "Cadastrando...")
                    : (isEditMode ? "Atualizar Supervisão" : "Cadastrar Supervisão")
                  }
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar supervisões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            Supervisões Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de todas as supervisões cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="text-center py-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              Carregando...
            </div>
          ) : filteredIgrejas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Nenhuma supervisão encontrada com esse termo" : "Nenhuma supervisão cadastrada"}
            </div>
          ) : (
            <>
              <div className="md:hidden space-y-4">
                {filteredIgrejas.map((igreja) => (
                  <Card key={igreja.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{igreja.nomeFantasia}</div>
                          <div className="text-sm text-muted-foreground">{igreja.razaoSocial}</div>
                        </div>
                        <Badge variant={igreja.situacao === "Ativa" ? "default" : "secondary"}>
                          {igreja.situacao}
                        </Badge>
                      </div>

                      <div className="text-sm font-mono">{igreja.cnpj}</div>

                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{igreja.cidade}, {igreja.estado}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {igreja.telefone || "Não informado"}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {igreja.email || "Não informado"}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(igreja)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(igreja.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIgrejas.map((igreja) => (
                      <TableRow key={igreja.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{igreja.nomeFantasia}</div>
                            <div className="text-sm text-muted-foreground">{igreja.razaoSocial}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{igreja.cnpj}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{igreja.cidade}, {igreja.estado}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {igreja.telefone || "Não informado"}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {igreja.email || "Não informado"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={igreja.situacao === "Ativa" ? "default" : "secondary"}>
                            {igreja.situacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(igreja)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(igreja.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}