import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  DS_TIPO?: string;
  DS_SITUACAO?: string;
  DS_IGREJA?: string;
  DS_IGREJA_ATUAL?: string;
  DS_CIDADE?: string;

  UF?: string;
};

type ApiWrapped<T> = { success: boolean; data: T };

type EstadoApi = { UF: string; NOME: string; CD_SITUACAO?: number };
type CidadeApi = { CD_CIDADE: number; NOME: string; UF?: string; CD_SITUACAO?: number };

type IgrejaApi = {
  ID: number;
  LABEL: string;
  CD_CIDADE?: number;
  LOCALIZACAO?: string;
  CNPJ?: string;
  FONE?: string;
  EMAIL?: string;
  SITUACAO?: string;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function fetchJson(url: string, init?: RequestInit) {
  const resp = await fetch(url, init);
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || `Falha ao buscar: ${url}`);
  }
  return resp.json();
}

function unwrapDataArray<T>(json: any): T[] {
  if (json && typeof json === "object" && "data" in json) {
    const data = (json as ApiWrapped<any>).data;
    return Array.isArray(data) ? (data as T[]) : [];
  }
  return Array.isArray(json) ? (json as T[]) : [];
}

function pickFirst(...vals: Array<string | undefined | null>) {
  for (const v of vals) if (typeof v === "string" && v.trim()) return v.trim();
  return "";
}

