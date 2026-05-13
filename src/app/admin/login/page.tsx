import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bosco text-crema flex items-center justify-center px-5 grain">
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-crema text-ink p-8 shadow-card">
        <h1 className="font-display text-3xl text-rosso text-center uppercase tracking-wide">
          Yönetim Girişi
        </h1>
        <p className="text-center font-serif italic text-bosco-700 text-sm mt-1">
          Pizzara Restaurant
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
