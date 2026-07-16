import { LuSparkle } from "react-icons/lu";
import { PrimaryBtn, SecondaryBtn } from "../buttons";
import { PrimaryAnchorBtn, SecondaryAnchorBtn } from "../anchor-buttons";

export default function Hero() {
  return (
    <section id="hero" className="pt-12 min-h-128 flex items-center">
      <div className="container w-full flex flex-col items-center">
        <div className="content flex flex-col items-center text-center space-y-5 md:space-y-8 relative">
          <h1 className="max-w-2xl text-4xl sm:text-6xl md:text-7xl font-bold leading-tight md:leading-none text-shadow-xs md:text-shadow-sm text-shadow-brand-light">
            Buat Formulir
            <br />
            Cepat dan Mudah
            <br />
            dengan{" "}
            <span className="text-shadow-none bg-linear-to-r from-accent via-accent-dark to-brand bg-clip-text text-transparent">
              AI
            </span>
            <LuSparkle className="w-5 h-5 md:w-8 md:h-8 align-top mt-1 inline stroke-0 rotate-15 fill-accent-dark" />
          </h1>

          <p className="max-w-sm sm:max-w-3xl text-sm md:text-base lg:text-lg text-muted-darker leading-relaxed">
            Buat formulir pendaftaran, kuesioner, dan survei dalam hitungan
            menit. Tinggalkan proses manual yang menyita waktu, dan manfaatkan
            fitur{" "}
            <span className="bg-linear-to-r from-accent via-accent-dark to-brand bg-clip-text text-transparent font-bold">
              Ekstraksi AI
            </span>{" "}
            dari Fluens Echo untuk melipatgandakan efisiensi kerja Anda.
          </p>

          <div className="flex gap-3 w-full justify-center">
            <SecondaryAnchorBtn href="/#preview">Preview</SecondaryAnchorBtn>
            <PrimaryAnchorBtn href="/app">Coba sekarang</PrimaryAnchorBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
