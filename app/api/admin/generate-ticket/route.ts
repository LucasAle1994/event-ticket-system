import { NextResponse } from "next/server";
import auth from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import {
  createTicketForParticipant,
  generateTicketImage,
  generateTicketPdfFromImage,
  setTicketMedia,
  findTicketByParticipant,
  markTicketSent,
  buildWhatsAppLink,
} from "@/features/participants/ticket-service";

export async function POST(request: Request) {
    // Verify session cookie
    try {
      const cookieHeader = request.headers.get('cookie');
      const cookies = auth.parseCookieHeader(cookieHeader);
      const session = cookies[auth.getCookieName()];
      if (!auth.verifySessionValue(session)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body = await request.json();

    if (!body?.participantId || !body?.phone) {
      return NextResponse.json({ message: "Datos del participante incompletos." }, { status: 400 });
    }

    const participant = await prisma.participant.findUnique({
      where: { id: Number(body.participantId) },
    });

    if (!participant) {
      return NextResponse.json({ message: "Participante no encontrado." }, { status: 404 });
    }

    const existingTicket = await findTicketByParticipant(participant.id);
    if (existingTicket) {
      return NextResponse.json({ message: "El ticket ya fue generado." }, { status: 409 });
    }

    // Generate image + PDF first; only write DB record if generation succeeds
    const imageResult = await generateTicketImage({
      fullName: participant.fullName,
      email: participant.email,
      phone: participant.phone,
      address: participant.address,
      birthDate: participant.birthDate,
      uuid: crypto.randomUUID(), // temporary uuid to create QR payload
    });

    // Create ticket record now with the real uuid returned by DB
    const ticket = await createTicketForParticipant(participant.id);

    // regenerate image using the ticket uuid so QR matches stored ticket
    const imageResultFinal = await generateTicketImage({
      fullName: participant.fullName,
      email: participant.email,
      phone: participant.phone,
      address: participant.address,
      birthDate: participant.birthDate,
      uuid: ticket.uuid,
    });

    const pdfDataUrl = await generateTicketPdfFromImage(imageResultFinal.buffer, imageResultFinal.width, imageResultFinal.height);

    const origin = new URL(request.url).origin;
    const ticketUrl = `${origin}/api/tickets/${ticket.uuid}`;
    const whatsappMessage = `Hola ${participant.fullName}, tu entrada ha sido generada. Descargala usando este enlace: ${ticketUrl}`;
    const whatsappUrl = buildWhatsAppLink(participant.phone, whatsappMessage);

    await setTicketMedia(ticket.id, whatsappUrl, pdfDataUrl);

    // Attempt to send the PNG via WhatsApp Cloud API if configured.
    // Flow: upload media -> get media_id -> send image message referencing media_id.
    let sent = false;
    try {
      const WH_URL = process.env.WHATSAPP_API_URL; // e.g. https://graph.facebook.com/v17.0
      const WH_PHONE_ID = process.env.WHATSAPP_PHONE_ID; // phone number id
      const WH_TOKEN = process.env.WHATSAPP_TOKEN; // bearer token
      if (WH_URL && WH_PHONE_ID && WH_TOKEN) {
        const normalizedPhone = participant.phone.replace(/[^0-9]/g, "");
        const uploadEndpoint = `${WH_URL.replace(/\/$/,"")}/${WH_PHONE_ID}/media`;

        // Upload PNG as media
        const form = new FormData();
        // Append buffer as file; FormData in Node/fetch accepts Blob/Buffer
        // Use a Blob to set MIME type explicitly
        const blob = new Blob([new Uint8Array(imageResultFinal.buffer)], { type: "image/png" });
        form.append("messaging_product", "whatsapp");
        form.append("file", blob, "ticket.png");

        const uploadResp = await fetch(uploadEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WH_TOKEN}`,
            // Note: do NOT set Content-Type; fetch/FormData will set the multipart boundary
          } as any,
          body: form as any,
        });

        if (!uploadResp.ok) {
          const text = await uploadResp.text().catch(() => "");
          console.error("WhatsApp media upload failed:", uploadResp.status, text);
        } else {
          const uploadJson = await uploadResp.json().catch(() => null as any);
          const mediaId = uploadJson?.id;
          if (mediaId) {
            // Send image message referencing uploaded media_id
            const sendEndpoint = `${WH_URL.replace(/\/$/,"")}/${WH_PHONE_ID}/messages`;
            const payload = {
              messaging_product: "whatsapp",
              to: normalizedPhone,
              type: "image",
              image: {
                id: mediaId,
                caption: `Hola ${participant.fullName} 👋\nTu entrada ya está lista. ¡Te esperamos!`,
              },
            };

            const resp = await fetch(sendEndpoint, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${WH_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (resp.ok) {
              await markTicketSent(ticket.id);
              sent = true;
            } else {
              const text = await resp.text().catch(() => "");
              console.error("WhatsApp send failed:", resp.status, text);
            }
          } else {
            console.error("WhatsApp upload did not return media id", uploadJson);
          }
        }
      }
    } catch (err) {
      console.error("Error sending WhatsApp message:", err);
    }

    return NextResponse.json(
      {
        message: sent ? "Ticket generado y enviado por WhatsApp." : "Ticket generado correctamente.",
        ticket: {
          id: ticket.id,
          uuid: ticket.uuid,
          status: sent ? "SENT" : "GENERATED",
          whatsappUrl,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error generating ticket:", error);
    return NextResponse.json(
      { message: "No se pudo generar el ticket. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
