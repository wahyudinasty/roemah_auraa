"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <div>
        <label htmlFor="email" className="field-label">
          Email Admin
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="admin@roemahaura.com"
          className="field"
          placeholder="admin@roemahaura.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p className="border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-800">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-dark w-full disabled:opacity-60">
        {pending ? "Memeriksa…" : "Masuk ke Dashboard"}
      </button>

      <div className="border border-sand/80 bg-cream/60 p-3 text-[11px] leading-relaxed text-cocoa/55">
        <p className="text-[9px] uppercase tracking-[0.18em] text-gold-dark">Akun demo</p>
        <p className="mt-1">
          Email: <span className="text-cocoa">admin@roemahaura.com</span>
        </p>
        <p>
          Kata sandi: <span className="text-cocoa">roemahaura123</span>
        </p>
      </div>
    </form>
  );
}
