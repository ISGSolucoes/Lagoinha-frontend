import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type PerfilApi = {
  CD_USUARIO?: number;
  NOME?: string;
  EMAIL?: string;
  CPF?: string;
  ENDERECO?: string;
  NRO?: string;
  BAIRRO?: string;
  CEP?: string;
  CELULAR?: string;
  CD_TIPO?: number;
  CD_SITUACAO?: number;
  CD_CIDADE?: number;
  CD_IGREJA_ATUAL?: number;
  CD_IGREJA?: number;
};

export default function Perfil() {
  const { toast } = useToast();

  const userLocal = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const emailLogado = userLocal?.EMAIL || userLocal?.email || "";

  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilApi | null>(null);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        if (!emailLogado) {
          setLoading(false);
          toast({
            title: "Sem usuário logado",
            description: "Não encontrei o email do usuário no localStorage.",
            variant: "destructive",
          });
          return;
        }

        const url = `http://localhost:3001/auth/perfil?email=${encodeURIComponent(
          emailLogado
        )}`;

        const resp = await fetch(url);

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(txt || "Falha ao buscar perfil");
        }

        const data = (await resp.json()) as PerfilApi;

        setPerfil(data);
      } catch (err: any) {
        toast({
          title: "Erro ao carregar perfil",
          description: err?.message || "Falha ao buscar dados do perfil.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [emailLogado, toast]);

  const nome = perfil?.NOME || userLocal?.NOME || "Usuário";
  const email = perfil?.EMAIL || emailLogado;

  if (loading) {
    return <div className="p-6">Carregando perfil...</div>;
  }

  if (!perfil) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Não consegui carregar os dados do perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <Button variant="church">Editar Perfil</Button>
      </div>

      {/* Card simples com dados reais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumo */}
        <div className="border rounded-xl p-6 bg-card">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="font-semibold">
              {(nome?.trim()?.[0] || "U").toUpperCase()}
            </span>
          </div>

          <div className="text-xl font-semibold">{nome}</div>
          <div className="text-sm text-muted-foreground">{email}</div>

          <div className="mt-6 text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">CD_USUARIO:</span>{" "}
              {perfil.CD_USUARIO ?? "-"}
            </div>
            <div>
              <span className="text-muted-foreground">CD_IGREJA:</span>{" "}
              {perfil.CD_IGREJA ?? "-"}
            </div>
            <div>
              <span className="text-muted-foreground">CD_TIPO:</span>{" "}
              {perfil.CD_TIPO ?? "-"}
            </div>
            <div>
              <span className="text-muted-foreground">CD_SITUACAO:</span>{" "}
              {perfil.CD_SITUACAO ?? "-"}
            </div>
          </div>
        </div>

        {/* Informações pessoais */}
        <div className="lg:col-span-2 border rounded-xl p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Campo label="Nome Completo" value={perfil.NOME} />
            <Campo label="CPF" value={perfil.CPF} />
            <Campo label="E-mail" value={perfil.EMAIL} />
            <Campo label="Telefone" value={perfil.CELULAR} />
            <Campo
              label="Endereço"
              value={
                [perfil.ENDERECO, perfil.NRO, perfil.BAIRRO]
                  .filter(Boolean)
                  .join(", ") || ""
              }
            />
            <Campo label="CEP" value={perfil.CEP} />
            <Campo label="Cidade (CD_CIDADE)" value={String(perfil.CD_CIDADE ?? "")} />
            <Campo label="Igreja Atual (CD_IGREJA_ATUAL)" value={String(perfil.CD_IGREJA_ATUAL ?? "")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      <div className="rounded-lg border bg-background/50 px-3 py-2 text-sm">
        {value && value.trim() ? value : "-"}
      </div>
    </div>
  );
}
