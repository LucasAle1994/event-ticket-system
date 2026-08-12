import { formatDateForArgentina } from "@/features/participants/participant-service";
import { listParticipants } from "@/features/participants/participant-service";

export default async function AdminPage() {
  const participants = await listParticipants();

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="border-border bg-card rounded-3xl border p-6 sm:p-8">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
            Administración
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Participantes
          </h1>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="mt-4 text-3xl font-semibold">{participants.length}</p>
          </div>
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Último registro</p>
            <p className="mt-4 text-base font-medium">
              {participants[0]
                ? formatDateForArgentina(participants[0].createdAt)
                : "Sin registros"}
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

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Listado de participantes</h2>
            <span className="text-muted-foreground text-sm">
              {participants.length} registros
            </span>
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Aún no hay participantes registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-background/60 text-muted-foreground uppercase tracking-[0.08em]">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Celular</th>
                    <th className="px-6 py-4 font-medium">Dirección</th>
                    <th className="px-6 py-4 font-medium">Nacimiento</th>
                    <th className="px-6 py-4 font-medium">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="border-border border-t align-top">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {participant.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{participant.fullName}</div>
                        <div className="text-muted-foreground text-xs">{participant.uuid}</div>
                      </td>
                      <td className="px-6 py-4">{participant.email}</td>
                      <td className="px-6 py-4">{participant.phone}</td>
                      <td className="px-6 py-4 max-w-xs">{participant.address}</td>
                      <td className="px-6 py-4">
                        {formatDateForArgentina(participant.birthDate, {
                          dateStyle: "short",
                          timeStyle: undefined,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {formatDateForArgentina(participant.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
