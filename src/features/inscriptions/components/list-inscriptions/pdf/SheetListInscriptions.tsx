"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Switch } from "@/shared/components/ui/switch";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import type { DownloadListInscriptionsPdfInput } from "../../../types/list-inscriptions/pdf/listInscriptionsPdfTypes";

type SheetListInscriptionsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onDownloadPdf: (input: DownloadListInscriptionsPdfInput) => void;
};

export default function SheetListInscriptions({
  open,
  onOpenChange,
  eventId,
  onDownloadPdf,
}: SheetListInscriptionsProps) {
  const [participants, setParticipants] = useState(false);
  const [details, setDetails] = useState(false);
  const [includeNotAllocated, setIncludeNotAllocated] = useState(true);

  const isGuest = useMemo(() => {
    return includeNotAllocated ? undefined : false;
  }, [includeNotAllocated]);

  const handleGenerate = () => {
    onDownloadPdf({
      eventId,
      details,
      participants,
      isGuest,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="border-b">
          <SheetTitle>PDF</SheetTitle>
          <SheetDescription>Lista de inscritos</SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-5">
          <div className="rounded-xl border bg-white/80 dark:bg-gray-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Incluir participantes por inscrição
                </p>
                <p className="text-xs text-muted-foreground">
                  Inclui a lista de participantes dentro de cada inscrição.
                </p>
              </div>
              <Switch
                checked={participants}
                onCheckedChange={(checked) => setParticipants(Boolean(checked))}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 dark:bg-gray-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Incluir detalhes da inscrição
                </p>
                <p className="text-xs text-muted-foreground">
                  Acrescenta detalhes referentes às inscrições no PDF.
                </p>
              </div>
              <Switch
                checked={details}
                onCheckedChange={(checked) => setDetails(Boolean(checked))}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 dark:bg-gray-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Incluir inscrições não alocadas
                </p>
                <p className="text-xs text-muted-foreground">
                  Inclui participantes marcados como N/ Alocado.
                </p>
              </div>
              <Switch
                checked={includeNotAllocated}
                onCheckedChange={(checked) =>
                  setIncludeNotAllocated(Boolean(checked))
                }
              />
            </div>
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button
            type="button"
            className="w-full flex items-center gap-2"
            onClick={handleGenerate}
          >
            <Download className="h-4 w-4" />
            Gerar PDF
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