export default function Perfil() {
  const { toast } = useToast();

  const userLocal = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const emailLogado = userLocal?.EMAIL || userLocal?.email || "";

  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilApi | null>(null);

  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);

  const [estados, setEstados] = useState<EstadoApi[]>([]);
  const [cidades, setCidades] = useState<CidadeApi[]>([]);
  const [igrejas, setIgrejas] = useState<IgrejaApi[]>([]);
  const [loadingListas, setLoadingListas] = useState(false);

  // valores editáveis
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>(""); // UF
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>(""); // CD_CIDADE string
  const [igrejaAtualSelecionada, setIgrejaAtualSelecionada] = useState<string>(""); // ID igreja string

  // snapshots (para cancelar edição)
  const [snapshotUF, setSnapshotUF] = useState<string>("");
  const [snapshotCidade, setSnapshotCidade] = useState<string>("");
  const [snapshotIgrejaAtual, setSnapshotIgrejaAtual] = useState<string>("");

  // ✅ 1) Carrega perfil
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

        const url = `${API_BASE}/auth/perfil?email=${encodeURIComponent(emailLogado)}`;
        const data = (await fetchJson(url)) as PerfilApi;

        setPerfil(data);

        const uf = (data.UF || "").trim();
        const cdCidade = data.CD_CIDADE != null ? String(data.CD_CIDADE) : "";
        const cdIgrejaAtual = data.CD_IGREJA_ATUAL != null ? String(data.CD_IGREJA_ATUAL) : "";

        // set valores atuais
        setEstadoSelecionado(uf);
        setCidadeSelecionada(cdCidade);
        setIgrejaAtualSelecionada(cdIgrejaAtual);

        // snapshots pra "Cancelar"
        setSnapshotUF(uf);
        setSnapshotCidade(cdCidade);
        setSnapshotIgrejaAtual(cdIgrejaAtual);
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

  // ✅ 2) Carrega estados + igrejas
  useEffect(() => {
    async function carregarListasIniciais() {
      try {
        setLoadingListas(true);

        const estadosJson = await fetchJson(`${API_BASE}/api/locations/estados`);
        const estadosArr = unwrapDataArray<EstadoApi>(estadosJson);
        setEstados(estadosArr);

        const igrejasJson = await fetchJson(`${API_BASE}/api/church`);
        const igrejasArr = Array.isArray(igrejasJson) ? (igrejasJson as IgrejaApi[]) : [];
        setIgrejas(igrejasArr);
      } catch (err: any) {
        toast({
          title: "Erro ao carregar listas",
          description: err?.message || "Não foi possível carregar estados/igrejas",
          variant: "destructive",
        });
      } finally {
        setLoadingListas(false);
      }
    }

    carregarListasIniciais();
  }, [toast]);

  // ✅ 3) Carrega cidades do UF selecionado
  useEffect(() => {
    async function carregarCidades() {
      if (!estadoSelecionado) {
        setCidades([]);
        return;
      }

      try {
        setLoadingListas(true);

        const cidadesJson = await fetchJson(
          `${API_BASE}/api/locations/cidades/${estadoSelecionado}`
        );

        const cidadesArr = unwrapDataArray<CidadeApi>(cidadesJson);
        setCidades(cidadesArr);
      } catch (err: any) {
        toast({
          title: "Erro ao carregar cidades",
          description: err?.message || "Não foi possível carregar as cidades",
          variant: "destructive",
        });
        setCidades([]);
      } finally {
        setLoadingListas(false);
      }
    }

    carregarCidades();
  }, [estadoSelecionado, toast]);

  const nome = perfil?.NOME || userLocal?.NOME || "Usuário";
  const email = perfil?.EMAIL || emailLogado;

  // Resumo (com nomes quando existirem)
  const tipoResumo =
    pickFirst(perfil?.DS_TIPO) || (perfil?.CD_TIPO != null ? String(perfil.CD_TIPO) : "-");

  const situacaoResumo =
    pickFirst(perfil?.DS_SITUACAO) ||
    (perfil?.CD_SITUACAO != null ? String(perfil.CD_SITUACAO) : "-");

  const igrejaResumo =
    igrejas.find((i) => String(i.ID) === String(igrejaAtualSelecionada))?.LABEL ||
    pickFirst(perfil?.DS_IGREJA_ATUAL, perfil?.DS_IGREJA) ||
    "-";

  const cidadeNomeSelecionada =
    cidades.find((c) => String(c.CD_CIDADE) === String(cidadeSelecionada))?.NOME || "";

  const cidadeResumo =
    cidadeNomeSelecionada ||
    pickFirst(perfil?.DS_CIDADE) ||
    (perfil?.CD_CIDADE != null ? String(perfil.CD_CIDADE) : "-");

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
    // volta snapshot
    setEstadoSelecionado(snapshotUF);
    setCidadeSelecionada(snapshotCidade);
    setIgrejaAtualSelecionada(snapshotIgrejaAtual);
  };

  const handleSalvarPerfil = async () => {
    try {
      if (!emailLogado) {
        toast({
          title: "Erro",
          description: "Não encontrei o email do usuário logado.",
          variant: "destructive",
        });
        return;
      }

      if (!estadoSelecionado) {
        toast({
          title: "Validação",
          description: "Selecione o Estado (UF).",
          variant: "destructive",
        });
        return;
      }

      if (!cidadeSelecionada) {
        toast({
          title: "Validação",
          description: "Selecione a Cidade.",
          variant: "destructive",
        });
        return;
      }

      if (!igrejaAtualSelecionada) {
        toast({
          title: "Validação",
          description: "Selecione a Igreja Atual.",
          variant: "destructive",
        });
        return;
      }

      setSaving(true);

      const body = {
        email: emailLogado,
        uf: estadoSelecionado,
        cd_cidade: Number(cidadeSelecionada),
        cd_igreja_atual: Number(igrejaAtualSelecionada),
      };

      const resp = await fetchJson(`${API_BASE}/auth/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Atualiza state local (perfil)
      setPerfil((prev) => ({
        ...(prev || {}),
        UF: estadoSelecionado,
        CD_CIDADE: Number(cidadeSelecionada),
        CD_IGREJA_ATUAL: Number(igrejaAtualSelecionada),
        DS_CIDADE: cidadeNomeSelecionada || prev?.DS_CIDADE,
        DS_IGREJA_ATUAL:
          igrejas.find((i) => String(i.ID) === String(igrejaAtualSelecionada))?.LABEL ||
          prev?.DS_IGREJA_ATUAL,
      }));

      // atualiza snapshots
      setSnapshotUF(estadoSelecionado);
      setSnapshotCidade(cidadeSelecionada);
      setSnapshotIgrejaAtual(igrejaAtualSelecionada);

      toast({
        title: "Perfil salvo!",
        description: resp?.message || "As alterações foram salvas com sucesso.",
      });

      setEditando(false);
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err?.message || "Não foi possível salvar o perfil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Carregando perfil...</div>;

  if (!perfil) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">Não consegui carregar os dados do perfil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>

        {!editando ? (
          <Button variant="church" onClick={handleEditar}>
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="church" onClick={handleSalvarPerfil} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Button>
            <Button variant="outline" onClick={handleCancelar} disabled={saving}>
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumo */}
        <div className="border rounded-xl p-6 bg-card">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="font-semibold">{(nome?.trim()?.[0] || "U").toUpperCase()}</span>
          </div>

          <div className="text-xl font-semibold">{nome}</div>
          <div className="text-sm text-muted-foreground">{email}</div>

          <div className="mt-6 text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Usuário:</span> {nome}
            </div>
            <div>
              <span className="text-muted-foreground">Igreja:</span> {igrejaResumo}
            </div>
            <div>
              <span className="text-muted-foreground">Tipo:</span> {tipoResumo}
            </div>
            <div>
              <span className="text-muted-foreground">Situação:</span> {situacaoResumo}
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
              value={[perfil.ENDERECO, perfil.NRO, perfil.BAIRRO].filter(Boolean).join(", ") || ""}
            />
            <Campo label="CEP" value={perfil.CEP} />

            {/* Estado */}
            <div className="space-y-1">
              <div className="text-sm font-medium">Estado</div>
              <Select
                value={estadoSelecionado}
                onValueChange={(v) => {
                  setEstadoSelecionado(v); // UF
                  setCidadeSelecionada("");
                }}
                disabled={!editando || loadingListas || estados.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingListas
                        ? "Carregando..."
                        : estados.length === 0
                        ? "Sem estados"
                        : "Selecione o estado"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((e) => (
                    <SelectItem key={e.UF} value={e.UF}>
                      {e.NOME}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cidade */}
            <div className="space-y-1">
              <div className="text-sm font-medium">Cidade</div>
              <Select
                value={cidadeSelecionada}
                onValueChange={setCidadeSelecionada}
                disabled={!editando || !estadoSelecionado || loadingListas || cidades.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !estadoSelecionado
                        ? "Selecione primeiro o estado"
                        : loadingListas
                        ? "Carregando cidades..."
                        : cidades.length === 0
                        ? "Sem cidades"
                        : "Selecione a cidade"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cidades.map((c) => (
                    <SelectItem key={c.CD_CIDADE} value={String(c.CD_CIDADE)}>
                      {c.NOME}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Igreja Atual */}
            <div className="space-y-1">
              <div className="text-sm font-medium">Igreja Atual</div>
              <Select
                value={igrejaAtualSelecionada}
                onValueChange={setIgrejaAtualSelecionada}
                disabled={!editando || loadingListas || igrejas.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingListas
                        ? "Carregando igrejas..."
                        : igrejas.length === 0
                        ? "Sem igrejas"
                        : "Selecione a igreja"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {igrejas.map((i) => (
                    <SelectItem key={i.ID} value={String(i.ID)}>
                      {i.LABEL}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Texto de apoio só para mostrar "nome da cidade" na tela mesmo fora do select */}
            {!editando && (
              <div className="md:col-span-2 text-sm text-muted-foreground">
                Cidade atual: <span className="font-medium text-foreground">{cidadeResumo}</span>{" "}
                {estadoSelecionado ? `- ${estadoSelecionado}` : ""}
              </div>
            )}
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