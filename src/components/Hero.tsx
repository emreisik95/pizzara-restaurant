import { Sparkle } from "./Sparkle";
import { PlateImage } from "./PlateImage";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
};

export function Hero({ eyebrow, title, subtitle, image }: Props) {
  const lines = title.split("\n").filter(Boolean);
  return (
    <section id="hero" className="relative bg-bosco text-crema overflow-hidden grain">
      {/* Pasta image — bleeds off the right edge */}
      <div className="absolute inset-y-0 right-[-12%] md:right-[-6%] w-[78%] md:w-[58%] z-0 pointer-events-none">
        <div className="relative h-full w-full">
          <PlateImage
            src={image}
            alt="Pizzara signature pasta"
            shape="round"
            className="absolute right-[-18%] top-1/2 -translate-y-1/2 w-[120%] md:w-[100%] aspect-square ring-0"
          />
        </div>
      </div>

      {/* Sparkle accents */}
      <Sparkle size={18} className="absolute top-12 left-[42%] text-crema/80" rotate={20} />
      <Sparkle size={14} className="absolute bottom-24 left-[6%] text-crema/70" rotate={45} />
      <Sparkle size={22} className="absolute top-[40%] right-[8%] text-crema/70 hidden md:block" />

      <div className="container-wrap relative z-10 grid md:grid-cols-2 items-center gap-8 pt-12 pb-20 md:py-32">
        <div className="max-w-xl fade-up">
          <div className="flex items-center gap-3 mb-7 md:mb-9">
            <span className="section-eyebrow tracking-[0.36em]">{eyebrow}</span>
            <Sparkle size={14} className="text-crema/80" />
            <span className="hidden md:inline-block h-px w-16 bg-crema/30" />
          </div>

          <h1 className="font-display uppercase text-[clamp(3.2rem,12vw,7rem)] leading-[0.88] tracking-tightest">
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h1>

          <p className="mt-7 md:mt-9 max-w-md text-crema/90 text-base md:text-lg leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-8 md:mt-10 flex flex-wrap gap-3 items-center">
            <span className="relative inline-flex">
              <a href="#menu" className="pill-cta pill-cta--red">
                Menüyü Keşfet
              </a>
              <Sparkle size={20} className="sparkle-accent text-crema" />
            </span>
            <a href="#reservation" className="pill-cta pill-cta--outline-cream">
              Rezervasyon
            </a>
          </div>
        </div>

        {/* Spacer for image column on md+ */}
        <div className="hidden md:block" aria-hidden />
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 pb-6 md:pb-8 flex justify-center text-crema/70">
        <a href="#menu" aria-label="Aşağı kaydır" className="inline-flex items-center justify-center h-9 w-9 rounded-full ring-1 ring-crema/30 hover:bg-crema/10 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
