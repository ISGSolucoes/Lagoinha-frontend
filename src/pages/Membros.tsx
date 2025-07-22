import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Plus, Search, Edit, Trash2, Phone, Mail, Calendar, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Membros() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    igreja: "",
    grupoGrowth: "",
    situacao: "",
    batizadoAguas: false,
    cafeNovosMembros: false,
    visitante: false
  })

  const { toast } = useToast()

  // Mock data
  const membros = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-9999",
      dataNascimento: "1990-05-15",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      igreja: "Igreja Central",
      grupoGrowth: "GC Juventude",
      situacao: "Ativo"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 88888-8888",
      dataNascimento: "1985-08-22",
      endereco: "Av. Paulista, 456",
      cidade: "São Paulo",
      estado: "SP",
      igreja: "Igreja Norte",
      grupoGrowth: "GC Casais",
      situacao: "Ativo"
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      telefone: "(11) 77777-7777",
      dataNascimento: "1978-12-10",
      endereco: "Rua do Comércio, 789",
      cidade: "São Paulo",
      estado: "SP",
      igreja: "Igreja Central",
      grupoGrowth: "GC Empresários",
      situacao: "Ativo"
    }
  ]

  const igrejas = [
    { value: "igreja-central", label: "Igreja Central" },
    { value: "igreja-norte", label: "Igreja Norte" },
    { value: "igreja-sul", label: "Igreja Sul" }
  ]

  const grupos = [
    { value: "gc-juventude", label: "GC Juventude" },
    { value: "gc-casais", label: "GC Casais" },
    { value: "gc-empresarios", label: "GC Empresários" }
  ]

  const situacoes = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
    { value: "visitante", label: "Visitante" }
  ]

  // Função para enviar mensagem de boas-vindas via WhatsApp
  const sendWhatsAppWelcome = async (nome: string, telefone: string) => {
    try {
      // Formatando o telefone para o padrão internacional (remove caracteres especiais)
      const phoneNumber = telefone.replace(/[^\d]/g, '')
      
      // Mensagem de boas-vindas personalizada
      const message = `Olá ${nome}! 🙏\n\nSeja bem-vindo(a) à nossa igreja! ✨\n\nSeu cadastro foi realizado com sucesso e agora você faz parte da nossa comunidade.\n\nEm breve entraremos em contato com mais informações sobre nossos grupos de crescimento e atividades.\n\nQue Deus abençoe sua jornada conosco! 🕊️`
      
      /* INTEGRAÇÃO COM APIs DE WHATSAPP - ESCOLHA UMA DAS OPÇÕES ABAIXO:
      
      // OPÇÃO 1: WhatsApp Business API (oficial)
      const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `55${phoneNumber}`,
          type: 'text',
          text: { body: message }
        })
      })
      
      // OPÇÃO 2: Evolution API (Open Source)
      const response = await fetch('YOUR_EVOLUTION_API_URL/message/sendText', {
        method: 'POST',
        headers: {
          'apikey': 'YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: `55${phoneNumber}`,
          text: message
        })
      })
      
      // OPÇÃO 3: Z-API (Brasileiro)
      const response = await fetch('https://api.z-api.io/instances/YOUR_INSTANCE/token/YOUR_TOKEN/send-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: `55${phoneNumber}`,
          message: message
        })
      })
      
      // OPÇÃO 4: Baileys (via sua própria API)
      const response = await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        })
      })
      */
      
      // Para demonstração, vamos simular o envio
      console.log('WhatsApp Message to send:', {
        to: phoneNumber,
        message: message
      })
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Mensagem WhatsApp enviada!",
        description: `Mensagem de boas-vindas enviada para ${telefone}`,
      })
      
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error)
      toast({
        title: "Erro no WhatsApp",
        description: "Não foi possível enviar a mensagem de boas-vindas",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Aqui você faria a chamada para sua API de cadastro
      // const response = await fetch('/api/membros', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      toast({
        title: "Membro cadastrado com sucesso!",
        description: "O membro foi adicionado ao sistema.",
      })
      
      // Enviar mensagem de boas-vindas via WhatsApp
      if (formData.telefone && formData.nome) {
        await sendWhatsAppWelcome(formData.nome, formData.telefone)
      }
      
      setIsDialogOpen(false)
      // Reset form
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        endereco: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        igreja: "",
        grupoGrowth: "",
        situacao: "",
        batizadoAguas: false,
        cafeNovosMembros: false,
        visitante: false
      })
    } catch (error) {
      console.error('Erro ao cadastrar membro:', error)
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível cadastrar o membro",
        variant: "destructive"
      })
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const filteredMembros = membros.filter(membro => 
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membro.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membro.igreja.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membro.grupoGrowth.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Membros</h1>
          <p className="text-muted-foreground">Gerencie os membros cadastrados no sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Membro</DialogTitle>
              <DialogDescription>
                Preencha os dados do membro que será cadastrado no sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Pessoais</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => updateFormData("nome", e.target.value)}
                      placeholder="Nome completo do membro"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => updateFormData("telefone", e.target.value)}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => updateFormData("dataNascimento", e.target.value)}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Endereço</h3>
                  
                   <div className="space-y-2">
                     <Label htmlFor="endereco">Endereço</Label>
                     <Input
                       id="endereco"
                       value={formData.endereco}
                       onChange={(e) => updateFormData("endereco", e.target.value)}
                       placeholder="Rua e número"
                     />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="bairro">Bairro</Label>
                       <Input
                         id="bairro"
                         value={formData.bairro}
                         onChange={(e) => updateFormData("bairro", e.target.value)}
                         placeholder="Bairro"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="cidade">Cidade</Label>
                       <Input
                         id="cidade"
                         value={formData.cidade}
                         onChange={(e) => updateFormData("cidade", e.target.value)}
                         placeholder="Cidade"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="estado">Estado</Label>
                       <Input
                         id="estado"
                         value={formData.estado}
                         onChange={(e) => updateFormData("estado", e.target.value)}
                         placeholder="UF"
                         maxLength={2}
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="cep">CEP</Label>
                     <Input
                       id="cep"
                       value={formData.cep}
                       onChange={(e) => updateFormData("cep", e.target.value)}
                       placeholder="00000-000"
                     />
                   </div>
                </div>

                {/* Church Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações da Igreja</h3>
                  
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
                      <Label htmlFor="grupoGrowth">Grupo de Crescimento</Label>
                      <Select onValueChange={(value) => updateFormData("grupoGrowth", value)}>
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

                 {/* Status Information */}
                 <div className="space-y-4">
                   <h3 className="text-lg font-medium">Status do Membro</h3>
                   
                   <div className="space-y-4">
                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         id="batizadoAguas"
                         checked={formData.batizadoAguas}
                         onChange={(e) => updateFormData("batizadoAguas", e.target.checked)}
                         className="rounded border-border focus:ring-primary"
                       />
                       <Label htmlFor="batizadoAguas">Já foi batizado nas águas</Label>
                     </div>

                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         id="cafeNovosMembros"
                         checked={formData.cafeNovosMembros}
                         onChange={(e) => updateFormData("cafeNovosMembros", e.target.checked)}
                         className="rounded border-border focus:ring-primary"
                       />
                       <Label htmlFor="cafeNovosMembros">Já participou do café para novos membros</Label>
                     </div>

                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         id="visitante"
                         checked={formData.visitante}
                         onChange={(e) => updateFormData("visitante", e.target.checked)}
                         className="rounded border-border focus:ring-primary"
                       />
                       <Label htmlFor="visitante">É visitante?</Label>
                     </div>
                   </div>
                 </div>
               </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-warm hover:opacity-90 transition-opacity">
                  Cadastrar Membro
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
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{membros.length}</p>
                <p className="text-muted-foreground text-sm">Total de Membros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 text-2xl font-bold px-3 py-1">
                {membros.filter(m => m.situacao === "Ativo").length}
              </Badge>
              <div>
                <p className="text-muted-foreground text-sm">Membros Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800 text-2xl font-bold px-3 py-1">
                {membros.filter(m => m.situacao === "Visitante").length}
              </Badge>
              <div>
                <p className="text-muted-foreground text-sm">Visitantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-muted-foreground text-sm">Novos este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Membros Cadastrados
          </CardTitle>
          <CardDescription>
            Lista de todos os membros cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Cards - Hidden on desktop */}
          <div className="md:hidden space-y-4">
            {filteredMembros.map((membro) => (
              <Card key={membro.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{membro.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {membro.igreja} • {membro.grupoGrowth}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        membro.situacao === "Ativo" ? "default" : 
                        membro.situacao === "Visitante" ? "secondary" : "outline"
                      }
                    >
                      {membro.situacao}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {membro.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {membro.telefone}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{calculateAge(membro.dataNascimento)} anos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{membro.cidade}, {membro.estado}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Igreja/Grupo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembros.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{membro.nome}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {membro.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {membro.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{calculateAge(membro.dataNascimento)} anos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{membro.igreja}</div>
                        <div className="text-xs text-muted-foreground">{membro.grupoGrowth}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{membro.cidade}, {membro.estado}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          membro.situacao === "Ativo" ? "default" : 
                          membro.situacao === "Visitante" ? "secondary" : "outline"
                        }
                      >
                        {membro.situacao}
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}