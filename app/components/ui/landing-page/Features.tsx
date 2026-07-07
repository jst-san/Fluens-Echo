import {
  FaChartBar,
  FaFile,
  FaPenSquare,
  FaPercent,
  FaUsers,
} from "react-icons/fa";
import { LuScan, LuSparkles, LuType } from "react-icons/lu";

export default function Features() {
  return (
    <section
      id="features"
      className="content flex flex-col gap-24 items-center"
    >
      <h2 className="max-w-xl text-6xl font-bold text-shadow-sm text-shadow-brand-light text-center">
        Semua Yang Anda Butuhkan Dalam Satu Aplikasi
      </h2>
      <div className="flex">
        <div className="p-8 w-80 bg-linear-150 from-foreground via-muted-light to-muted space-y-3 rounded-3xl border border-border shadow-lg shadow-brand-light/25 translate-6">
          <div className="w-full aspect-4/3 flex items-center justify-center relative">
            <FaFile className="text-brand-dark" size={96} />
            <FaPenSquare
              className="absolute text-brand bg-foreground translate-8 rounded-lg"
              size={64}
            />
            <LuType className="absolute text-brand -translate-12" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-center ">Editor Intuitif</h2>
          <p className="text-muted-darker text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing Tempore officia
            amet, asperiores laboriosam
          </p>
        </div>
        <div className="p-8 w-80 bg-linear-180 from-foreground via-muted-light to-muted space-y-3 rounded-3xl border border-border shadow-lg shadow-brand-light/25 z-10">
          <div className="w-full aspect-4/3 flex items-center justify-center relative">
            <LuScan className="text-brand-dark" size={104} />
            <LuSparkles
              className="absolute stroke-0 fill-[#6f16ff]"
              size={104}
            />
            <LuSparkles
              className="absolute -translate-14 -rotate-15 stroke-0 fill-[#6f16ff] -z-1"
              size={32}
            />
            <LuSparkles
              className="absolute translate-14 rotate-15 stroke-0 fill-[#6f16ff] -z-1"
              size={48}
            />
          </div>
          <h2 className="text-3xl font-bold text-center">Ekstrak dari PDF</h2>
          <p className="text-muted-darker text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing Tempore officia
            amet, asperiores laboriosam
          </p>
        </div>
        <div className="p-8 w-80 bg-linear-210 from-foreground via-muted-light to-muted space-y-3 items-center rounded-3xl border border-border shadow-lg shadow-brand-light/25 -translate-x-6 translate-y-6">
          <div className="w-full aspect-4/3 flex items-center justify-center relative">
            <FaChartBar className="text-brand-dark" size={96} />
            <FaUsers
              className="absolute text-foreground bg-brand p-2 rounded-full border-4 border-foreground translate-x-12 translate-y-8"
              size={64}
            />
            <FaPercent
              className="absolute text-brand -translate-x-16 -translate-y-8"
              size={32}
            />
          </div>
          <h2 className="text-3xl font-bold text-center ">Analisis Respons</h2>
          <p className="text-muted-darker text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing Tempore officia
            amet, asperiores laboriosam
          </p>
        </div>
      </div>
    </section>
  );
}
