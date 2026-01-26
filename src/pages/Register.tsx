import React from 'react';

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, User, Mail, Lock, CreditCard, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import churchBackground from "@/assets/church-background.jpg"
import { UserTypeService, ChurchService, AuthService } from '../services/optionsService';

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}


export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function Register() {

  const [loadingState, setLoadingState] = useState<{
    options: boolean;
    submit: boolean;
  }>({
    options: true,
    submit: false
  })

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.nome.trim()) errors.push("Nome é obrigatório");
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) errors.push("CPF inválido");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Email inválido");
    if (formData.senha.length < 6) errors.push("Senha deve ter pelo menos 6 caracteres");
    if (formData.senha !== formData.confirmarSenha) errors.push("As senhas não coincidem");
    if (!formData.cd_tipo) errors.push("Selecione um tipo de usuário");
    if (!formData.cd_igreja) errors.push("Selecione uma igreja");

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cd_tipo: null,
    cd_igreja: null,
    cd_situacao: "1", // 1 - Ativo
    cd_cidade: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [igrejas, setIgrejas] = useState([]);

  // Busca opções ao carregar o componente
  useEffect(() => {
    const controller = new AbortController();

    const fetchOptions = async () => {
      try {
        const tiposData = await UserTypeService.getUserTypes();
        const igrejasData = await ChurchService.getChurches();

        console.log('Tipos Data:', tiposData);
        console.log('Igrejas Data:', igrejasData)

        if (!tiposData || !igrejasData) {
          throw new Error("Dados inválidos recebidos do servidor");
        }

        const tiposArray = typeof tiposData === 'string' ? JSON.parse(tiposData) : tiposData;
        const igrejasArray = typeof igrejasData === 'string' ? JSON.parse(igrejasData) : igrejasData;

        // Verificar se são arrays
        if (!Array.isArray(tiposArray) || !Array.isArray(igrejasArray)) {
          throw new Error("Dados recebidos não são arrays válidos");
        }

        console.log('Tipos Array:', tiposArray);
        console.log('Igrejas Array:', igrejasArray);

        setTiposUsuario(tiposArray);
        setIgrejas(igrejasArray);

        // setTiposUsuario(tiposData);
        // setIgrejas(igrejasData);
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
      } finally {
        setLoadingState(prev => ({ ...prev, options: false }));
      }
    };

    fetchOptions();

    return () => controller.abort();
  }, [])

  const handleIgrejaChange = (igrejaId: string) => {
    const igrejaSelecionada = igrejas.find(igreja => {
      const value = igreja.id || igreja.cd_igreja || igreja.value || igreja.ID;
      return value.toString() === igrejaId;
    });

    console.log('Entrou: handleIgrejaChange')

    setFormData(prev => ({
      ...prev,
      cd_igreja: igrejaId,
      cd_cidade: igrejaSelecionada?.CD_CIDADE
    }));

    console.log('Dados igreja: ', igrejaSelecionada)

    console.log('Dados Cidade: ',igrejaSelecionada?.CD_CIDADE)
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.valid) {
      toast({
        title: "Erro de validação",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setLoadingState(prev => ({ ...prev, submit: true }));

    try {
      console.log('Dados a serem salvos: ', formData)
      const dados = await AuthService.register({
        ...formData,
        cd_tipo: Number(formData.cd_tipo),
        cd_igreja: Number(formData.cd_igreja),
        cd_cidade: Number(formData.cd_cidade)
      });

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso. Redirecionando...",
      });

      // Redireciona após 2 segundos
      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro no cadastro:", error.message);

        toast({
          title: "Erro!",
          description: "Erro ao tentar cadastrar",
        });


      } else {
        console.error('Erro desconhecido', error);
      }
    } finally {
      setLoadingState(prev => ({ ...prev, submit: false }));
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
                <Label htmlFor="cd_tipo">Tipo de Usuário</Label>
                <Select
                  onValueChange={(value) => updateFormData("cd_tipo", value)}
                  disabled={loadingState.options}
                  required
                  value={formData.cd_tipo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingState.options ? "Carregando..." : "Selecione o tipo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingState.options ? (
                      <SelectItem disabled value="loading">
                        Carregando...
                      </SelectItem>
                    ) : tiposUsuario.length > 0 ? (
                      tiposUsuario.map((tipo, index) => {
                        // Versão segura - adapte conforme a estrutura real dos dados
                        const value = tipo.id || tipo.cd_tipo || tipo.value || tipo.ID || index;
                        const label = tipo.nome || tipo.descricao || tipo.label || tipo.NOME || tipo.LABEL || `Tipo ${index + 1}`;

                        return (
                          <SelectItem key={value} value={value.toString()}>
                            {label}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem disabled value="none">
                        Nenhuma opção disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cd_igreja">Igreja</Label>
                <Select
                  //onValueChange={(value) => updateFormData("cd_igreja", value)}
                  onValueChange={handleIgrejaChange}
                  disabled={loadingState.options}
                  required
                  value={formData.cd_igreja}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingState.options ? "Carregando..." : "Selecione a igreja"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingState.options ? (
                      <SelectItem disabled value="loading">
                        Carregando...
                      </SelectItem>
                    ) : igrejas.length > 0 ? (
                      igrejas.map((igreja, index) => {
                        // Versão segura - adapte conforme a estrutura real dos dados
                        const value = igreja.id || igreja.cd_igreja || igreja.value || igreja.ID || index;
                        const label = igreja.nome || igreja.descricao || igreja.label || igreja.NOME || igreja.LABEL || `Igreja ${index + 1}`;

                        return (
                          <SelectItem key={value} value={value.toString()}>
                            {label}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem disabled value="none">
                        Nenhuma opção disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="space-y-4 flex-col">
              <Button
                type="submit"
                variant="church"
                className="w-full relative"
                disabled={loadingState.submit || loadingState.options}
              >
                {loadingState.submit ? (
                  <>
                    <span className="opacity-0">Cadastrar</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner className="h-5 w-5" />
                    </div>
                  </>
                ) : (
                  "Cadastrar"
                )}
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
    </div >
  )
}