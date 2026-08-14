import { NextResponse } from "next/server";
import auth from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");

    const envUser = process.env.ADMIN_USERNAME ?? "";
    const envPass = process.env.ADMIN_PASSWORD ?? "";

    const ok = username === envUser && password === envPass;
    if (!ok) {
      return NextResponse.json({ message: "Usuario o contraseña incorrectos." }, { status: 401 });
    }

    const { value, maxAge } = auth.createSessionValue({ username: envUser });
    const setCookie = auth.buildSetCookieHeader(value, maxAge);

    return NextResponse.json({ message: "ok" }, { status: 200, headers: { "Set-Cookie": setCookie } });
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ message: "Usuario o contraseña incorrectos." }, { status: 401 });
  }
}
