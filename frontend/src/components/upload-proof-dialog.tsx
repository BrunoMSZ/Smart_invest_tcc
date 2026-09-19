import { useState } from "react";
import { Upload, ImageUp, CheckCircle2, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function UploadProofDialog({
  trigger,
  onSuccess,
}: {
  trigger?: React.ReactNode;
  onSuccess?: (newPoints?: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [valor, setValor] = useState("");
  const [classe, setClasse] = useState("acoes");
  const [mensagem, setMensagem] = useState(""); // <-- Novo campo para a legenda do usuário
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFileName(uploadedFile.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleEnviar = async () => {
    setLoading(true);
    try {
      const classeNomeMap: Record<string, string> = {
        acoes: "Ações",
        fiis: "Fundos Imobiliários",
        rf: "Renda Fixa",
        etf: "ETFs",
      };
      
      // Se o usuário não digitar nada, usamos o texto padrão. Se digitar, usamos o texto dele!
      const textoPadrao = `Aporte mensal realizado com sucesso no valor de R$ ${valor || "1.500,00"} em ${classeNomeMap[classe]}. Mantendo a consistência rumo à independência financeira! 🚀`;
      const textoFinal = mensagem.trim() !== "" ? mensagem : textoPadrao;

      const res = await api.createPost({
        conteudo: textoFinal,
        tag: "Aporte",
        comprovante: true,
        ...(fileBase64 ? { comprovante_url: fileBase64 } : {}),
      });

      toast.success("Comprovante validado e salvo com sucesso!", {
        description: "+1 ponto e aporte registrado no banco de dados.",
      });

      // Limpa os campos depois de enviar
      setOpen(false);
      setFileName(null);
      setFileBase64(null);
      setMensagem("");
      setValor("");
      
      if (onSuccess) {
        onSuccess(res?.pontos_totais);
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar comprovante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="w-full gap-2 font-semibold gold-glow">
            <Upload className="h-4 w-4" />
            Enviar comprovante
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Comprovante de aporte</DialogTitle>
          <DialogDescription>
            Registre o aporte do mês no banco de dados e ganhe +1 ponto na sua liga.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-surface-2/50 px-4 py-8 text-center transition-colors hover:border-primary/50">
            {fileName ? (
              <>
                <CheckCircle2 className="h-7 w-7 text-success" />
                <p className="text-sm font-medium">{fileName}</p>
                <span className="text-xs text-muted-foreground">Clique para trocar</span>
              </>
            ) : (
              <>
                <ImageUp className="h-7 w-7 text-primary" />
                <p className="text-sm font-medium">Arraste ou selecione a imagem</p>
                <span className="text-xs text-muted-foreground">PNG, JPG ou PDF até 10 MB</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* NOVO CAMPO: MENSAGEM DO USUÁRIO */}
          <div className="space-y-1.5">
            <Label htmlFor="mensagem">O que você quer compartilhar?</Label>
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Ex: Mais um mês comprando cotas de FIIs! Foco no longo prazo..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="valor">Valor aportado</Label>
              <Input
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="R$ 1.500,00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Classe do ativo</Label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acoes">Ações</SelectItem>
                  <SelectItem value="fiis">FIIs</SelectItem>
                  <SelectItem value="rf">Renda Fixa</SelectItem>
                  <SelectItem value="etf">ETFs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              className="flex-1 gap-2"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              className="flex-1 font-semibold"
              onClick={handleEnviar}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Confirmar aporte"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}