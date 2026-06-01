import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { ReactNode } from "react";

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
}

export function RoomDialog({ open, onOpenChange, title, eyebrow, description, children }: RoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md border-[var(--brass)]/30 bg-card/95 backdrop-blur-xl text-foreground shadow-2xl"
        style={{
          boxShadow:
            "0 30px 80px -20px color-mix(in oklab, var(--crimson) 40%, transparent), 0 0 0 1px color-mix(in oklab, var(--brass) 25%, transparent)",
        }}
      >
        <DialogHeader className="text-left">
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--brass)]">
              {eyebrow}
            </p>
          )}
          <DialogTitle className="font-display text-3xl font-medium text-foreground text-glow">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
