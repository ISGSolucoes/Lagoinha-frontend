import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockEstados = [
  { id: 1, sigla: "SP", nome: "São Paulo", ativo: true },
  { id: 2, sigla: "RJ", nome: "Rio de Janeiro", ativo: true },
  { id: 3, sigla: "MG", nome: "Minas Gerais", ativo: true },
  { id: 4, sigla: "RS", nome: "Rio Grande do Sul", ativo: true },
]

export default function Estados() {
  const [estados, setEstados] = useState(mockEstados)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEstado, setEditingEstado] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    sigla: "",
    nome: "",
    ativo: true
  })

  const handleSubmit = () => {
    if (editingEstado) {
      setEstados(prev => prev.map(estado => 
        estado.id === editingEstado.id 
          ? { ...estado, ...formData }
          : estado
      ))
      toast({ title: "Estado atualizado com sucesso!" })
    } else {
      const newEstado = {
        id: Date.now(),
        ...formData
      }
      setEstados(prev => [...prev, newEstado])
      toast({ title: "Estado cadastrado com sucesso!" })
    }
    
    setFormData({ sigla: "", nome: "", ativo: true })
    setEditingEstado(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (estado: any) => {
    setEditingEstado(estado)
    setFormData({
      sigla: estado.sigla,
      nome: estado.nome,
      ativo: estado.ativo
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setEstados(prev => prev.filter(estado => estado.id !== id))
    toast({ title: "Estado removido com sucesso!" })
  }

  const filteredEstados = estados.filter(estado =>
    estado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estado.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Estados</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-warm hover:opacity-90"
              onClick={() => {
                setEditingEstado(null)
                setFormData({ sigla: "", nome: "", ativo: true })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Estado
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEstado ? "Editar Estado" : "Novo Estado"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sigla">Sigla</Label>
                <Input
                  id="sigla"
                  value={formData.sigla}
                  onChange={(e) => setFormData(prev => ({ ...prev, sigla: e.target.value.toUpperCase() }))}
                  placeholder="Ex: SP"
                  maxLength={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome do Estado</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome do estado"
                />
              </div>
              
              <Button onClick={handleSubmit} className="bg-gradient-warm hover:opacity-90">
                {editingEstado ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estados</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sigla</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstados.map((estado) => (
                <TableRow key={estado.id}>
                  <TableCell className="font-medium">{estado.sigla}</TableCell>
                  <TableCell>{estado.nome}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      estado.ativo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {estado.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(estado)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(estado.id)}
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
        </CardContent>
      </Card>
    </div>
  )
}