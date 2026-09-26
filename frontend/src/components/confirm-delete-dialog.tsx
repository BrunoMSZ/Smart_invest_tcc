import { Loader2, Trash2 } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  confirming,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && !confirming && onCancel()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-white/10 bg-[#121622]/95 p-6 text-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/15 text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <DialogPrimitive.Title className="mt-4 text-center text-lg font-bold">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-center text-sm text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={confirming}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-semibold"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Excluir
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
