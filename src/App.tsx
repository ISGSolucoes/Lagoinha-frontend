import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Igrejas from "./pages/Igrejas";
import Grupos from "./pages/Grupos";
import Membros from "./pages/Membros";
import RelatorioMembros from "./pages/RelatorioMembros";
import ListaPresenca from "./pages/ListaPresenca";
import RelatorioPresenca from "./pages/RelatorioPresenca";
import Cidades from "./pages/Cidades";
import Estados from "./pages/Estados";
import TiposUsuario from "./pages/TiposUsuario";
import Situacoes from "./pages/Situacoes";
import Perfil from "./pages/Perfil";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />

            {/* ✅ Redirects (para evitar 404 se o menu estiver sem /app) */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/igrejas" element={<Navigate to="/app/igrejas" replace />} />
            <Route path="/grupos" element={<Navigate to="/app/grupos" replace />} />
            <Route path="/membros" element={<Navigate to="/app/membros" replace />} />
            <Route path="/cidades" element={<Navigate to="/app/cidades" replace />} />
            <Route path="/estados" element={<Navigate to="/app/estados" replace />} />
            <Route path="/tipos-usuario" element={<Navigate to="/app/tipos-usuario" replace />} />
            <Route path="/situacoes" element={<Navigate to="/app/situacoes" replace />} />
            <Route path="/perfil" element={<Navigate to="/app/perfil" replace />} />
            <Route path="/lista-presenca" element={<Navigate to="/app/lista-presenca" replace />} />
            <Route path="/relatorio-presenca" element={<Navigate to="/app/relatorio-presenca" replace />} />
            <Route
              path="/relatorios/membros-grupo"
              element={<Navigate to="/app/relatorios/membros-grupo" replace />}
            />

            {/* Protected Routes with Dashboard Layout */}
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="igrejas" element={<Igrejas />} />
              <Route path="grupos" element={<Grupos />} />
              <Route path="membros" element={<Membros />} />
              <Route path="cidades" element={<Cidades />} />
              <Route path="estados" element={<Estados />} />
              <Route path="tipos-usuario" element={<TiposUsuario />} />
              <Route path="situacoes" element={<Situacoes />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="lista-presenca" element={<ListaPresenca />} />
              <Route path="relatorio-presenca" element={<RelatorioPresenca />} />
              <Route path="relatorios/membros-grupo" element={<RelatorioMembros />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
