import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PieChart, Save, Plus, Trash2, AlertCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/carteira")({
  component: CarteiraPage,
});

// 1. CRIAMOS UM TIPO PARA ENSINAR O TYPESCRIPT O QUE É UM ATIVO
type Ativo = {
  id: string;
  nome: string;
  tipo: string;
  percentual: number;
};

// 2. TIPAMOS O OBJETO (Record<string, Ativo[]>)
const carteirasSugeridas: Record<string, Ativo[]> = {
  conservador: [
    { id: "1", nome: "Tesouro Selic 2027", tipo: "Renda Fixa", percentual: 60 },
    { id: "2", nome: "Tesouro IPCA+ 2035", tipo: "Renda Fixa", percentual: 25 },
    { id: "3", nome: "KNCR11", tipo: "FIIs", percentual: 10 },
    { id: "4", nome: "BOVA11", tipo: "ETFs", percentual: 5 },
  ],
  moderado: [
    { id: "1", nome: "Tesouro IPCA+", tipo: "Renda Fixa", percentual: 35 },
    { id: "2", nome: "ITUB4", tipo: "Ações", percentual: 15 },
    { id: "3", nome: "WEGE3", tipo: "Ações", percentual: 15 },
    { id: "4", nome: "HGLG11", tipo: "FIIs", percentual: 20 },
    { id: "5", nome: "IVVB11", tipo: "ETFs", percentual: 15 },
  ],
  arrojado: [
    { id: "1", nome: "WEGE3", tipo: "Ações", percentual: 25 },
    { id: "2", nome: "PETR4", tipo: "Ações", percentual: 20 },
    { id: "3", nome: "VISC11", tipo: "FIIs", percentual: 20 },
    { id: "4", nome: "HASH11", tipo: "Cripto", percentual: 15 },
    { id: "5", nome: "Tesouro Selic (Reserva)", tipo: "Renda Fixa", percentual: 20 },
  ],
};

const coresPorTipo: Record<string, string> = {
  "Renda Fixa": "bg-[#4585DB]",
  "Ações": "bg-[#FC5B3F]",
  "FIIs": "bg-[#30BC9C]",
  "ETFs": "bg-[#A855F7]",
  "Cripto": "bg-[#F59E0B]",
};

function CarteiraPage() {
  const [perfil, setPerfil] = useState("moderado");
  
  // 3. GARANTIMOS O TIPO NO USESTATE E UM ARRAY VAZIO COMO SEGURANÇA (|| [])
  const [ativos, setAtivos] = useState<Ativo[]>(carteirasSugeridas["moderado"] || []);

  const totalPercentual = useMemo(() => {
    return ativos.reduce((acc, ativo) => acc + (Number(ativo.percentual) || 0), 0);
  }, [ativos]);

  const diferenca = 100 - totalPercentual;

  const handleMudarPerfil = (novoPerfil: string) => {
    setPerfil(novoPerfil);
    // 4. PREVINE ERRO NO SPREAD SE O PERFIL NÃO EXISTIR
    setAtivos([...(carteirasSugeridas[novoPerfil] || [])]);
    toast.info(`Carteira rebalanceada para o perfil ${novoPerfil.charAt(0).toUpperCase() + novoPerfil.slice(1)}`);
  };

  const atualizarAtivo = (id: string, campo: keyof Ativo, valor: string | number) => {
    setAtivos((prev) =>
      prev.map((ativo) => (ativo.id === id ? { ...ativo, [campo]: valor } : ativo))
    );
  };

  const removerAtivo = (id: string) => {
    setAtivos((prev) => prev.filter((ativo) => ativo.id !== id));
  };

  const adicionarAtivo = () => {
    const novoId = Math.random().toString(36).substring(2, 9);
    setAtivos([...ativos, { id: novoId, nome: "", tipo: "Ações", percentual: 0 }]);
  };

  const salvarCarteira = async () => {
    if (totalPercentual !== 100) {
      toast.error("A soma dos percentuais deve ser exatamente 100%.");
      return;
    }
    toast.success("Carteira salva com sucesso!", { description: "Sua alocação ideal foi atualizada." });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="surface-card p-6 border-border/80">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Carteira Ideal de Investimentos
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Defina sua alocação alvo balanceada. O motor de risco quantitativo utilizará essas proporções para orientar seus próximos aportes.
        </p>
      </header>

      <Card className="surface-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <PieChart className="w-5 h-5 text-primary" />
            Perfil de Alocação de Referência
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Altere seu perfil para carregar a sugestão parametrizada segundo referências institucionais (XP, BTG Pactual e Vanguard).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 w-full sm:w-1/2">
              <Select value={perfil} onValueChange={handleMudarPerfil}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservador">Conservador (Foco em Renda Fixa)</SelectItem>
                  <SelectItem value="moderado">Moderado (Equilíbrio e Dividendos)</SelectItem>
                  <SelectItem value="arrojado">Arrojado (Crescimento e Risco)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => handleMudarPerfil(perfil)} className="gap-2 w-full sm:w-auto">
              <RefreshCcw className="w-4 h-4" />
              Restaurar Sugestão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-surface/50">
        <CardHeader>
          <CardTitle className="text-lg">Composição da Carteira</CardTitle>
          <CardDescription>Adicione, remova ou edite o peso de cada ativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Alocação Total</span>
              <span className={totalPercentual === 100 ? "text-success" : "text-destructive"}>
                {totalPercentual.toFixed(1)}% / 100%
              </span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
              {ativos.map((ativo) => (
                <div
                  key={ativo.id}
                  style={{ width: `${ativo.percentual}%` }}
                  className={`h-full ${coresPorTipo[ativo.tipo] || "bg-primary"} transition-all duration-500`}
                  title={`${ativo.nome}: ${ativo.percentual}%`}
                />
              ))}
            </div>
            {totalPercentual !== 100 && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {diferenca > 0 
                  ? `Falta alocar ${diferenca.toFixed(1)}% na sua carteira.` 
                  : `Você ultrapassou ${(diferenca * -1).toFixed(1)}% do limite.`}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-4">
            {ativos.map((ativo) => (
              <div key={ativo.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5 sm:col-span-5">
                  <Input 
                    value={ativo.nome} 
                    onChange={(e) => atualizarAtivo(ativo.id, "nome", e.target.value)}
                    placeholder="Ex: PETR4"
                    className="bg-background/50"
                  />
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <Select 
                    value={ativo.tipo} 
                    onValueChange={(val) => atualizarAtivo(ativo.id, "tipo", val)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                      <SelectItem value="Ações">Ações</SelectItem>
                      <SelectItem value="FIIs">FIIs</SelectItem>
                      <SelectItem value="ETFs">ETFs</SelectItem>
                      <SelectItem value="Cripto">Cripto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 sm:col-span-2 relative">
                  <Input 
                    type="number" 
                    value={ativo.percentual} 
                    onChange={(e) => atualizarAtivo(ativo.id, "percentual", Number(e.target.value))}
                    className="bg-background/50 pr-6"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                </div>
                <div className="col-span-1 text-right">
                  <Button variant="ghost" size="icon" onClick={() => removerAtivo(ativo.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={adicionarAtivo} className="w-full border-dashed gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Novo Ativo
          </Button>

        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          onClick={salvarCarteira} 
          disabled={totalPercentual !== 100}
          className="gap-2 font-bold w-full sm:w-auto bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25"
        >
          <Save className="w-4 h-4" />
          Salvar Carteira
        </Button>
      </div>
    </div>
  );
}