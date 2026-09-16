"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function Reservation() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <section id="reservation" className="reservation-section">
      <div className="container-wrap reservation-layout">
        <div>
          <p className="reservation-kicker">BİRLİKTE DAHA GÜZEL</p>
          <h2>
            Sofrada sana
            <br />
            da yer var.
          </h2>
          <p className="reservation-description">
            Sevdiklerini al, soframıza gel.
            <br />
            Gerisini bize bırak.
          </p>
          <button
            ref={trigger}
            type="button"
            className="reservation-cta"
            onClick={() => setOpen(true)}
          >
            Masa ayırt <span aria-hidden>↗</span>
          </button>
        </div>
        <div className="table-illustration" aria-hidden>
          <svg
            viewBox="0 0 400 300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="200" cy="140" rx="120" ry="42" />
            <path d="M80 140v16c0 24 54 42 120 42s120-18 120-42v-16M195 198v66m10-66v66m-40 6q35-15 70 0" />
            <ellipse cx="151" cy="135" rx="25" ry="11" />
            <ellipse cx="151" cy="135" rx="18" ry="7" />
            <ellipse cx="250" cy="152" rx="25" ry="11" />
            <ellipse cx="250" cy="152" rx="18" ry="7" />
            <path d="M202 112v-35m-12 0h24l-5 23h-15zM190 114h24M132 112l-10-20m0 0-3-5m6 3-3-6M277 131l8-20M64 165c-8-70-46-67-42 8m0 0q20 20 42-8M26 176l-8 72m42-78 15 65M337 181c-2-60 43-71 44-5m-44 5q23 20 44-5" />
            <path d="M343 192l-7 65m40-67 12 65M102 74q20-25 40-7M283 71q11-8 20 0" />
          </svg>
          <span>A tavola!</span>
        </div>
      </div>
      {open &&
        createPortal(
          <ReservationDialog
            onClose={() => {
              setOpen(false);
              requestAnimationFrame(() => trigger.current?.focus());
            }}
          />,
          document.body,
        )}
    </section>
  );
}

function ReservationDialog({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const done = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (state === "ok") done.current?.focus();
  }, [state]);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key !== "Tab") return;
      const elements = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input, a[href]",
        ) ?? [],
      );
      const first = elements[0],
        last = elements[elements.length - 1];
      if (!dialog.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    setMsg("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(
          body.error || "Talebiniz gönderilemedi. Lütfen tekrar deneyin.",
        );
      setState("ok");
      setMsg("Rezervasyon talebiniz alındı. Onay için sizi arayacağız.");
      form.reset();
    } catch (error) {
      setState("err");
      setMsg(
        error instanceof Error
          ? error.message
          : "Bağlantı kurulamadı. Lütfen tekrar deneyin.",
      );
    }
  }
  return (
    <div
      className="reservation-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-title"
        className="reservation-dialog"
      >
        <button
          ref={close}
          type="button"
          className="reservation-close"
          aria-label="Rezervasyonu kapat"
          onClick={onClose}
        >
          ×
        </button>
        <p className="menu-kicker">PIZZARA’DA BULUŞALIM</p>
        <h3 id="reservation-title">Bir masa ayıralım.</h3>
        {state === "ok" ? (
          <div className="reservation-success">
            <p role="status">{msg}</p>
            <button ref={done} className="reservation-cta" onClick={onClose}>
              Tamam <span aria-hidden>↗</span>
            </button>
          </div>
        ) : (
          <>
            <p className="reservation-hint">
              Bilgilerini bırak, rezervasyonunu onaylamak için seni arayalım.
            </p>
            <form onSubmit={onSubmit} className="reservation-form">
              <label>
                Ad soyad
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                />
              </label>
              <label>
                Telefon
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  minLength={7}
                  maxLength={30}
                />
              </label>
              <div className="reservation-form-row">
                <label>
                  Tarih ve saat
                  <input name="date" type="datetime-local" required />
                </label>
                <label>
                  Kişi sayısı
                  <input
                    name="guests"
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={2}
                    required
                  />
                </label>
              </div>
              <label>
                Not <span>(isteğe bağlı)</span>
                <input name="note" maxLength={500} />
              </label>
              <button
                className="reservation-cta"
                type="submit"
                disabled={state === "sending"}
              >
                {state === "sending"
                  ? "Gönderiliyor…"
                  : "Rezervasyon talebi gönder"}
                <span aria-hidden>↗</span>
              </button>
              {msg && (
                <p className="reservation-error" role="alert">
                  {msg}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
