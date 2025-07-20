import { useState } from "react"
import { User, Mail, Phone, MapPin, Building, Shield, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const mockUserData = {
  id: 1,
  nome: "João Silva",
  email: "joao.silva@exemplo.com",
  cpf: "123.456.789-00",
  telefone: "(11) 99999-9999",
  endereco: "Rua das Flores, 123",
  cidade: "São Paulo",
  estado: "SP",
  igreja: "Igreja Central",
  tipoUsuario: "Administrador Geral",
  dataUltimoLogin: "2024-07-20 10:30:00",
  dataCadastro: "2024-01-15 14:20:00"
}

export default function Perfil() {
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(mockUserData)
  const { toast } = useToast()

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(userData)
  }

  const handleSave = () => {
    setUserData(editData)
    setIsEditing(false)
    toast({ title: "Perfil atualizado com sucesso!" })
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        
        {!isEditing ? (
          <Button onClick={handleEdit} className="bg-gradient-warm hover:opacity-90">
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="bg-gradient-warm hover:opacity-90">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback>
                  {userData.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">{userData.nome}</h2>
                <p className="text-muted-foreground">{userData.tipoUsuario}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="mr-1 h-4 w-4" />
                  {userData.igreja}
                </div>
              </div>
              
              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Último login:</span>
                  <span>{new Date(userData.dataUltimoLogin).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Membro desde:</span>
                  <span>{new Date(userData.dataCadastro).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="nome"
                    value={editData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded-md">{userData.nome}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <p className="p-2 bg-muted rounded-md text-muted-foreground">{userData.cpf}</p>
                <span className="text-xs text-muted-foreground">O CPF não pode ser alterado</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center p-2 bg-muted rounded-md">
                    <Mail className="mr-2 h-4 w-4" />
                    {userData.email}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="telefone"
                    value={editData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center p-2 bg-muted rounded-md">
                    <Phone className="mr-2 h-4 w-4" />
                    {userData.telefone}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              {isEditing ? (
                <Input
                  id="endereco"
                  value={editData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                />
              ) : (
                <div className="flex items-center p-2 bg-muted rounded-md">
                  <MapPin className="mr-2 h-4 w-4" />
                  {userData.endereco}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <p className="p-2 bg-muted rounded-md text-muted-foreground">{userData.cidade}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Estado</Label>
                <p className="p-2 bg-muted rounded-md text-muted-foreground">{userData.estado}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Information Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Informações de Acesso
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Igreja</Label>
                <p className="p-2 bg-muted rounded-md text-muted-foreground">{userData.igreja}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <p className="p-2 bg-muted rounded-md text-muted-foreground">{userData.tipoUsuario}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Ativo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}