import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import auth from "@/lib/auth";

export async function DELETE(...args: any[]) {
  try {
    // Auth: require session cookie
    try {
      const request: Request = args[0];
      const cookieHeader = request.headers.get('cookie');
      const cookies = auth.parseCookieHeader(cookieHeader);
      const session = cookies[auth.getCookieName()];
      if (!auth.verifySessionValue(session)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const request: Request = args[0];
    const context: any = args[1];
    // In Next 16, context.params may be a Promise and must be awaited
    const params = context?.params ? await context.params : undefined;
    const id = Number(params?.id ?? context?.params?.id ?? (() => {
      try { return new URL(request.url).pathname.split('/').pop(); } catch { return NaN }
    })());
    if (Number.isNaN(id)) return NextResponse.json({ message: "ID inválido" }, { status: 400 });

    // Delete ticket if exists to avoid FK constraint
    await prisma.ticket.deleteMany({ where: { participantId: id } });
    await prisma.participant.delete({ where: { id } });

    return NextResponse.json({ message: "El participante fue eliminado" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting participant', error);
    return NextResponse.json({ message: "No se pudo eliminar" }, { status: 500 });
  }
}
