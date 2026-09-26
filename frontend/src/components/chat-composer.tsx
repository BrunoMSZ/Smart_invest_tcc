import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Paperclip, Send, Smile, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppEmojiPicker } from "@/components/whatsapp-emoji-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type ChatAttachment = {
  id: string;
  type: "image" | "file";
  name: string;
  size: number;
  mime: string;
  url: string; // data URL
};

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (payload: { text: string; attachments: ChatAttachment[] }) => void;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
};

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder = "Mensagem",
  disabled,
  sending,
}: ChatComposerProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojiWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emojiOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!emojiWrapRef.current?.contains(e.target as Node)) setEmojiOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [emojiOpen]);

  const insertEmoji = (emoji: string) => {
    onChange(value + emoji);
  };

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const next: ChatAttachment[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`Arquivo muito grande: ${file.name} (máx. 4 MB)`);
        continue;
      }
      const url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      next.push({
        id: `${Date.now()}-${file.name}`,
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
        size: file.size,
        mime: file.type || "application/octet-stream",
        url,
      });
    }
    if (next.length) setAttachments((prev) => [...prev, ...next].slice(0, 6));
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const submit = () => {
    const text = value.trim();
    if ((!text && attachments.length === 0) || disabled || sending) return;
    onSend({ text, attachments });
    onChange("");
    setAttachments([]);
    setEmojiOpen(false);
  };

  return (
    <div className="border-t border-border bg-surface-1 p-3 sm:p-4 space-y-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="relative flex items-center gap-2 rounded-xl border border-border bg-surface-2/80 p-1.5 pr-8 max-w-[220px]"
            >
              {a.type === "image" ? (
                <img src={a.url} alt={a.name} className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{formatBytes(a.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(a.id)}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1.5 sm:gap-2">
        <div ref={emojiWrapRef} className="relative shrink-0">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn("h-10 w-10 rounded-full text-muted-foreground hover:text-primary", emojiOpen && "text-primary")}
            onClick={() => setEmojiOpen((v) => !v)}
            disabled={disabled}
            title="Emojis"
          >
            <Smile className="h-5 w-5" />
          </Button>
          {emojiOpen && (
            <div className="absolute bottom-12 left-0 z-40">
              <WhatsAppEmojiPicker
                onSelect={(emoji) => {
                  insertEmoji(emoji);
                }}
              />
            </div>
          )}
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:text-primary"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          title="Anexar imagem ou arquivo"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar"
          onChange={handleFiles}
        />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="bg-surface-2"
          disabled={disabled}
        />

        <Button
          size="default"
          className="gap-2 font-semibold shrink-0"
          onClick={submit}
          disabled={disabled || sending || (!value.trim() && attachments.length === 0)}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="hidden sm:inline">Enviar</span>
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
        <ImageIcon className="h-3 w-3" />
        Emojis · imagens · PDF e documentos (até 4 MB)
      </p>
    </div>
  );
}

export function ChatAttachmentView({
  attachments,
  inverted,
}: {
  attachments?: ChatAttachment[];
  inverted?: boolean;
}) {
  if (!attachments?.length) return null;
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((a) =>
        a.type === "image" ? (
          <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl">
            <img src={a.url} alt={a.name} className="max-h-56 w-full object-cover" />
          </a>
        ) : (
          <a
            key={a.id}
            href={a.url}
            download={a.name}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
              inverted ? "border-white/20 bg-black/15 text-white" : "border-border bg-surface-1",
            )}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate font-medium">{a.name}</span>
            <span className="ml-auto shrink-0 opacity-70">{formatBytes(a.size)}</span>
          </a>
        ),
      )}
    </div>
  );
}
