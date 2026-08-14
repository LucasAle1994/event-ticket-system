import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{ ticketUuid: string }> }) {
  const { ticketUuid } = await context.params;
  const ticket = await prisma.ticket.findUnique({
    where: { uuid: ticketUuid },
    select: {
      pdfBase64: true,
      participant: {
        select: {
          fullName: true,
        },
      },
    },
  });

  if (!ticket || !ticket.pdfBase64) {
    return NextResponse.json({ message: "Ticket no encontrado." }, { status: 404 });
  }

  const dataUrl = ticket.pdfBase64;
  const [, base64] = dataUrl.split(",");

  if (!base64) {
    return NextResponse.json({ message: "PDF inválido." }, { status: 500 });
  }

  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ticket-${ticket.participant.fullName}.pdf"`,
    },
  });
}
