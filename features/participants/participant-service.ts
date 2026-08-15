import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { participantSchema, type ParticipantFormValues } from "./participant-schema";

export class DuplicateParticipantError extends Error {
  constructor() {
    super("Ya existe una inscripción con este correo electrónico.");
    this.name = "DuplicateParticipantError";
  }
}

export function formatDateForArgentina(
  value: Date | string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  },
) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("es-AR", {
    ...options,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(date);
}

export async function listParticipants() {
  return prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      uuid: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      birthDate: true,
      createdAt: true,
      ticket: {
        select: {
          id: true,
          uuid: true,
          status: true,
          whatsappUrl: true,
          pdfBase64: true,
        },
      },
    },
  });
}

export async function createParticipant(input: ParticipantFormValues) {
  const parsed = participantSchema.parse(input);
  const normalizedEmail = parsed.email.trim().toLowerCase();

  const existingParticipant = await prisma.participant.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingParticipant) {
    throw new DuplicateParticipantError();
  }

  // Convertir YYYY-MM-DD de forma determinística
  const [year, month, day] = parsed.birthDate.split("-").map(Number);

  const birthDate = new Date(
    Date.UTC(year, month - 1, day),
  );

  try {
    return await prisma.participant.create({
      data: {
        fullName: parsed.fullName.trim(),
        email: normalizedEmail,
        phone: parsed.phone.trim(),
        address: parsed.address.trim(),
        birthDate,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DuplicateParticipantError();
    }

    throw new Error("No pudimos registrar tu inscripción. Intenta nuevamente.");
  }
}

export async function sendParticipantTelegramNotification(participant: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: Date;
  createdAt: Date;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return;
  }

  const message = [
    "Nuevo registro de participante:",
    `Nombre: ${participant.fullName}`,
    `Email: ${participant.email}`,
    `Telefono: ${participant.phone}`,
    `Direccion: ${participant.address}`,
    `Fecha de nacimiento: ${formatDateForArgentina(participant.birthDate, {
      dateStyle: "short",
      timeStyle: undefined,
      timeZone: "America/Argentina/Buenos_Aires",
    })}`,
    `Fecha de registro: ${formatDateForArgentina(participant.createdAt)}`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram notification failed: ${errorText}`);
  }
}
