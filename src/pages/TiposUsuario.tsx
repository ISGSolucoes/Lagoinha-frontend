import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockTiposUsuario = [
  { 
    id: 1, 
    descricao: "Administrador Geral", 
    FL_ADM_GERAL: true, 
    FL_ADM_GCS: true, 
    FL_LIDER_GC: true,
    ativo: true 
  },
  { 
    id: 2, 
    descricao: "Líder de Grupo", 
    FL_ADM_GERAL: false, 
    FL_ADM_GCS: false, 
    FL_LIDER_GC: true,
    ativo: true 
  },
  { 
    id: 3, 
    descricao: "Membro", 
    FL_ADM_GERAL: false, 
    FL_ADM_GCS: false, 
    FL_LIDER_GC: false,
    ativo: true 
  },
]

export default function TiposUsuario() {
  const [tiposUsuario, setTiposUsuario] = useState(mockTiposUsuario)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    descricao: "",
    FL_ADM_GERAL: false,
    FL_ADM_GCS: false,
    FL_LIDER_GC: false,
    ativo: true
  })

  const handleSubmit = () => {
    if (editingTipo) {
      setTiposUsuario(prev => prev.map(tipo => 
        tipo.id === editingTipo.id 
          ? { ...tipo, ...formData }
          : tipo
      ))
      toast({ title: "Tipo de usuário atualizado com sucesso!" })
    } else {
      const newTipo = {
        id: Date.now(),
        ...formData
      }
      setTiposUsuario(prev => [...prev, newTipo])
      toast({ title: "Tipo de usuário cadastrado com sucesso!" })
    }
    
    setFormData({ 
      descricao: "", 
      FL_ADM_GERAL: false, 
      FL_ADM_GCS: false, 
      FL_LIDER_GC: false, 
      ativo: true 
    })
    setEditingTipo(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (tipo: any) => {
    setEditingTipo(tipo)
    setFormData({
      descricao: tipo.descricao,
      FL_ADM_GERAL: tipo.FL_ADM_GERAL,
      FL_ADM_GCS: tipo.FL_ADM_GCS,
      FL_LIDER_GC: tipo.FL_LIDER_GC,
      ativo: tipo.ativo
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setTiposUsuario(prev => prev.filter(tipo => tipo.id !== id))
    toast({ title: "Tipo de usuário removido com sucesso!" })
  }

  const filteredTipos = tiposUsuario.filter(tipo =>
    tipo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Tipos de Usuário</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-warm hover:opacity-90"
              onClick={() => {
                setEditingTipo(null)
                setFormData({ 
                  descricao: "", 
                  FL_ADM_GERAL: false, 
                  FL_ADM_GCS: false, 
                  FL_LIDER_GC: false, 
                  ativo: true 
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTipo ? "Editar Tipo de Usuário" : "Novo Tipo de Usuário"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Digite a descrição do tipo"
                />
              </div>
              
              <div className="grid gap-3">
                <Label>Permissões</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="FL_ADM_GERAL"
                    checked={formData.FL_ADM_GERAL}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, FL_ADM_GERAL: checked as boolean }))
                    }
                  />
                  <Label htmlFor="FL_ADM_GERAL" className="text-sm">
                    Administrador Geral
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="FL_ADM_GCS"
                    checked={formData.FL_ADM_GCS}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, FL_ADM_GCS: checked as boolean }))
                    }
                  />
                  <Label htmlFor="FL_ADM_GCS" className="text-sm">
                    Administrador de Grupos
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="FL_LIDER_GC"
                    checked={formData.FL_LIDER_GC}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, FL_LIDER_GC: checked as boolean }))
                    }
                  />
                  <Label htmlFor="FL_LIDER_GC" className="text-sm">
                    Líder de Grupo
                  </Label>
                </div>
              </div>
              
              <Button onClick={handleSubmit} className="bg-gradient-warm hover:opacity-90">
                {editingTipo ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Usuário</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tipos..."
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
                <TableHead>Descrição</TableHead>
                <TableHead>Admin Geral</TableHead>
                <TableHead>Admin GCs</TableHead>
                <TableHead>Líder GC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTipos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.descricao}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tipo.FL_ADM_GERAL 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {tipo.FL_ADM_GERAL ? 'Sim' : 'Não'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tipo.FL_ADM_GCS 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {tipo.FL_ADM_GCS ? 'Sim' : 'Não'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tipo.FL_LIDER_GC 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {tipo.FL_LIDER_GC ? 'Sim' : 'Não'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tipo.ativo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {tipo.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tipo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tipo.id)}
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