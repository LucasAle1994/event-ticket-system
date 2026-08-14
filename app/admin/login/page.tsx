"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setError(j?.message ?? 'Usuario o contraseña incorrectos.');
        return;
      }
      // redirect to admin
      window.location.href = '/admin';
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8">
        <h1 className="text-2xl font-semibold mb-4">Panel administrativo — Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Usuario</label>
            <input className="w-full rounded-md border px-3 py-2" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Contraseña</label>
            <input type="password" className="w-full rounded-md border px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-white">Iniciar sesión</button>
          </div>
        </form>
      </div>
    </div>
  );
}
