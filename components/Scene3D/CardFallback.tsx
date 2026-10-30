import { cn } from "@/lib/cn";

/**
 * 2D (CSS) rendition of the metal card — shown in thumbnails, without WebGL,
 * and under the 3D scene while it loads. Generic: no bank, network or number.
 */
export function CardFallback({ pose = "hero", className }: { pose?: "hero" | "calm"; className?: string }) {
  const transform = pose === "hero" ? "rotateX(10deg) rotateY(-25deg) rotateZ(4deg)" : "rotateX(6deg) rotateY(-10deg) rotateZ(1deg)";

  return (
    <div className={cn("absolute inset-0 grid place-items-center", className)} style={{ perspective: 1600 }}>
      {/* soft floor glow */}
      <div
        className="absolute left-1/2 top-[64%] h-[120px] w-[620px] -translate-x-1/2 rounded-[50%] blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(78 161 255 / 0.28), transparent)" }}
      />
      <div
        className="relative overflow-hidden rounded-[34px]"
        style={{
          width: 640,
          height: 640 / 1.5858,
          transform,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(135deg, #2a3449 0%, #151c2b 38%, #0f1522 58%, #222c40 100%), radial-gradient(120% 90% at 20% 0%, rgb(255 255 255 / 0.08), transparent 60%)",
          boxShadow:
            "0 0 0 1px rgb(166 178 197 / 0.22), inset 0 1px 0 rgb(255 255 255 / 0.18), 0 40px 80px -30px rgb(0 0 0 / 0.9), 12px 0 50px -20px rgb(85 214 232 / 0.35), -12px 0 50px -24px rgb(78 161 255 / 0.3)",
        }}
      >
        {/* specular sweep */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.10) 46%, transparent 60%)" }}
        />
        {/* guilloché arcs */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 404" aria-hidden>
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={660} cy={450} r={120 + i * 16} fill="none" stroke="url(#gl)" strokeWidth={0.8} opacity={0.5 - i * 0.02} />
          ))}
          <defs>
            <linearGradient id="gl" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#55d6e8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#8b7cff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute left-[60px] top-[44px] text-[21px] font-semibold tracking-[0.28em] text-ink/90">CREDIT</span>
        {/* chip */}
        <div
          className="absolute left-[60px] top-[150px] h-[62px] w-[82px] rounded-[12px]"
          style={{ background: "linear-gradient(135deg, #e9eef6, #a9b4c4 45%, #d7dde8)" }}
        >
          <div className="absolute inset-y-0 left-[36%] w-px bg-[#283242]/50" />
          <div className="absolute inset-y-0 left-[64%] w-px bg-[#283242]/50" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#283242]/50" />
        </div>
        {/* contactless */}
        <svg className="absolute left-[166px] top-[154px]" width="46" height="54" viewBox="0 0 46 54" aria-hidden>
          {[10, 19, 28, 37].map((r) => (
            <path key={r} d={`M ${6 + r * 0.3} ${27 - r * 0.62} A ${r} ${r} 0 0 1 ${6 + r * 0.3} ${27 + r * 0.62}`} fill="none" stroke="rgb(244 247 251 / 0.7)" strokeWidth={3.4} strokeLinecap="round" />
          ))}
        </svg>
        {/* masked number */}
        <div className="absolute bottom-[62px] left-[64px] flex gap-[40px]">
          {Array.from({ length: 4 }, (_, g) => (
            <span key={g} className="flex gap-[11px]">
              {Array.from({ length: 4 }, (_, d) => (
                <span key={d} className="size-[8px] rounded-full bg-ink/55" />
              ))}
            </span>
          ))}
        </div>
        <div className="absolute bottom-[38px] left-[60px] right-[60px] h-[2px] bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      </div>
    </div>
  );
}
