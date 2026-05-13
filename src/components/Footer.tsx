import { Sparkle } from "./Sparkle";

type Props = {
  brand: string;
  address: string;
  phone: string;
  instagram: string;
  hours: string;
};

export function Footer({ brand, address, phone, instagram, hours }: Props) {
  return (
    <footer id="contact" className="relative bg-bosco text-crema grain">
      <div className="container-wrap relative z-10 grid md:grid-cols-2 gap-10 py-14 md:py-20">
        <div>
          <p className="font-display tracking-wider2 uppercase text-xl md:text-2xl">{brand}</p>
          <ul className="mt-5 grid gap-3 text-[15px] text-crema/90">
            <li className="flex items-start gap-3">
              <Icon name="pin" />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="phone" />
              <a href={`tel:${phone}`} className="hover:text-crema">{phone}</a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="ig" />
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-crema"
              >
                {instagram}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:text-right">
          <div className="md:inline-flex md:items-center md:gap-3 md:justify-end md:flex-row-reverse">
            <Sparkle size={14} className="text-crema/80 md:inline-block hidden" />
            <p className="section-eyebrow">Çalışma Saatleri</p>
          </div>
          <p className="font-serif italic mt-2 text-xl md:text-2xl">{hours}</p>
        </div>
      </div>

      <div className="container-wrap relative z-10 border-t border-crema/15 py-5 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-crema/70">
        <p>© {new Date().getFullYear()} {brand}. Tüm hakları saklıdır.</p>
        <p className="uppercase tracking-[0.28em]">İyi malzeme · Gerçek lezzet</p>
      </div>
    </footer>
  );
}

function Icon({ name }: { name: "pin" | "phone" | "ig" }) {
  const p = {
    width: 18, height: 18, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.7,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    className: "shrink-0 mt-1 text-crema",
  };
  if (name === "pin") return (
    <svg {...p}><path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" /></svg>
  );
  if (name === "phone") return (
    <svg {...p}><path d="M22 16.92V20a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3.09a2 2 0 012 1.72c.13.96.36 1.9.69 2.81a2 2 0 01-.45 2.11L8.21 9.79a16 16 0 006 6l1.16-1.16a2 2 0 012.11-.45c.91.33 1.85.56 2.81.69a2 2 0 011.72 2z" /></svg>
  );
  return (
    <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  );
}
