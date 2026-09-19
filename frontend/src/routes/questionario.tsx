import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ArrowRight, BrainCircuit, Target, TrendingDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/questionario")({
  beforeLoad: () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
  component: QuestionarioPage,
});

function QuestionarioPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados para as 3 perguntas comportamentais (0 = não respondido)
  const [q1, setQ1] = useState<number>(0);
  const [q2, setQ2] = useState<number>(0);
  const [q3, setQ3] = useState<number>(0);

  const isFormComplete = q1 > 0 && q2 > 0 && q3 > 0;

  const handleEnviarQuestionario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    
    setLoading(true);

    // Soma as respostas (O total será entre 3 e 15 pontos)
    const pontuacaoTotal = q1 + q2 + q3;
    
    // Converte a pontuação de (3 a 15) para a escala da sua API (1 a 10)
    const riscoCalculado = Math.max(1, Math.round((pontuacaoTotal / 15) * 10));

    try {
      // Como a idade e renda já foram no cadastro, podemos passar valores padrão aqui 
      // ou o seu backend deve ignorá-los e puxar do banco de dados.
      const res = await api.enviarQuestionario({
        idade: 30,           // Preenchimento obrigatório para a tipagem, mas o DB já tem o real
        renda_mensal: 5000,  // Preenchimento obrigatório para a tipagem, mas o DB já tem o real
        respostas_risco: riscoCalculado
      });

      toast.success("Perfil classificado com sucesso!", {
        description: `O seu perfil ideal é: ${res.nome_perfil}.`,
      });

      localStorage.setItem("user_perfil", res.nome_perfil);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar questionário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = (q1 > 0 ? 1 : 0) + (q2 > 0 ? 1 : 0) + (q3 > 0 ? 1 : 0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <img src="/logo.png" alt="Liquid Invest Logo" className="h-20 w-20 object-contain drop-shadow-[0_0_20px_rgba(252,91,63,0.3)]" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-3">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Liquid SmartInvest · Suitability & Perfil</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Análise de Perfil de Investidor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            Responda a estas 3 perguntas objetivas para calibrar os modelos de Markowitz e XGBoost de acordo com a sua tolerância a risco.
          </p>
          
          {/* Progress bar */}
          <div className="mt-4 flex items-center justify-center gap-3 max-w-xs mx-auto">
            <div className="h-1.5 flex-1 bg-surface-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(answeredCount / 3) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-primary">{answeredCount}/3</span>
          </div>
        </div>

        <form onSubmit={handleEnviarQuestionario} className="space-y-6">
          {/* PERGUNTA 1 */}
          <div className="surface-card p-5 sm:p-6 space-y-4 border-border/80">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-bold text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary text-xs font-black">
                1
              </span>
              <span>Qual é o seu horizonte de tempo com os investimentos?</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard value={1} current={q1} onClick={setQ1} label="Curto Prazo" desc="Menos de 1 ano (Ex: Reserva de emergência)" />
              <OptionCard value={3} current={q1} onClick={setQ1} label="Médio Prazo" desc="De 1 a 5 anos (Ex: Projetos patrimoniais)" />
              <OptionCard value={5} current={q1} onClick={setQ1} label="Longo Prazo" desc="Mais de 5 anos (Ex: Renda passiva e aposentadoria)" />
            </div>
          </div>

          {/* PERGUNTA 2 */}
          <div className="surface-card p-5 sm:p-6 space-y-4 border-border/80">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-bold text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary text-xs font-black">
                2
              </span>
              <span>Como você reage se seus investimentos caírem 20% em um mês?</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard value={1} current={q2} onClick={setQ2} label="Vendo tudo" desc="Não tolero volatilidade de curto prazo." />
              <OptionCard value={3} current={q2} onClick={setQ2} label="Aguardar" desc="Fico cauteloso, mas espero a recuperação." />
              <OptionCard value={5} current={q2} onClick={setQ2} label="Aportar mais" desc="Enxergo como desconto e compro mais cotas." />
            </div>
          </div>

          {/* PERGUNTA 3 */}
          <div className="surface-card p-5 sm:p-6 space-y-4 border-border/80">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-bold text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary text-xs font-black">
                3
              </span>
              <span>Qual o seu nível de experiência no mercado financeiro?</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard value={1} current={q3} onClick={setQ3} label="Iniciante" desc="Renda Fixa, Selic e Tesouro Direto." />
              <OptionCard value={3} current={q3} onClick={setQ3} label="Intermediário" desc="Fundos Imobiliários (FIIs) e ETFs." />
              <OptionCard value={5} current={q3} onClick={setQ3} label="Avançado" desc="Ações B3, Derivativos e Criptoativos." />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" 
            disabled={!isFormComplete || loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            <span>{loading ? "Processando seu perfil via IA..." : "Concluir Perfil & Ativar Carteira"}</span>
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Conforme a Resolução CVM 30/35 e padrões de alocação de risco da BlackRock e CFA Institute.
          </p>
        </form>
      </div>
    </div>
  );
}

// Componente auxiliar para deixar os botões de opção bonitos
function OptionCard({ value, current, onClick, label, desc }: any) {
  const isSelected = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200",
        isSelected 
          ? "border-primary bg-primary/10 shadow-sm" 
          : "border-border bg-surface-2/30 hover:bg-surface-2 hover:border-primary/50"
      )}
    >
      <span className={cn("font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
        {label}
      </span>
      <span className="text-xs text-muted-foreground mt-1">
        {desc}
      </span>
    </button>
  );
}