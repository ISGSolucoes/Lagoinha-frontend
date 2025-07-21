import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Church, Plus, Search, Edit, Trash2, MapPin, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Igrejas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    telefone: "",
    email: "",
    situacao: ""
  })

  const { toast } = useToast()

  // Mock data
  const igrejas = [
    {
      id: 1,
      razaoSocial: "Igreja Batista Central LTDA",
      nomeFantasia: "Igreja Central",
      cnpj: "12.345.678/0001-90",
      endereco: "Rua Principal, 123",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 99999-9999",
      email: "central@igreja.com",
      situacao: "Ativa"
    },
    {
      id: 2,
      razaoSocial: "Igreja Evangélica Norte",
      nomeFantasia: "Igreja Norte",
      cnpj: "98.765.432/0001-10",
      endereco: "Av. Norte, 456",
      cidade: "São Paulo",
      estado: "SP", 
      telefone: "(11) 88888-8888",
      email: "norte@igreja.com",
      situacao: "Ativa"
    }
  ]

  const cidades = [
    { value: "sao-paulo", label: "São Paulo" },
    { value: "rio-janeiro", label: "Rio de Janeiro" },
    { value: "belo-horizonte", label: "Belo Horizonte" }
  ]

  const estados = [
    { value: "SP", label: "São Paulo" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "MG", label: "Minas Gerais" }
  ]

  const situacoes = [
    { value: "ativa", label: "Ativa" },
    { value: "inativa", label: "Inativa" },
    { value: "em-processo", label: "Em Processo" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Igreja cadastrada com sucesso!",
      description: "A igreja foi adicionada ao sistema.",
    })
    setIsDialogOpen(false)
    // Reset form
    setFormData({
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      endereco: "",
      cep: "",
      cidade: "",
      estado: "",
      telefone: "",
      email: "",
      situacao: ""
    })
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const filteredIgrejas = igrejas.filter(igreja => 
    igreja.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    igreja.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Igrejas</h1>
          <p className="text-muted-foreground">Gerencie as igrejas cadastradas no sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Nova Igreja
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Igreja</DialogTitle>
              <DialogDescription>
                Preencha os dados da igreja que será cadastrada no sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social</Label>
                    <Input
                      id="razaoSocial"
                      value={formData.razaoSocial}
                      onChange={(e) => updateFormData("razaoSocial", e.target.value)}
                      placeholder="Razão social da igreja"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                      id="nomeFantasia"
                      value={formData.nomeFantasia}
                      onChange={(e) => updateFormData("nomeFantasia", e.target.value)}
                      placeholder="Nome fantasia"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => updateFormData("cnpj", e.target.value)}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => updateFormData("cep", e.target.value)}
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => updateFormData("endereco", e.target.value)}
                    placeholder="Rua, número, bairro"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select onValueChange={(value) => updateFormData("estado", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Select onValueChange={(value) => updateFormData("cidade", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {cidades.map((cidade) => (
                          <SelectItem key={cidade.value} value={cidade.value}>
                            {cidade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => updateFormData("telefone", e.target.value)}
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
                  <Label htmlFor="situacao">Situação</Label>
                  <Select onValueChange={(value) => updateFormData("situacao", value)}>
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
                  Cadastrar Igreja
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
            placeholder="Buscar igrejas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            Igrejas Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de todas as igrejas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Cards - Hidden on desktop */}
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
                      {igreja.telefone}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {igreja.email}
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
                          {igreja.telefone}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {igreja.email}
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