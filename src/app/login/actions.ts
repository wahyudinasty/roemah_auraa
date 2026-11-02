"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const admin = await signIn(email, password);
  if (!admin) {
    return { error: "Email atau kata sandi tidak sesuai. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/login");
}
