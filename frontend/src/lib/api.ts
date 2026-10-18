export function getApiBase(): string {
  if (typeof window === "undefined") return "http://localhost:8000";
  const host = window.location.hostname;
  if (!host || host === "localhost" || host === "127.0.0.1") return "http://localhost:8000";
  return `http://${host}:8000`;
}
const TOKEN_KEY = "auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem("smartinvest_token");
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("smartinvest_token");
  localStorage.removeItem("auth_expires_at");
}

export type UserProfile = {
  id?: number;
  name: string;
  email?: string;
  handle?: string;
  initials?: string;
  perfil_investidor?: string;
  renda_mensal?: number;
  idade?: number;
  patrimonio_estimado?: number;
  avatar_url?: string | null;
  capa_url?: string | null;
  bio?: string | null;
  presenca?: string | null;
  points?: number;
  level?: number;
  levelName?: string;
  streak?: number;
  nextLevelAt?: number;
  badge?: string;
  data_cadastro?: string;
  configuracoes?: {
    notificacoes_email?: boolean;
    alertas_volatilidade?: boolean;
  };
};

export type MarketTickerItem = {
  symbol: string;
  value: string;
  change: string;
  up: boolean;
};

export type PostItem = {
  id: string;
  user_id?: number | null;
  author: string;
  author_avatar?: string | null;
  is_following?: boolean;
  initials: string;
  handle: string;
  time: string;
  badge?: string;
  content: string;
  proof?: boolean;
  proof_url?: string | null;
  likes: number;
  comments: number;
  tag?: string;
  shared_from_post_id?: number | null;
  shared_post?: PostItem | null;
};

export type UserRankingItem = {
  pos: number;
  name: string;
  initials: string;
  points: number;
  streak: number;
  badge: string;
  level?: number;
};

export type StockRankingItem = {
  ticker: string;
  nome: string;
  setor: string;
  preco: number;
  score_final: number;
  prob_ml?: number;
  decisao: string;
  tendencia?: string;
  sentimento_score?: number;
};

export type GroupItem = {
  id: string;
  name: string;
  description?: string;
  members: number;
  aportes: number;
  you: number;
  inviteCode?: string;
  meta?: number;
};

export type GroupMessageItem = {
  id: number;
  from: string;
  initials: string;
  mine: boolean;
  text: string;
  time: string;
};

