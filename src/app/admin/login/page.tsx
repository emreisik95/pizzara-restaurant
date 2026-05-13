import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl bg-brand-900/60 p-6 ring-1 ring-cream/10 shadow-card">
        <h1 className="font-display text-3xl text-center">Yönetim Girişi</h1>
        <p className="text-center text-cream/70 text-sm mt-1">Pizzara Restaurant</p>
        <LoginForm />
      </div>
    </main>
  );
}
