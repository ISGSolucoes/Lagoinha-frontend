import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, User, Mail, Lock, CreditCard, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import churchBackground from "@/assets/church-background.jpg"

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "",
    igreja: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const tiposUsuario = [
    { value: "admin_geral", label: "Administrador Geral" },
    { value: "admin_gcs", label: "Administrador de GCs" },
    { value: "lider_gc", label: "Líder de GC" },
    { value: "membro", label: "Membro" }
  ]

  const igrejas = [
    { value: "igreja1", label: "Igreja Central" },
    { value: "igreja2", label: "Igreja Norte" },
    { value: "igreja3", label: "Igreja Sul" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call to /cadastro-usuario
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Agora você pode fazer login no sistema.",
      })
      
      navigate("/login")
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${churchBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-lg space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-gradient-warm p-4 rounded-2xl w-fit shadow-glow animate-glow">
            <Church className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Criar Conta</h1>
            <p className="text-muted-foreground">Cadastre-se no sistema de gestão</p>
          </div>
        </div>

        <Card className="shadow-soft border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Cadastro de Usuário</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => updateFormData("nome", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => updateFormData("cpf", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Sua senha"
                      value={formData.senha}
                      onChange={(e) => updateFormData("senha", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Confirme a senha"
                      value={formData.confirmarSenha}
                      onChange={(e) => updateFormData("confirmarSenha", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoUsuario">Tipo de Usuário</Label>
                <Select onValueChange={(value) => updateFormData("tipoUsuario", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposUsuario.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="igreja">Igreja</Label>
                <Select onValueChange={(value) => updateFormData("igreja", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua igreja" />
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
            </CardContent>
            <CardFooter className="space-y-4 flex-col">
              <Button 
                type="submit" 
                variant="church"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já tem conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}