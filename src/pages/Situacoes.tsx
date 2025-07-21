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
const mockSituacoes = [
  { id: 1, descricao: "Ativo", ativo: true },
  { id: 2, descricao: "Inativo", ativo: true },
  { id: 3, descricao: "Suspenso", ativo: true },
  { id: 4, descricao: "Transferido", ativo: true },
  { id: 5, descricao: "Desligado", ativo: false },
]

export default function Situacoes() {
  const [situacoes, setSituacoes] = useState(mockSituacoes)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSituacao, setEditingSituacao] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    descricao: "",
    ativo: true
  })

  const handleSubmit = () => {
    if (editingSituacao) {
      setSituacoes(prev => prev.map(situacao => 
        situacao.id === editingSituacao.id 
          ? { ...situacao, ...formData }
          : situacao
      ))
      toast({ title: "Situação atualizada com sucesso!" })
    } else {
      const newSituacao = {
        id: Date.now(),
        ...formData
      }
      setSituacoes(prev => [...prev, newSituacao])
      toast({ title: "Situação cadastrada com sucesso!" })
    }
    
    setFormData({ descricao: "", ativo: true })
    setEditingSituacao(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (situacao: any) => {
    setEditingSituacao(situacao)
    setFormData({
      descricao: situacao.descricao,
      ativo: situacao.ativo
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setSituacoes(prev => prev.filter(situacao => situacao.id !== id))
    toast({ title: "Situação removida com sucesso!" })
  }

  const filteredSituacoes = situacoes.filter(situacao =>
    situacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Situações</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-warm hover:opacity-90"
              onClick={() => {
                setEditingSituacao(null)
                setFormData({ descricao: "", ativo: true })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Situação
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSituacao ? "Editar Situação" : "Nova Situação"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Digite a descrição da situação"
                />
              </div>
              
              <Button onClick={handleSubmit} className="bg-gradient-warm hover:opacity-90">
                {editingSituacao ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Situações</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar situações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Mobile Cards - Hidden on desktop */}
          <div className="md:hidden space-y-4">
            {filteredSituacoes.map((situacao) => (
              <Card key={situacao.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{situacao.descricao}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      situacao.ativo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {situacao.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(situacao)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(situacao.id)}
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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSituacoes.map((situacao) => (
                  <TableRow key={situacao.id}>
                    <TableCell className="font-medium">{situacao.descricao}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        situacao.ativo 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {situacao.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(situacao)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(situacao.id)}
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