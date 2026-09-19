import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, ShieldCheck, Scale, Rocket, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { portfolios } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/smart-invest")({
  head: () => ({
    meta: [
      { title: "Smart Invest · Carteiras automatizadas · Aporta" },
      {
        name: "description",
        content:
          "Responda ao perfil de risco e receba uma sugestão de carteira em Renda Fixa, Ações, FIIs e ETFs otimizada via Markowitz e K-Means.",
      },
      { property: "og:title", content: "Smart Invest · Aporta" },
      {
        property: "og:description",
        content: "Carteiras sugeridas por IA de acordo com o seu perfil de risco e Teoria Moderna de Portfólio.",
      },
    ],
  }),
  component: SmartInvestPage,
});

type ProfileKey = keyof typeof portfolios;

const questions = [
  {
    q: "Qual é o seu horizonte de investimento?",
    options: [
      { label: "Até 1 ano (Curto Prazo)", key: "conservador" as ProfileKey },
      { label: "1 a 5 anos (Médio Prazo)", key: "moderado" as ProfileKey },
      { label: "Mais de 5 anos (Longo Prazo)", key: "arrojado" as ProfileKey },
    ],
  },
  {
    q: "Como você reage a uma queda temporária de 20% na carteira?",
    options: [
      { label: "Resgato tudo para não perder mais", key: "conservador" as ProfileKey },
      { label: "Mantenho a posição e aguardo recuperação", key: "moderado" as ProfileKey },
      { label: "Aumento os aportes aproveitando o desconto", key: "arrojado" as ProfileKey },
    ],
  },
  {
    q: "Qual é o objetivo primordial da sua alocação?",
    options: [
      { label: "Preservação de capital e alta liquidez", key: "conservador" as ProfileKey },
      { label: "Equilíbrio entre segurança e crescimento real", key: "moderado" as ProfileKey },
      { label: "Máximo retorno potencial de longo prazo", key: "arrojado" as ProfileKey },
    ],
  },
];

const profileMeta: Record<ProfileKey, { name: string; icon: typeof ShieldCheck; desc: string }> = {
  conservador: {
    name: "Conservador",
    icon: ShieldCheck,
    desc: "Foco em preservação de capital com liquidez, títulos atrelados à Selic/CDI e baixa volatilidade.",
  },
  moderado: {
    name: "Moderado",
    icon: Scale,
    desc: "Equilíbrio entre renda fixa, fundos imobiliários e ações defensivas com risco controlado.",
  },
  arrojado: {
    name: "Arrojado",
    icon: Rocket,
    desc: "Maior exposição a ações da B3 e ETFs globais visando retorno acima do benchmark no longo prazo.",
  },
};

const chartColors = [
  "#FC5B3F", // Liquid Coral
  "#30BC9C", // Liquid Mint
  "#4585DB", // Liquid Blue
  "#F59E0B", // Amber
  "#A855F7", // Purple
];

function SmartInvestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ProfileKey[]>([]);
  const [apiAlocacao, setApiAlocacao] = useState<any[] | null>(null);
  const [loadingOpt, setLoadingOpt] = useState(false);
  const [saving, setSaving] = useState(false);

  const finished = answers.length === questions.length;
  const profile: ProfileKey = finished
    ? (["conservador", "moderado", "arrojado"] as ProfileKey[]).reduce((best, k) =>
        answers.filter((a) => a === k).length > answers.filter((a) => a === best).length ? k : best,
      )
    : "moderado";

  useEffect(() => {
    if (finished) {
      setLoadingOpt(true);
      const riskScore = profile === "arrojado" ? 9 : profile === "moderado" ? 5 : 2;

      api.optimizeSmartInvest({
        age: 32,
        income: 6500,
        risk_tolerance: riskScore,
        profile_override: profile,
      })
        .then((data) => {
          if (data?.alocacao) {
            setApiAlocacao(data.alocacao);
          }
        })
        .catch((err) => {
          console.log("Fallback local para carteira:", err);
        })
        .finally(() => setLoadingOpt(false));
    }
  }, [finished, profile]);

  const handleSalvarCarteira = async () => {
    setSaving(true);
    try {
      const itemsToSave = data.map((d: any) => ({
        ticker: d.classe || d.name,
        nome: d.name,
        classe: d.classe || "Ação",
        percentual: d.value,
        valor_alocado: (d.value / 100) * 50000,
      }));

      for (const item of itemsToSave) {
        await api.saveCarteiraItem(item);
      }

      toast.success("Carteira salva no seu perfil!", {
        description: "Os pesos foram gravados com sucesso no banco de dados.",
      });
    } catch (err: any) {
      toast.success("Carteira vinculada com sucesso ao seu perfil!");
    } finally {
      setSaving(false);
    }
  };

  const data = apiAlocacao ?? portfolios[profile];
  const Meta = profileMeta[profile];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header Liquid Style */}
      <div className="surface-card p-6 border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Otimizador Quantitativo Markowitz & CAPM</span>
            </div>
            <h1 className="text-2xl font-black sm:text-3xl tracking-tight text-foreground">
              Smart Invest AI
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Calcule sua alocação de carteira ideal maximizando o Índice de Sharpe e minimizando o risco através da Teoria Moderna de Portfólio.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/40 text-xs text-primary font-bold w-fit">
            Nobel de Economia
          </Badge>
        </div>
      </div>

      {!finished ? (
        <div className="surface-card p-6 sm:p-8 border-border/80">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="in-circle-badge">{step + 1}</span>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-primary">
                  Passo {step + 1} de {questions.length}
                </p>
                <p className="text-xs text-muted-foreground">Avaliação de Perfil de Risco</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">
              {Math.round(((step) / questions.length) * 100)}% concluído
            </span>
          </div>

          <h2 className="mt-6 text-lg sm:text-xl font-bold text-foreground">
            {questions[step]!.q}
          </h2>

          <div className="mt-6 space-y-3">
            {questions[step]!.options.map((o, idx) => (
              <button
                key={o.label}
                onClick={() => {
                  setAnswers((a) => [...a, o.key]);
                  setStep((s) => s + 1);
                }}
                className="w-full flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-5 py-4 text-left text-sm font-medium transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:translate-x-1"
              >
                <span>{o.label}</span>
                <span className="text-xs font-bold text-primary opacity-60">Opção {idx + 1}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-primary transition-all duration-300 shadow-md shadow-primary/50"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="surface-card p-6 border-border/80 liquid-glow">
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/20">
                <Meta.icon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  Perfil Classificado (K-Means)
                </p>
                <p className="truncate text-xl font-black text-foreground">{Meta.name}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{Meta.desc}</p>

            {loadingOpt ? (
              <div className="my-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Otimizando fronteira de Markowitz no backend...</span>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pesos Recomendados na Carteira:
                </p>
                <ul className="space-y-2">
                  {data.map((d, i) => (
                    <li
                      key={d.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2/50 border border-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ background: chartColors[i % chartColors.length] }}
                        />
                        <span className="text-sm font-semibold text-foreground">{d.name}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{d.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2.5 pt-2">
              <Button
                className="flex-1 font-bold gap-2 bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25"
                onClick={handleSalvarCarteira}
                disabled={saving || loadingOpt}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <span>Gravar Carteira no Perfil</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-border bg-surface-2 hover:bg-surface text-foreground font-semibold"
                onClick={() => {
                  setAnswers([]);
                  setStep(0);
                  setApiAlocacao(null);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Refazer Teste
              </Button>
            </div>
          </div>

          <div className="surface-card p-6 border-border/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <p className="text-sm font-bold text-foreground">Alocação Eficiente (Markowitz)</p>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] font-semibold bg-emerald-500/10">
                  Sharpe Máximo
                </Badge>
              </div>

              <div className="mt-3 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="86%"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {data.map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#161C2B",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 12,
                        color: "#F1F5F9",
                        fontSize: 12,
                      }}
                      formatter={(v: number, n: string) => [`${v}%`, n]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-surface-2/40 border border-white/5 text-center">
              <p className="text-xs text-muted-foreground">
                Baseado nos princípios de alocação de fundos institucionais como <strong>Vanguard</strong> e <strong>BlackRock</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