type ApiErrorBody = {
  detail?: string | { msg?: string }[];
  message?: string;
};

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg;
    if (body.message) return body.message;
  } catch {
  }
  return res.statusText || `Erro HTTP ${res.status}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const api = {
  async login(email: string, senha: string) {
    return request<{
      status: string;
      message?: string;
      token?: string;
      usuario?: UserProfile;
    }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      },
      false,
    );
  },

  async recoverPassword(email: string, nova_senha: string) {
    return request<{ status: string; message?: string }>(
      "/api/auth/recover",
      {
        method: "POST",
        body: JSON.stringify({ email, nova_senha }),
      },
      false,
    );
  },

  async register(payload: {
    nome: string;
    email: string;
    senha: string;
    idade?: number;
    renda_mensal?: number;
    perfil_investidor?: string;
  }) {
    return request<{
      status: string;
      message?: string;
      token?: string;
      usuario?: UserProfile;
    }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    );
  },

  async getProfile() {
    return request<{ status: string; dados: UserProfile }>("/api/profile");
  },

  async updateProfile(payload: {
    name?: string;
    nome?: string;
    handle?: string;
    idade?: number;
    renda_mensal?: number;
    perfil_investidor?: string;
    patrimonio_estimado?: number;
    bio?: string | null;
    avatar_url?: string | null;
    capa_url?: string | null;
    presenca?: string;
    notificacoes_email?: boolean;
    alertas_volatilidade?: boolean;
  }) {
    const body = {
      ...payload,
      nome: payload.nome ?? payload.name,
    };
    delete (body as { name?: string }).name;

    return request<{ status: string; message?: string; dados: UserProfile }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async getNotifications() {
    return request<{
      unread: number;
      itens: Array<{
        id: number;
        tipo: string;
        texto: string;
        post_id?: number | null;
        lida: boolean;
        time: string;
        actor_id: number;
        actor_nome: string;
        actor_handle: string;
        actor_initials: string;
        actor_avatar?: string | null;
      }>;
    }>("/api/notifications");
  },

  async markNotificationsRead() {
    return request<{ status: string }>("/api/notifications/read", { method: "POST" });
  },

  async getMarketTicker() {
    return request<MarketTickerItem[]>("/api/market/ticker", {}, false);
  },

  async getNews(ticker?: string, limit: number = 15) {
    const query = new URLSearchParams();
    if (ticker) query.set("ticker", ticker);
    if (limit) query.set("limit", String(limit));
    const qs = query.toString();
    return request<Array<{
      id: string;
      titulo: string;
      summary: string;
      fonte: string;
      data: string;
      sentiment: "Positivo" | "Neutro" | "Negativo";
      sentiment_score: number;
      link: string;
    }>>(`/api/news${qs ? `?${qs}` : ""}`, {}, false);
  },

  async getHomeDashboard() {
    return request<{
      status?: string;
      acoes_em_alta?: Array<{
        ticker: string;
        nome?: string;
        setor?: string;
        preco?: number;
        alta?: number;
        decisao?: string;
        score?: number;
      }>;
      noticias_destaque?: unknown[];
      resumo_mercado?: Record<string, unknown>;
      usuario_logado?: UserProfile | null;
    }>("/api/home");
  },

  async getPosts() {
    return request<PostItem[]>("/api/posts");
  },

  async createPost(payload: {
    conteudo: string;
    tag?: string;
    comprovante?: boolean;
    comprovante_url?: string;
    shared_from_post_id?: number;
  }) {
    return request<{
      status: string;
      message?: string;
      post_id?: number;
      pontos_totais?: number;
      post?: PostItem;
    }>("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async sharePost(postId: string, payload?: { comentario?: string; tag?: string }) {
    const id = parseInt(postId, 10);
    return request<{
      status: string;
      message?: string;
      post_id?: number;
      post?: PostItem;
    }>(`/api/posts/${id}/share`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    });
  },

  async toggleLikePost(postId: string) {
    const id = parseInt(postId, 10);
    return request<{ status: string; likes: number; liked: boolean }>(
      `/api/posts/${id}/like`,
      { method: "POST" },
    );
  },

  async deletePost(postId: string) {
    const id = parseInt(postId, 10);
    return request<{ status: string; message?: string }>(`/api/posts/${id}`, {
      method: "DELETE",
    });
  },

  async getComments(postId: string) {
    const id = parseInt(postId, 10);
    return request<
      Array<{
        id: number;
        user_id?: number | null;
        autor_nome: string;
        autor_initials: string;
        autor_avatar?: string | null;
        conteudo: string;
        parent_id?: number | null;
        time?: string;
        likes?: number;
        liked?: boolean;
      }>
    >(`/api/posts/${id}/comments`);
  },

  async toggleCommentLike(postId: string, commentId: number) {
    const id = parseInt(postId, 10);
    return request<{ status: string; likes: number; liked: boolean }>(
      `/api/posts/${id}/comments/${commentId}/like`,
      { method: "POST" },
    );
  },

  async updateComment(postId: string, commentId: number, conteudo: string) {
    const id = parseInt(postId, 10);
    return request<{ status: string; conteudo: string }>(
      `/api/posts/${id}/comments/${commentId}`,
      { method: "PUT", body: JSON.stringify({ conteudo }) },
    );
  },

  async deleteComment(postId: string, commentId: number) {
    const id = parseInt(postId, 10);
    return request<{ status: string }>(`/api/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  async getPublicProfile(userId: number) {
    return request<{
      dados: {
        id: number;
        name: string;
        handle: string;
        initials: string;
        avatar_url: string | null;
        capa_url?: string | null;
        bio: string | null;
        perfil_investidor: string | null;
        level?: number;
        levelName?: string;
        points?: number;
        badge?: string;
        presenca?: string | null;
        email?: string | null;
        idade?: number | null;
        renda_mensal?: number | null;
        seguidores: number;
        seguindo: number;
        is_following: boolean;
        is_me: boolean;
      };
    }>(`/api/users/${userId}`);
  },

  async toggleFollow(userId: number) {
    return request<{ status: string; following: boolean; seguidores: number }>(
      `/api/users/${userId}/follow`,
      { method: "POST" },
    );
  },

  async addComment(postId: string, conteudo: string, parentId?: number | null) {
    const id = parseInt(postId, 10);
    return request<{ status: string; comments_count?: number }>(
      `/api/posts/${id}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          conteudo,
          ...(parentId ? { parent_id: parentId } : {}),
        }),
      },
    );
  },

  async getUserRanking() {
    return request<UserRankingItem[]>("/api/ranking/users");
  },

  async getStockRanking(topN = 10) {
    return request<StockRankingItem[]>(`/api/ranking?top_n=${topN}`);
  },

  async getStocks(params?: { limit?: number; search?: string; classe?: string }) {
    const qs = new URLSearchParams();
    if (params?.limit != null) qs.set("limit", String(params.limit));
    if (params?.search) qs.set("search", params.search);
    if (params?.classe) qs.set("classe", params.classe);
    const query = qs.toString();
    return request<
      Array<{
        ticker: string;
        nome?: string;
        setor?: string;
        classe?: string;
        preco?: number;
        price?: number;
        change?: number;
      }>
    >(`/api/stocks${query ? `?${query}` : ""}`, {}, false);
  },

  async getGroups() {
    return request<GroupItem[]>("/api/groups");
  },

  async createGroup(payload: {
    nome: string;
    descricao?: string | undefined;
    meta_mensal?: number;
    privado?: boolean;
  }) {
    const body: Record<string, unknown> = {
      nome: payload.nome,
      meta_mensal: payload.meta_mensal,
      privado: payload.privado,
    };
    if (payload.descricao != null && payload.descricao !== "") {
      body["descricao"] = payload.descricao;
    }
    return request<{
      status: string;
      grupo?: { id: string; name: string; inviteCode?: string };
    }>("/api/groups", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async joinGroup(codigo: string) {
    return request<{
      status: string;
      message?: string;
      grupo?: GroupItem;
    }>("/api/groups/join", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    });
  },

  async recordGroupAporte(grupoId: string) {
    return request<{
      status: string;
      message?: string;
      aportes?: number;
      members?: number;
    }>(`/api/groups/${encodeURIComponent(grupoId)}/aporte`, { method: "POST" });
  },

  async getGroupMessages(grupoId: string) {
    return request<GroupMessageItem[]>(
      `/api/groups/${encodeURIComponent(grupoId)}/messages`,
    );
  },

  async sendGroupMessage(grupoId: string, mensagem: string) {
    return request<{ status: string; mensagem: GroupMessageItem }>(
      `/api/groups/${encodeURIComponent(grupoId)}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ mensagem }),
      },
    );
  },

  async getChatHistory(limit = 30) {
    return request<
      Array<{
        id: number;
        role: string;
        content: string;
        model_used?: string | null;
        created_at?: string;
      }>
    >(`/api/chat/history?limit=${limit}`);
  },

  async sendChatMessage(
    message: string,
    history: Array<{ role: string; content: string }> = [],
  ) {
    return request<{
      response: string;
      model_used?: string | null;
      success?: boolean;
      notice?: string | null;
    }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  },

  async enviarQuestionario(payload: {
    idade: number;
    renda_mensal: number;
    respostas_risco: number;
    profile_override?: string;
  }) {
    return request<{
      perfil: string;
      nome_perfil: string;
      descricao: string;
      volatilidade_maxima: number;
      alocacao: Array<{ name: string; value: number; classe?: string }>;
    }>("/api/questionario", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async optimizeSmartInvest(payload: {
    age: number;
    income: number;
    risk_tolerance: number;
    profile_override?: string;
  }) {
    return request<{
      perfil: string;
      nome_perfil: string;
      descricao: string;
      volatilidade_maxima: number;
      alocacao: Array<{ name: string; value: number; classe?: string }>;
    }>("/api/smart-invest/optimize", {
      method: "POST",
      body: JSON.stringify({
        idade: payload.age,
        renda_mensal: payload.income,
        respostas_risco: payload.risk_tolerance,
        profile_override: payload.profile_override,
      }),
    });
  },

  async saveCarteiraItem(item: {
    ticker: string;
    nome?: string;
    classe?: string;
    percentual?: number;
    preco_medio?: number;
    quantidade?: number;
    valor_alocado?: number;
  }) {
    return request<{ status: string; item_id?: number }>("/api/user/carteira", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },
};
