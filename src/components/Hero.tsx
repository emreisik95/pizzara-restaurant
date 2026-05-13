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
      <div className="absolute inset-y-0 right-0 w-[78%] md:w-[60%] z-0 pointer-events-none">
        <PlateImage
          src={image}
          alt="Pizzara signature pasta"
          shape="round"
          className="absolute top-1/2 -translate-y-1/2 right-[-22%] md:right-[-14%] w-[125%] md:w-[110%] aspect-square ring-0 shadow-[0_50px_100px_-32px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* Sparkle accents */}
      <Sparkle size={18} className="absolute top-16 left-[38%] text-crema/80" rotate={20} />
      <Sparkle size={14} className="absolute bottom-24 left-[6%] text-crema/70" rotate={45} />
      <Sparkle size={22} className="absolute top-[40%] right-[8%] text-crema/70 hidden md:block" />

      <div className="container-wrap relative z-10 grid md:grid-cols-2 items-center gap-8 pt-14 pb-20 md:py-32">
        <div className="max-w-xl fade-up">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="section-eyebrow tracking-[0.36em]">{eyebrow}</span>
            <Sparkle size={12} className="text-crema/80" />
            <span className="inline-block h-px w-10 md:w-16 bg-crema/30" />
          </div>

          <h1 className="font-display uppercase text-[clamp(2.5rem,9.5vw,5.5rem)] leading-[1.02] tracking-[0.005em]">
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h1>

          <p className="mt-6 md:mt-8 max-w-md text-crema/90 text-base md:text-lg leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-7 md:mt-9">
            <span className="relative inline-flex">
              <a href="#menu" className="pill-cta pill-cta--red">
                Menüyü Keşfet
              </a>
              <Sparkle size={20} className="sparkle-accent text-crema" />
            </span>
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
