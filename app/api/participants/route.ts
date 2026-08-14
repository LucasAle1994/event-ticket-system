import { NextResponse } from "next/server";

import { participantSchema } from "@/features/participants/participant-schema";
import {
  createParticipant,
  DuplicateParticipantError,
  sendParticipantTelegramNotification,
} from "@/features/participants/participant-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const data = participantSchema.safeParse(body);

    if (!data.success) {
      return NextResponse.json(
        {
          message: data.error.issues[0]?.message || "Revisa los datos de tu inscripción.",
        },
        { status: 400 },
      );
    }

    const participant = await createParticipant(data.data);

    try {
      await sendParticipantTelegramNotification(participant);
    } catch (error) {
      console.error("Telegram notification failed:", error);
    }

    return NextResponse.json(
      {
        message: "Inscripción registrada correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof DuplicateParticipantError) {
      return NextResponse.json(
        {
          message: "Ya existe una inscripción con este correo electrónico.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "No pudimos registrar tu inscripción. Intenta nuevamente.",
      },
      { status: 500 },
    );
  }
}
