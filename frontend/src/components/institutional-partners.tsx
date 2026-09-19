import { Building2, ShieldCheck, Award, TrendingUp } from "lucide-react";

export interface FirmInfo {
  name: string;
  tag: string;
  badge: string;
  highlight: string;
}

export const famousFirms: FirmInfo[] = [
  {
    name: "BlackRock",
    tag: "Maior Gestora Global",
    badge: "US$ 10 Tri AUM",
    highlight: "Modelos de Risco Aladdin & iShares",
  },
  {
    name: "Vanguard",
    tag: "Pioneira em ETFs & Alocação",
    badge: "Bogleheads Benchmark",
    highlight: "Filosofia Passiva de Baixo Custo",
  },
  {
    name: "Berkshire Hathaway",
    tag: "Value Investing Clássico",
    badge: "Buffett & Munger",
    highlight: "Foco em Moats Econômicos",
  },
  {
    name: "Goldman Sachs",
    tag: "Research Quantitativo",
    badge: "Global Asset Mgmt",
    highlight: "Estratégias Macro & Equities",
  },
  {
    name: "BTG Pactual",
    tag: "Líder LatAm",
    badge: "Investment Banking",
    highlight: "Mesa de Operações & Renda Fixa",
  },
  {
    name: "XP Investimentos",
    tag: "Ecossistema B3",
    badge: "Líder de Varejo B3",
    highlight: "Acesso Amplo ao Mercado Brasileiro",
  },
  {
    name: "B3 (Bolsa do Brasil)",
    tag: "Infraestrutura Oficial",
    badge: "Regulada CVM",
    highlight: "Ibovespa, IFIX & Ações Listadas",
  },
  {
    name: "Itaú BBA",
    tag: "Institucional",
    badge: "Corporate & Investment",
    highlight: "Cobertura de Ações & Valuation",
  },
];

export function InstitutionalPartnersBanner() {
  return (
    <div className="surface-card p-4 sm:p-5 overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Referências & Metodologias Institucionais
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> Padrão CVM & B3
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Nossos algoritmos de Markowitz, K-Means e Machine Learning são calibrados seguindo as melhores práticas das maiores gestoras e bancos de investimento do mundo.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            Wall St & Faria Lima
          </span>
        </div>
      </div>

      {/* Grid de Empresas Famosas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {famousFirms.map((firm, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl border border-white/5 bg-[#0D1119] p-3 transition-all duration-200 hover:border-primary/40 hover:bg-[#131924] hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                {firm.name}
              </span>
              <span className="text-[10px] font-bold text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded">
                {firm.badge}
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-1 truncate">
              {firm.tag}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 truncate flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-emerald-400" />
              {firm.highlight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
