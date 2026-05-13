type Props = {
  brand: string;
  address: string;
  phone: string;
  instagram: string;
  hours: string;
};

export function Footer({ brand, address, phone, instagram, hours }: Props) {
  return (
    <footer id="contact" className="bg-brand-950/70 border-t border-cream/10">
      <div className="container-app py-10 grid gap-6">
        <div>
          <p className="font-display text-xl tracking-[0.22em] uppercase">{brand}</p>
          <ul className="mt-4 grid gap-2 text-sm text-cream/85">
            <li className="flex items-start gap-2">
              <Icon name="pin" /> <span>{address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="phone" /> <a href={`tel:${phone}`}>{phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="ig" />{" "}
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                {instagram}
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-cream/10 pt-4">
          <p className="text-[11px] tracking-[0.28em] uppercase text-cream/60">
            Çalışma Saatleri
          </p>
          <p className="text-sm mt-1">{hours}</p>
        </div>

        <p className="text-[11px] text-cream/50 text-center pt-2">
          © {new Date().getFullYear()} {brand}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}

function Icon({ name }: { name: "pin" | "phone" | "ig" }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    className: "shrink-0 mt-0.5 text-cream/80",
  } as const;
  if (name === "pin")
    return (
      <svg {...props}>
        <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  if (name === "phone")
    return (
      <svg {...props}>
        <path d="M22 16.92V20a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3.09a2 2 0 012 1.72c.13.96.36 1.9.69 2.81a2 2 0 01-.45 2.11L8.21 9.79a16 16 0 006 6l1.16-1.16a2 2 0 012.11-.45c.91.33 1.85.56 2.81.69a2 2 0 011.72 2z" />
      </svg>
    );
  return (
    <svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
