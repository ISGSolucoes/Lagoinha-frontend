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

  // se sua API já retornar descrições, ótimo:
  DS_TIPO?: string;
  DS_SITUACAO?: string;
  DS_IGREJA?: string;
  DS_IGREJA_ATUAL?: string;
  DS_CIDADE?: string;

  // (se você tiver UF no perfil, esse campo ajuda muito)
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

async function fetchJson(url: string) {
  const resp = await fetch(url);
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || `Falha ao buscar: ${url}`);
  }
  return resp.json();
}

function unwrapDataArray<T>(json: any): T[] {
  // vem embrulhado: { success: true, data: [...] }
  if (json && typeof json === "object" && "data" in json) {
    const data = (json as ApiWrapped<any>).data;
    return Array.isArray(data) ? (data as T[]) : [];
  }
  // às vezes vem direto como array
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

  const [estados, setEstados] = useState<EstadoApi[]>([]);
  const [cidades, setCidades] = useState<CidadeApi[]>([]);
  const [igrejas, setIgrejas] = useState<IgrejaApi[]>([]);
  const [loadingListas, setLoadingListas] = useState(false);

  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");
  const [igrejaAtualSelecionada, setIgrejaAtualSelecionada] = useState<string>("");

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

        setCidadeSelecionada(data.CD_CIDADE != null ? String(data.CD_CIDADE) : "");
        setIgrejaAtualSelecionada(
          data.CD_IGREJA_ATUAL != null ? String(data.CD_IGREJA_ATUAL) : ""
        );

        // se a API já manda UF no perfil, já preenche:
        if (data.UF && String(data.UF).trim()) {
          setEstadoSelecionado(String(data.UF).trim());
        }
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

  // ✅ 2) Carrega estados + igrejas (rotas confirmadas)
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

        // debug
        console.log("ESTADOS:", estadosArr);
        console.log("IGREJAS:", igrejasArr);
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

  // ✅ 3) Carrega cidades do UF selecionado (rota confirmada)
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

        console.log("CIDADES:", cidadesArr);
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

  if (loading) return <div className="p-6">Carregando perfil...</div>;

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

  const nome = perfil?.NOME || userLocal?.NOME || "Usuário";
  const email = perfil?.EMAIL || emailLogado;

  // resumo (com nomes quando existirem)
  const tipoResumo =
    pickFirst(perfil.DS_TIPO) || (perfil.CD_TIPO != null ? String(perfil.CD_TIPO) : "-");

  const situacaoResumo =
    pickFirst(perfil.DS_SITUACAO) ||
    (perfil.CD_SITUACAO != null ? String(perfil.CD_SITUACAO) : "-");

  const igrejaResumo =
    igrejas.find((i) => String(i.ID) === String(igrejaAtualSelecionada))?.LABEL ||
    pickFirst(perfil.DS_IGREJA_ATUAL, perfil.DS_IGREJA) ||
    "-";

  const cidadeResumo =
    cidades.find((c) => String(c.CD_CIDADE) === String(cidadeSelecionada))?.NOME ||
    pickFirst(perfil.DS_CIDADE) ||
    (perfil.CD_CIDADE != null ? String(perfil.CD_CIDADE) : "-");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <Button variant="church" onClick={() => setEditando((v) => !v)}>
          {editando ? "Fechar Edição" : "Editar Perfil"}
        </Button>
      </div>

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
                  setEstadoSelecionado(v);
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
                        : cidadeResumo || "Selecione a cidade"
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
                        : igrejaResumo || "Selecione a igreja"
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