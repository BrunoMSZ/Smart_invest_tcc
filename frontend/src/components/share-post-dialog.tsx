import { useState } from "react";
import { Share2, Repeat2, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, type PostItem } from "@/lib/api";
import { cn } from "@/lib/utils";

type SharePostDialogProps = {
  post: PostItem;
  onShared?: () => void;
  defaultTag?: string;
  className?: string;
  iconOnly?: boolean;
};

export function SharePostDialog({
  post,
  onShared,
  defaultTag,
  className,
  iconOnly = false,
}: SharePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [sharing, setSharing] = useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link da publicação copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const shareToFeed = async (withQuote: boolean) => {
    if (sharing) return;
    setSharing(true);
    try {
      await api.sharePost(post.id, {
        comentario: withQuote ? quote.trim() || undefined : undefined,
        tag: defaultTag || post.tag || "Aporte",
      });
      toast.success(withQuote && quote.trim() ? "Compartilhado com comentário!" : "Publicação compartilhada no feed!");
      setQuote("");
      setOpen(false);
      onShared?.();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao compartilhar");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            iconOnly
              ? "grid h-9 w-9 place-items-center text-foreground"
              : "flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-xs transition-colors hover:bg-surface-2 hover:text-primary",
            className,
          )}
        >
          <Share2 className={iconOnly ? "h-6 w-6" : "h-4 w-4"} />
          {iconOnly ? <span className="sr-only">Compartilhar</span> : "Compartilhar"}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border bg-surface text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Compartilhar publicação
          </DialogTitle>
          <DialogDescription>
            Reposte no feed ou copie o link — como em qualquer rede social.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-sm border border-border bg-surface-2/50 p-3">
          <p className="text-xs font-semibold text-foreground">
            {post.author}{" "}
            <span className="font-normal text-muted-foreground">{post.handle}</span>
          </p>
          <p className="mt-1 line-clamp-3 text-sm text-foreground/90 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <Textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Adicione um comentário (opcional)..."
          className="min-h-20 resize-none bg-surface-2/50 border-border"
          maxLength={500}
        />

        <div className="flex flex-col gap-2">
          <Button
            className="w-full gap-2 font-semibold"
            disabled={sharing}
            onClick={() => void shareToFeed(true)}
          >
            {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Repeat2 className="h-4 w-4" />}
            {quote.trim() ? "Compartilhar com comentário" : "Repostar no feed"}
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            disabled={sharing}
            onClick={() => void copyLink()}
          >
            <Link2 className="h-4 w-4" />
            Copiar link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SharedPostEmbed({ post }: { post: PostItem }) {
  return (
    <div className="mt-3 rounded-sm border border-border bg-surface-2/40 p-3">
      <p className="text-xs font-semibold">
        {post.author}{" "}
        <span className="font-normal text-muted-foreground">
          {post.handle} · {post.time}
        </span>
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.content}
      </p>
      {post.proof && post.proof_url ? (
        <div className="mt-2 overflow-hidden rounded-sm border border-border max-h-48">
          <img src={post.proof_url} alt="" className="mx-auto max-h-48 w-full object-contain" />
        </div>
      ) : null}
    </div>
  );
}
