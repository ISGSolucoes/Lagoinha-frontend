import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import churchBackground from "@/assets/church-background.jpg"
import { AuthService } from '@/services/optionsService';

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dados = await AuthService.login(email, password);
      if (dados?.token) localStorage.setItem("token", dados.token);
      toast({
        title: "Login realizado!",
        description: `Bem-vindo, ${dados.user?.name}!`
      });

      navigate("/app");
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-gradient-warm p-4 rounded-2xl w-fit shadow-glow animate-glow">
            <Church className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sistema de Gestão</h1>
            <p className="text-muted-foreground">Igrejas e Grupos de Crescimento</p>
          </div>
        </div>

        <Card className="shadow-soft border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entre na sua conta</CardTitle>
            <CardDescription className="text-center">
              Digite seu email e senha para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-y-4 flex-col">
              <Button
                type="submit"
                variant="church"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Não tem conta?{" "}
                <Link to="/cadastro" className="text-primary hover:underline font-medium">
                  Cadastre-se aqui
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}