import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockCidades = [
  { id: 1, nome: "São Paulo", estado: "SP", ativo: true },
  { id: 2, nome: "Rio de Janeiro", estado: "RJ", ativo: true },
  { id: 3, nome: "Belo Horizonte", estado: "MG", ativo: true },
]

const mockEstados = [
  { id: 1, sigla: "SP", nome: "São Paulo" },
  { id: 2, sigla: "RJ", nome: "Rio de Janeiro" },
  { id: 3, sigla: "MG", nome: "Minas Gerais" },
]

export default function Cidades() {
  const [cidades, setCidades] = useState(mockCidades)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCidade, setEditingCidade] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    estado: "",
    ativo: true
  })

  const handleSubmit = () => {
    if (editingCidade) {
      setCidades(prev => prev.map(cidade => 
        cidade.id === editingCidade.id 
          ? { ...cidade, ...formData }
          : cidade
      ))
      toast({ title: "Cidade atualizada com sucesso!" })
    } else {
      const newCidade = {
        id: Date.now(),
        ...formData
      }
      setCidades(prev => [...prev, newCidade])
      toast({ title: "Cidade cadastrada com sucesso!" })
    }
    
    setFormData({ nome: "", estado: "", ativo: true })
    setEditingCidade(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (cidade: any) => {
    setEditingCidade(cidade)
    setFormData({
      nome: cidade.nome,
      estado: cidade.estado,
      ativo: cidade.ativo
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setCidades(prev => prev.filter(cidade => cidade.id !== id))
    toast({ title: "Cidade removida com sucesso!" })
  }

  const filteredCidades = cidades.filter(cidade =>
    cidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cidade.estado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Cidades</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-warm hover:opacity-90"
              onClick={() => {
                setEditingCidade(null)
                setFormData({ nome: "", estado: "", ativo: true })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Cidade
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCidade ? "Editar Cidade" : "Nova Cidade"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome da Cidade</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome da cidade"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEstados.map((estado) => (
                      <SelectItem key={estado.id} value={estado.sigla}>
                        {estado.sigla} - {estado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleSubmit} className="bg-gradient-warm hover:opacity-90">
                {editingCidade ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cidades</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Mobile Cards - Hidden on desktop */}
          <div className="md:hidden space-y-4">
            {filteredCidades.map((cidade) => (
              <Card key={cidade.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{cidade.nome}</div>
                      <div className="text-sm text-muted-foreground">{cidade.estado}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cidade.ativo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {cidade.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(cidade)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cidade.id)}
                      className="text-destructive hover:text-destructive"
                    >
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
                  <TableHead>Estado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCidades.map((cidade) => (
                  <TableRow key={cidade.id}>
                    <TableCell className="font-medium">{cidade.nome}</TableCell>
                    <TableCell>{cidade.estado}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cidade.ativo 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {cidade.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cidade)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cidade.id)}
                          className="text-destructive hover:text-destructive"
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
        </CardContent>
      </Card>
    </div>
  )
}