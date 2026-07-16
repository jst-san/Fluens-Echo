import {
  FaChartBar,
  FaFile,
  FaPenSquare,
  FaPercent,
  FaUsers,
} from "react-icons/fa";
import { LuScan, LuSparkle, LuSparkles, LuType } from "react-icons/lu";

export default function Features() {
  return (
    <section
      id="features"
      className="content pt-24 flex flex-col gap-12 md:gap-24 items-center"
    >
      <h2 className="max-w-xl text-3xl sm:text-5xl md:text-6xl font-bold text-center text-shadow-xs md:text-shadow-sm text-shadow-brand-light">
        Semua Yang Anda Butuhkan Dalam Satu Aplikasi
      </h2>
      <div className="flex flex-co min-[480px]:flex-row">
        <div className="relative overflow-hidden z-1 p-4 md:p-6 lg:p-8 flex-1 lg:w-80 bg-linear-150 from-foreground via-muted-light to-muted space-y-1 md:space-y-2 lg:space-y-3 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border border-border shadow-lg shadow-brand-light/25 translate-3 sm:translate-4 md:translate-5 lg:translate-6">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-brand-light/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-full aspect-4/3 flex items-center justify-center relative">
            <FaFile className="text-brand-dark w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
            <FaPenSquare className="absolute text-brand bg-foreground translate-4 sm:translate-6 md:translate-7 lg:translate-8 rounded-sm sm:rounded md:rounded-md lg:rounded-lg w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <LuType className="absolute text-brand -translate-6 sm:-translate-8 md:-translate-10 lg:-translate-12 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </div>
          <h2 className="text-xs min-[480px]:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
            Editor Intuitif
          </h2>
          <p className="text-[0.55rem] min-[480px]:text-xs sm:text-sm md:text-base text-muted-darker text-center tracking-tight sm:tracking-normal">
            Buat dan edit formulir Anda dengan cepat dan mudah melalui antarmuka
            yang ramah pengguna
          </p>
        </div>
        <div className="relative overflow-hidden p-4 md:p-6 lg:p-8 flex-1 lg:w-80 bg-linear-180 from-foreground via-muted-light to-muted space-y-1 md:space-y-2 lg:space-y-3 not-visited:sm:rounded-xl  md:rounded-2xl lg:rounded-3xl border border-border shadow-lg shadow-brand-light/25 z-10">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-brand-light/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-full aspect-4/3 flex items-center justify-center relative">
            <LuScan className="text-brand-dark w-13 h-13 sm:w-18 sm:h-18 md:w-22 md:h-22 lg:w-26 lg:h-26" />
            <LuSparkle className="absolute stroke-0 fill-accent-dark w-13 h-13 sm:w-18 sm:h-18 md:w-22 md:h-22 lg:w-26 lg:h-26" />
            <LuSparkle className="absolute -translate-7 sm:-translate-10 md:-translate-12 lg:-translate-14 -rotate-15 stroke-0 fill-accent-dark -z-1 w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <LuSparkle className="absolute translate-7 sm:translate-10 md:translate-12 lg:translate-14 rotate-15 stroke-0 fill-accent-dark -z-1 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </div>
          <h2 className="text-xs min-[480px]:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
            Ekstraksi AI
          </h2>
          <p className="text-[0.55rem] min-[480px]:text-xs sm:text-sm md:text-base text-muted-darker text-center tracking-tight sm:tracking-normal">
            Bekerja lebih efisien dengan fitur ekstraksi AI. Ubah dokumen PDF
            menjadi draf dalam hitungan detik
          </p>
        </div>
        <div className="relative overflow-hidden p-4 md:p-6 lg:p-8 flex-1 lg:w-80 bg-linear-210 from-foreground via-muted-light to-muted space-y-1 md:space-y-2 lg:space-y-3 items-center sm:rounded-xl  md:rounded-2xl lg:rounded-3xl border border-border shadow-lg shadow-brand-light/25 -translate-x-3 sm:-translate-x-4 md:-translate-x-5 lg:-translate-x-6 translate-y-3 sm:translate-y-4 md:translate-y-5 lg:translate-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-brand-light/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-full aspect-4/3 flex items-center justify-center relative">
            <FaChartBar className="text-brand-dark w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
            <FaUsers className="absolute text-foreground bg-brand p-1 lg:p-2 rounded-full border sm:border-2 md:border-3 lg:border-4 border-foreground translate-x-6 sm:translate-x-8 md:translate-x-10 lg:translate-x-12 translate-y-4 sm:translate-y-6 md:translate-y-7 lg:translate-y-8 w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <FaPercent className="absolute text-brand -translate-x-8 sm:-translate-x-11 md:translate-x-14 lg:-translate-x-16 -translate-y-4 sm:-translate-y-6 md:-translate-y-7 lg:-translate-y-8 w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </div>
          <h2 className="text-xs min-[480px]:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-center ">
            Analisis Data
          </h2>
          <p className="text-[0.55rem] min-[480px]:text-xs sm:text-sm md:text-base text-muted-darker text-center tracking-tight sm:tracking-normal">
            Evaluasi setiap respon yang masuk secara efisien. Analisis data Anda
            dengan cepat{" "}
            <br className="hidden lg:block" />
            dan tepat
          </p>
        </div>
      </div>
    </section>
  );
}
