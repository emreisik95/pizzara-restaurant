import { PlateImage } from "./PlateImage";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
};

export function Hero({ eyebrow, title, subtitle, image }: Props) {
  const lines = title.split("\n");
  return (
    <section id="hero" className="relative pt-8 pb-14">
      <div className="container-app">
        <p className="pill bg-cream/10 text-cream/80 ring-1 ring-cream/20">
          {eyebrow}
        </p>
        <h1 className="font-display mt-5 text-[2.55rem] leading-[1.02] tracking-tight">
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </h1>
        <p className="mt-5 text-cream/85 text-[15px] leading-relaxed max-w-[28ch]">
          {subtitle}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#menu" className="btn-primary">
            MENÜYÜ KEŞFET
          </a>
          <a href="#reservation" className="btn-ghost">
            REZERVASYON
          </a>
        </div>

        <div className="relative mt-10">
          <div className="absolute -inset-x-8 -top-6 h-72 rounded-[40%] bg-cream/10 blur-3xl" aria-hidden />
          <div className="relative mx-auto aspect-square w-[88%] max-w-md overflow-hidden rounded-full ring-8 ring-cream/15 shadow-card">
            <PlateImage src={image} alt="Pizzara signature dish" />
          </div>
          <Ornament />
        </div>
      </div>
    </section>
  );
}

function Ornament() {
  return (
    <div className="mt-10 divider-ornament">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
        <path d="M12 2 L13.6 8.4 L20 10 L13.6 11.6 L12 18 L10.4 11.6 L4 10 L10.4 8.4 Z" />
      </svg>
    </div>
  );
}

