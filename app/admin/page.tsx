import { formatDateForArgentina } from "@/features/participants/participant-service";
import { listParticipants } from "@/features/participants/participant-service";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import auth from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieName = auth.getCookieName();
  const cookieStore = await cookies();
  const c = cookieStore.get(cookieName)?.value;
  if (!auth.verifySessionValue(c)) {
    redirect('/admin/login');
  }
  const participantsRaw = await listParticipants();

  const participants = participantsRaw.map((p) => ({
    ...p,
    birthDate: formatDateForArgentina(p.birthDate, { dateStyle: "short", timeStyle: undefined }),
    createdAt: formatDateForArgentina(p.createdAt),
    createdAtIso: p.createdAt.toISOString(),
    birthDateIso: p.birthDate.toISOString(),
  }));

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
        <header className="border-border bg-card rounded-3xl border p-6 sm:p-8">
  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
        Administración
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Participantes
      </h1>
    </div>

    <a
      href="/admin/logout"
      className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white sm:w-auto"
    >
      Cerrar sesión
    </a>
  </div>
</header>

        <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="mt-4 text-3xl font-semibold">{participants.length}</p>
          </div>
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Último registro</p>
            <p className="mt-4 text-base font-medium">
              {participants[0] ? participants[0].createdAt : "Sin registros"}
            </p>
          </div>
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Estado</p>
            <p className="mt-4 text-base font-medium text-primary">Activo</p>
          </div>
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Fuente</p>
            <p className="mt-4 text-base font-medium">PostgreSQL</p>
          </div>
        </div>

        <section className="mt-8 w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-border flex flex-col sm:flex-row sm:items-center sm:justify-between border-b px-4 py-4">
            <h2 className="text-xl font-semibold">Listado de participantes</h2>
            <span className="text-muted-foreground text-sm mt-2 sm:mt-0">
              {participants.length} registros
            </span>
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Aún no hay participantes registrados.
            </div>
            ) : (
            <div className="min-w-0 p-2 sm:p-4">
              <AdminDashboard participants={participants} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
