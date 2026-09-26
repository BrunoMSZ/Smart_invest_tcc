import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type NotificacaoItem = {
  id: number;
  tipo: string;
  texto: string;
  post_id?: number | null;
  lida: boolean;
  time: string;
  actor_id: number;
  actor_nome: string;
  actor_initials: string;
  actor_avatar?: string | null;
};

export function NotificationsMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [itens, setItens] = useState<NotificacaoItem[]>([]);

  const carregar = async () => {
    try {
      const res = await api.getNotifications();
      setUnread(res.unread || 0);
      setItens(res.itens || []);
      return res.unread || 0;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    void carregar();
    const timer = window.setInterval(() => void carregar(), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const abrir = async () => {
    const next = !open;
    setOpen(next);
    if (!next) return;
    const pendentes = await carregar();
    if (pendentes > 0) {
      try {
        await api.markNotificationsRead();
        setUnread(0);
        setItens((lista) => lista.map((item) => ({ ...item, lida: true })));
      } catch {
        /* ignore */
      }
    }
  };

  const abrirItem = (item: NotificacaoItem) => {
    setOpen(false);
    if (item.tipo === "seguir" || !item.post_id) {
      void navigate({ to: "/u/$userId", params: { userId: String(item.actor_id) } });
      return;
    }
    sessionStorage.setItem("smartinvest_open_post", String(item.post_id));
    if (window.location.pathname === "/") {
      window.dispatchEvent(new Event("smartinvest:open-post"));
      return;
    }
    void navigate({ to: "/" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void abrir()}
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/40 hover:bg-surface-2 hover:text-foreground"
        title="Notificações"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Fechar notificações" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-sm border border-border bg-surface shadow-2xl">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Notificações</p>
            </div>
            <ul className="max-h-[70vh] overflow-y-auto">
              {itens.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma notificação ainda.</li>
              ) : (
                itens.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => abrirItem(item)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-2",
                        !item.lida && "bg-primary/5",
                      )}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-[10px] font-bold">
                        {item.actor_avatar ? (
                          <img src={item.actor_avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          item.actor_initials
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug">
                          <strong className="font-semibold">{item.actor_nome}</strong> {item.texto}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">{item.time}</span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
