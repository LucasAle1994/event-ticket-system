"use client";

import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import type { TicketStatus } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { ParticipantTicketAction } from "./participant-ticket-action";

interface Ticket { id: number; uuid: string; status: TicketStatus; whatsappUrl: string | null }
interface Participant {
  id: number;
  uuid: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  // formatted strings (server-side)
  birthDate: string;
  createdAt: string;
  // original ISO for sorting
  createdAtIso: string;
  birthDateIso?: string;
  ticket: Ticket | null;
}

export default function AdminDashboard({ participants }: { participants: Participant[] }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Participant[]>(participants);

  // Filter by name
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items;
    if (q) {
      list = list.filter(p => p.fullName.toLowerCase().includes(q));
    }
    // Order: without ticket first, then with ticket; within groups, newest first
    list = list.slice().sort((a,b) => {
      const aHas = !!a.ticket;
      const bHas = !!b.ticket;
      if (aHas === bHas) return new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime();
      return aHas ? 1 : -1;
    });
    return list;
  }, [query, items]);

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "¿Eliminar participante?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/participants/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      Swal.fire({ title: "Error", text: "Error eliminando participante", icon: "error" });
    }
  }

  return (
    <div className="box-border w-full min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 border-b border-border">
        <div className="w-full sm:max-w-[60%] min-w-0">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="🔍 Buscar participante..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => alert('Escáner próximamente.')}>📷 Escanear ticket</Button>
        </div>
      </div>

      <div className="hidden md:block w-full overflow-hidden">
        <table className="table-fixed w-full text-left text-sm">
          <thead className="bg-background/60 text-muted-foreground uppercase tracking-[0.08em]">
            <tr>
              <th className="px-3 py-2 font-medium" style={{ width: '5%' }}>ID</th>
              <th className="px-3 py-2 font-medium" style={{ width: '13%' }}>Nombre</th>
              <th className="px-3 py-2 font-medium" style={{ width: '16%' }}>Email</th>
              <th className="px-3 py-2 font-medium" style={{ width: '12%' }}>Celular</th>
              <th className="px-3 py-2 font-medium" style={{ width: '13%' }}>Dirección</th>
              <th className="px-3 py-2 font-medium" style={{ width: '9%' }}>Nacimiento</th>
              <th className="px-3 py-2 font-medium" style={{ width: '12%' }}>Registro</th>
              <th className="px-3 py-2 font-medium" style={{ width: '19%' }}>Ticket / Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((participant) => (
              <tr key={participant.id} className="border-border border-t align-top">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground" style={{ width: '5%' }}>{participant.id}</td>
                <td className="px-3 py-2" style={{ width: '13%' }}>
                  <div className="font-medium truncate">{participant.fullName}</div>
                </td>
                <td className="px-3 py-2 truncate" style={{ width: '17%' }}>{participant.email}</td>
                <td className="px-3 py-2 truncate" style={{ width: '12%' }}>{participant.phone}</td>
                <td className="px-3 py-2 truncate" style={{ width: '14%' }}>{participant.address}</td>
                <td className="px-3 py-2" style={{ width: '9%' }}>{participant.birthDate}</td>
                <td className="px-3 py-2" style={{ width: '12%' }}>{participant.createdAt}</td>
                <td className="px-3 py-2" style={{ width: '20%' }}>
                  <div className="flex flex-col gap-2">
                    <ParticipantTicketAction participantId={participant.id} phone={participant.phone} ticket={participant.ticket} showWhatsApp={false} onTicketGenerated={(id, t) => setItems(items.map(i => i.id === id ? { ...i, ticket: t } : i))} />
                    <div>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(participant.id)}>Eliminar</Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="box-border block w-full min-w-0 max-w-full space-y-4 px-2 py-3 md:hidden">
        {filtered.map((p) => (
          <div key={p.id}className="box-border w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{p.fullName}</div>
                <div className="text-xs text-muted-foreground truncate">{p.email}</div>
                <div className="text-xs text-muted-foreground truncate">{p.phone}</div>
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                ID {p.id}
              </div>
            </div>
            <div className="mt-3 min-w-0 text-xs text-muted-foreground">
              <div className="truncate">{p.address}</div>
              <div>{p.birthDate}</div>
              <div>{p.createdAt}</div>
            </div>

            <div className="mt-4 border-t border-border pt-3 space-y-2">
              <ParticipantTicketAction participantId={p.id} phone={p.phone} ticket={p.ticket} showWhatsApp={false} onTicketGenerated={(id, t) => setItems(items.map(i => i.id === id ? { ...i, ticket: t } : i))} />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleDelete(p.id)}>Eliminar</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
