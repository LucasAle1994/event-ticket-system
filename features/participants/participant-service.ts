import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { participantSchema, type ParticipantFormValues } from "./participant-schema";

export class DuplicateParticipantError extends Error {
  constructor() {
    super("Ya existe una inscripción con este correo electrónico.");
    this.name = "DuplicateParticipantError";
  }
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

  try {
    return await prisma.participant.create({
      data: {
        fullName: parsed.fullName.trim(),
        email: normalizedEmail,
        phone: parsed.phone.trim(),
        address: parsed.address.trim(),
        birthDate: new Date(parsed.birthDate),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new DuplicateParticipantError();
    }

    throw new Error("No pudimos registrar tu inscripción. Intenta nuevamente.");
  }
}
