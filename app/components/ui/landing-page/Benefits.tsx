import { LuCircleCheck, LuSparkles } from "react-icons/lu";

export default function Benefits() {
  return (
    <section id="benefits" className="content pt-24">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 justify-center items-center lg:items-start">
          <div className="space-y-4 md:space-y-6 mt-0 lg:mt-24 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="max-w-xl text-3xl sm:text-5xl md:text-6xl font-bold text-shadow-xs md:text-shadow-sm text-shadow-brand-light">
              Tingkatkan Produktivitas, Sepenuhnya{" "}
              <br className="hidden sm:inline" /> Gratis
            </h2>
            <p className="text-muted-darker max-w-xl text-sm md:text-base">
              Dapatkan pengalaman membuat dan mengelola formulir digital terbaik
              tanpa mengeluarkan biaya sepeser pun. Kami memastikan seluruh
              fitur Fluens Echo siap mempermudah pekerjaan Anda.
            </p>
          </div>
          <div className="w-full max-w-xl lg:w-112 bg-foreground p-6 sm:p-12 rounded-3xl border border-border shadow-lg shrink-0">
            <ul className="space-y-6">
              <li className="flex gap-3">
                <LuSparkles
                  className="text-accent-dark mt-1 shrink-0"
                  size={18}
                />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg bg-linear-to-l from-accent via-accent-dark to-brand bg-clip-text text-transparent font-semibold">
                    Tingkatkan produktivitas Anda hingga 30x lipat
                  </h3>
                  <p className="mt-1 text-muted-darker text-xs sm:text-sm border-l-2 border-border pl-2">
                    Ekstrak dokumen puluhan halaman hanya dalam hitungan menit.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand mt-1 shrink-0" size={18} />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Olah data dengan cepat dan tepat
                  </h3>
                  <p className="mt-1 text-muted-darker text-xs sm:text-sm border-l-2 border-border pl-2">
                    Dapatkan wawasan langsung untuk mengambil keputusan melalui
                    ringkasan dan laporan visual yang jelas.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand mt-1 shrink-0" size={18} />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Alur kerja yang ringkas
                  </h3>
                  <p className="mt-1 text-muted-darker text-xs sm:text-sm border-l-2 border-border pl-2">
                    Selesaikan seluruh proses dari draf hingga evaluasi di satu
                    tempat tanpa repot berpindah aplikasi.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand mt-1 shrink-0" size={18} />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Tekan pengeluaran operasional
                  </h3>
                  <p className="mt-1 text-muted-darker text-xs sm:text-sm border-l-2 border-border pl-2">
                    Gunakan Fluens Echo kapan saja tanpa memikirkan biaya
                    langganan.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
