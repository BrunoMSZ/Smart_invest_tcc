export type Sentiment = "Positivo" | "Neutro" | "Negativo";

export const currentUser = {
  id: 1,
  name: "Rafael Duarte",
  email: "rafael@aporta.com",
  handle: "@rafaelduarte",
  initials: "RD",
  perfil_investidor: "moderado",
  renda_mensal: 6500,
  idade: 32,
  patrimonio_estimado: 85000,
  avatar_url: null,
  bio: null,
  points: 34,
  level: 6,
  levelName: "Investidor Consistente",
  streak: 8,
  nextLevelAt: 40,
  badge: "Prata",
  data_cadastro: "2024-03-15",
  configuracoes: {
    notificacoes_email: true,
    alertas_volatilidade: true,
  },
};

export const ranking = [
  { pos: 1, name: "Marina Costa", initials: "MC", points: 58, streak: 11, badge: "Ouro", level: 8 },
  { pos: 2, name: "Caio Menezes", initials: "CM", points: 52, streak: 9, badge: "Ouro", level: 7 },
  { pos: 3, name: "Rafael Duarte", initials: "RD", points: 34, streak: 8, badge: "Prata", level: 6 },
  { pos: 4, name: "Bruno Alves", initials: "BA", points: 28, streak: 6, badge: "Bronze", level: 5 },
  { pos: 5, name: "Juliana Prado", initials: "JP", points: 22, streak: 4, badge: "Bronze", level: 4 },
];

export const badges = [
  { name: "Primeiro Aporte", desc: "Registrou o primeiro comprovante verificado", earned: true },
  { name: "Sequência de 3 Meses", desc: "Três aportes consecutivos auditados", earned: true },
  { name: "Analista Ativo", desc: "Publicou 5 teses no feed da comunidade", earned: true },
  { name: "Liga Campeã", desc: "Top 3 no ranking mensal da liga", earned: false },
  { name: "Mestre Markowitz", desc: "Simulou e gravou uma carteira otimizada", earned: false },
  { name: "Guardião da Disciplina", desc: "12 meses de aportes sem falhar", earned: false },
];

export const assets = [
  { ticker: "PETR4", name: "Petrobras PN", price: 38.5, change: 1.85, sector: "Petróleo e Gás", classe: "Ações B3" },
  { ticker: "VALE3", name: "Vale ON", price: 62.1, change: -0.4, sector: "Mineração", classe: "Ações B3" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", price: 34.2, change: 1.1, sector: "Bancos", classe: "Ações B3" },
  { ticker: "BBAS3", name: "Banco do Brasil ON", price: 27.8, change: 1.45, sector: "Bancos", classe: "Ações B3" },
  { ticker: "WEGE3", name: "WEG ON", price: 52.1, change: -0.8, sector: "Bens Industriais", classe: "Ações B3" },
  { ticker: "HGLG11", name: "CSHG Logística FII", price: 163.4, change: 0.28, sector: "FII Logístico", classe: "FIIs" },
  { ticker: "KNIP11", name: "Kinea Índice de Preços FII", price: 92.5, change: 0.15, sector: "FII Papel", classe: "FIIs" },
  { ticker: "BOVA11", name: "iShares Ibovespa ETF", price: 170.8, change: 0.61, sector: "ETF", classe: "ETFs" },
];

export const groups = [
  {
    id: "g1",
    name: "Liga Renda Passiva",
    description: "FIIs, dividendos e disciplina mensal",
    members: 12,
    aportes: 9,
    you: 2,
    inviteCode: "liga-renda-passiva-8FQ2",
    meta: 500,
  },
  {
    id: "g2",
    name: "Clube Ações Tech B3",
    description: "Small caps e growth com teses de IA",
    members: 8,
    aportes: 6,
    you: 1,
    inviteCode: "clube-tech-b3-a1b2",
    meta: 800,
  },
];

export const chats = [
  {
    id: "c1",
    name: "Liga Renda Passiva",
    initials: "LR",
    last: "Meu aporte de R$ 500 já está lançado!",
    time: "09:40",
    unread: 2,
    group: true,
  },
  {
    id: "c2",
    name: "Marina Costa",
    initials: "MC",
    last: "Te mandei o print do FII no grupo!",
    time: "08:12",
    unread: 0,
    group: false,
  },
  {
    id: "c3",
    name: "Caio Menezes",
    initials: "CM",
    last: "Vale acompanhar o guidance divulgado no 3T!",
    time: "Ontem",
    unread: 1,
    group: false,
  },
  {
    id: "c4",
    name: "Bruno Alves",
    initials: "BA",
    last: "Tamo junto! Para horizonte longo faz sentido.",
    time: "Ter",
    unread: 0,
    group: false,
  },
];

export const messages = [
  { id: "c1-1", from: "Marina Costa", mine: false, text: "Fala pessoal! Bora manter o foco nos aportes deste mês 🚀", time: "09:30" },
  { id: "c1-2", from: "Caio Menezes", mine: false, text: "Show! Já aloquei em KNIP11 e HGLG11.", time: "09:34" },
  { id: "c1-3", from: "me", mine: true, text: "Meu aporte de R$ 500 em FIIs de tijolo já tá lançado! 📈", time: "09:40" },
];

export const news: Array<{
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: Sentiment;
  summary: string;
}> = [
  {
    id: "n1",
    title: "Ibovespa fecha em alta com commodities e bancos puxando o índice",
    source: "Valor Econômico",
    time: "Hoje",
    sentiment: "Positivo",
    summary: "Mercado reage positivamente a dados de inflação e fluxo estrangeiro.",
  },
  {
    id: "n2",
    title: "Petrobras mantém política de dividendos sob debate regulatório",
    source: "Reuters",
    time: "Hoje",
    sentiment: "Neutro",
    summary: "Investidores aguardam detalhes sobre distribuição e capex.",
  },
  {
    id: "n3",
    title: "Setor de varejo registra pressão de margens no trimestre",
    source: "InfoMoney",
    time: "Ontem",
    sentiment: "Negativo",
    summary: "Custos financeiros e concorrência pesam nos resultados.",
  },
];

export const portfolios = {
  conservador: [
    { name: "Renda Fixa (CDI / Selic)", value: 70, classe: "Renda Fixa" },
    { name: "Fundos Imobiliários (FIIs)", value: 15, classe: "FII" },
    { name: "Ações Nacionais (B3)", value: 10, classe: "Ação" },
    { name: "ETFs / Diversificação", value: 5, classe: "ETF" },
  ],
  moderado: [
    { name: "Renda Fixa (CDI / Tesouro)", value: 45, classe: "Renda Fixa" },
    { name: "Ações Nacionais (B3)", value: 25, classe: "Ação" },
    { name: "Fundos Imobiliários (FIIs)", value: 18, classe: "FII" },
    { name: "ETFs Globais / S&P 500", value: 12, classe: "ETF" },
  ],
  arrojado: [
    { name: "Ações Nacionais (B3)", value: 45, classe: "Ação" },
    { name: "ETFs Globais (IVVB11)", value: 25, classe: "ETF" },
    { name: "Fundos Imobiliários (FIIs)", value: 18, classe: "FII" },
    { name: "Renda Fixa / Caixa de Oportunidade", value: 12, classe: "Renda Fixa" },
  ],
};

export const priceSeries = [
  { d: "01/08", p: 36.2 },
  { d: "08/08", p: 36.8 },
  { d: "15/08", p: 37.1 },
  { d: "22/08", p: 36.5 },
  { d: "29/08", p: 37.4 },
  { d: "05/09", p: 38.0 },
  { d: "12/09", p: 38.5 },
];
