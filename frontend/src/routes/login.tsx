import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Lock, Mail, User, DollarSign, Calendar, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, setStoredToken } from "@/lib/api";
import { toast } from "sonner";
import logoImg from "@/assets/logo_smartInvest.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acessar · SmartInvest AI" },
      {
        name: "description",
        content: "Acesse sua conta no SmartInvest AI ou crie um novo perfil para acompanhar seus investimentos.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  // Estados de Cadastro
  const [regNome, setRegNome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regIdade, setRegIdade] = useState("");
  const [regRenda, setRegRenda] = useState("");
  const [regPerfil, setRegPerfil] = useState("conservador");

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customSenha?: string) => {
    if (e) e.preventDefault();
    const email = customEmail || loginEmail;
    const senha = customSenha || loginSenha;

    if (!email || !senha) {
      toast.error("Por favor, preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email.trim(), senha);
      if (res.status === "novo_cliente") {
        toast.info("E-mail não encontrado. Redirecionando para cadastro...");
        setRegEmail(email);
        setTab("register");
        return;
      }

      if (res.token) {
        setStoredToken(res.token);
        localStorage.setItem("auth_token", res.token); 
      } else {
        localStorage.setItem("auth_token", "mock_logado");
      }

      const tempoExpiracao = new Date().getTime() + (60 * 60 * 1000); //1 hour
      localStorage.setItem("auth_expires_at", tempoExpiracao.toString());

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo de volta, ${res.usuario?.name || "Investidor"}!`,
      });

      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao realizar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNome.trim() || !regEmail.trim() || !regSenha.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        nome: regNome.trim(),
        email: regEmail.trim(),
        senha: regSenha,
        idade: parseInt(regIdade) || 30,
        renda_mensal: parseFloat(regRenda) || 5000,
        perfil_investidor: regPerfil,
      });

      if (res.token) {
        setStoredToken(res.token);
        localStorage.setItem("auth_token", res.token); 
      } else {
        localStorage.setItem("auth_token", "mock_logado");
      }

      const tempoExpiracao = new Date().getTime() + (60 * 60 * 1000); // 1hour
      localStorage.setItem("auth_expires_at", tempoExpiracao.toString());

      toast.success("Conta criada!", {
        description: `Olá, ${res.usuario?.name || "Investidor"}! Perfil configurado como ${res.usuario?.perfil_investidor || regPerfil}. Vamos seguir para o questionário...`,
      });

      navigate({ to : "/questionario" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar usuário. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background glow Liquid style */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header com Logo Liquid */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <img src="/logo.png" alt="Liquid Invest Logo" className="h-24 w-24 object-contain drop-shadow-[0_0_25px_rgba(252,91,63,0.35)] hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">LIQUID</span>
            <span className="text-3xl font-black text-primary">INVEST</span>
          </div>
          <p className="mt-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Fintech Quantitativa & Rede Social B3
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-white/5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ref. Institucional: BlackRock · Vanguard · Berkshire · BTG · XP</span>
          </div>
        </div>

        {/* Card Principal Liquid Style */}
        <div className="surface-card liquid-glow p-6 sm:p-8 border-border/80">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-surface-2/60 border border-border p-1">
              <TabsTrigger value="login" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                Criar Conta
              </TabsTrigger>
            </TabsList>

            {/* ABA 1: LOGIN */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email_login">E-mail</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email_login"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha_login">Senha</Label>
                    <span className="text-[11px] text-muted-foreground"></span>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="senha_login"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full font-bold gap-2 bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  <span>{loading ? "Entrando..." : "Acessar Plataforma"}</span>
                </Button>
              </form>
            </TabsContent>

            {/* ABA 2: CADASTRO */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="reg_nome">Nome Completo</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="reg_nome"
                      required
                      placeholder="Ex: João da Silva"
                      value={regNome}
                      onChange={(e) => setRegNome(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg_email">E-mail</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="reg_email"
                      type="email"
                      required
                      placeholder="joao@exemplo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg_senha">Senha</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="reg_senha"
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={regSenha}
                      onChange={(e) => setRegSenha(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg_idade">Idade</Label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reg_idade"
                        type="number"
                        min={18}
                        max={100}
                        value={regIdade}
                        onChange={(e) => setRegIdade(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg_renda">Renda Mensal (R$)</Label>
                    <div className="relative">
                      <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reg_renda"
                        type="number"
                        value={regRenda}
                        onChange={(e) => setRegRenda(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Perfil de Investimento Inicial</Label>
                  <Select value={regPerfil} onValueChange={setRegPerfil}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservador">Conservador (Títulos / Selic)</SelectItem>
                      <SelectItem value="moderado">Moderado (Equilibrado / FIIs)</SelectItem>
                      <SelectItem value="arrojado">Arrojado (Ações / Renda Variável)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full font-bold gap-2 mt-4 bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>{loading ? "Cadastrando..." : "Criar Conta na Liquid Invest"}</span>
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{new Date().getFullYear()} Liquid Invest · Plataforma Quantitativa & Social B3.</span>
        </div>
      </div>
    </div>
  );
}
