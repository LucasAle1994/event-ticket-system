import { NextResponse } from "next/server";
import auth from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const redirectUrl = new URL('/admin/login', request.url).toString();
    const res = NextResponse.redirect(redirectUrl);
    res.headers.set('Set-Cookie', auth.buildClearCookieHeader());
    return res;
  } catch (err) {
    console.error('Logout error', err);
    const res = NextResponse.redirect('/admin/login');
    res.headers.set('Set-Cookie', auth.buildClearCookieHeader());
    return res;
  }
}
