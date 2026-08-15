"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle2, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TicketStatus } from "@/generated/prisma/client";

interface ParticipantTicketActionProps {
  participantId: number;
  phone: string;
  ticket: {
    uuid: string;
    status: TicketStatus;
    whatsappUrl: string | null;
  } | null;
  showWhatsApp?: boolean;
  onTicketGenerated?: (participantId: number, ticket: { id: number; uuid: string; status: TicketStatus; whatsappUrl: string | null }) => void;
}

export function ParticipantTicketAction({ participantId, phone, ticket, showWhatsApp = true, onTicketGenerated }: ParticipantTicketActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGenerated = ticket?.status === "GENERATED";
  const isSent = ticket?.status === "SENT";
  const whatsappUrl = ticket?.whatsappUrl ?? null;
  const hasTicket = Boolean(ticket?.uuid);

  async function handleGenerate() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/generate-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId,
          phone,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Error generando la entrada.");
      }

      const payload = await response.json().catch(() => null);
      if (payload?.ticket) {
        // Inform parent so both desktop and mobile instances update from the same source of truth
        onTicketGenerated?.(participantId, payload.ticket);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error generando la entrada.");
    } finally {
      setIsLoading(false);
    }
  }

  function confirmGenerate() {
    Swal.fire({
      title: "¿El participante ya realizó el pago?",
      text: "Confirma antes de generar la entrada.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, generar entrada",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) handleGenerate();
    });
  }

  async function handleDownload() {
    if (!ticket?.uuid) return;
    try {
      const res = await fetch(`/api/tickets/${ticket.uuid}`);
      if (!res.ok) throw new Error("No se pudo descargar el ticket.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${ticket.uuid}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error descargando ticket");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {isSent ? (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-emerald-900">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-semibold">Enviado</span>
        </div>
      ) : isGenerated ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-amber-900 text-xs font-semibold">
          Generado
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs text-slate-700">
          Sin ticket
        </div>
      )}

      {!hasTicket ? (
        <Button
          className="w-full"
          disabled={isLoading || isSent}
          onClick={confirmGenerate}
          size="sm"
        >
          {isLoading ? "Generando..." : isSent ? "Listo" : "Generar ticket"}
        </Button>
      ) : null}

      

      {hasTicket ? (
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleDownload}>Descargar ticket</Button>
          { showWhatsApp && (ticket?.whatsappUrl) ? (
            <a href={(ticket?.whatsappUrl) as string} target="_blank" rel="noreferrer noopener" className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto">Enviar WhatsApp</Button>
            </a>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
