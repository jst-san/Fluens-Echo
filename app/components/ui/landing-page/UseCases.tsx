import {
  FaBusinessTime,
  FaClipboardList,
  FaFlask,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";

export default function UseCases() {
  return (
    <section id="use-cases" className="content pt-24">
      <div className="flex flex-col gap-12 md:gap-24 items-center">
        <h2 className="max-w-2xl text-3xl sm:text-5xl md:text-6xl font-bold text-shadow-xs md:text-shadow-sm text-shadow-brand-light text-center">
          Satu Aplikasi Untuk Berbagai Kebutuhan
        </h2>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden flex items-center justify-center bg-linear-to-b from-foreground via-muted-light to-muted p-6 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102 hover:border-brand/50 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/12 rounded-full -translate-y-12 translate-x-12 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/12 rounded-full translate-y-8 -translate-x-8 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="space-y-3 max-w-sm relative z-1">
              <div className="w-full aspect-2/1 flex items-center justify-center relative">
                <FaGraduationCap
                  className="text-brand-dark relative z-1 group-hover:scale-105 transition-transform duration-300"
                  size={80}
                />
              </div>
              <h3 className="text-xl font-bold text-center group-hover:text-brand-dark transition-colors">
                Pendidikan & Akademik
              </h3>
              <p className="text-xs text-muted-darker text-center">
                Ubah bahan ajar atau bank soal PDF menjadi kuis dan ujian
                interaktif dalam hitungan detik. Hemat waktu evaluasi, cocok
                untuk pengajar maupun peserta didik.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden flex items-center justify-center bg-linear-to-b from-foreground via-muted-light to-muted p-6 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102 hover:border-brand/50 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/12 rounded-full -translate-y-12 translate-x-12 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/12 rounded-full translate-y-8 -translate-x-8 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="space-y-3 max-w-sm relative z-1">
              <div className="w-full aspect-2/1 flex items-center justify-center relative">
                <FaClipboardList
                  className="text-brand-dark relative z-1 group-hover:scale-105 transition-transform duration-300"
                  size={80}
                />
              </div>
              <h3 className="text-xl font-bold text-center group-hover:text-brand-dark transition-colors">
                Penelitian & Survei
              </h3>
              <p className="text-xs text-muted-darker text-center">
                Ubah draf kuesioner dari dokumen PDF menjadi survei digital
                secara otomatis. Kumpulkan data dan analisis respons dengan
                lebih cepat dan presisi.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden flex items-center justify-center bg-linear-to-b from-foreground via-muted-light to-muted p-6 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102 hover:border-brand/50 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/12 rounded-full -translate-y-12 translate-x-12 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/12 rounded-full translate-y-8 -translate-x-8 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="space-y-3 max-w-sm relative z-1">
              <div className="w-full aspect-2/1 flex items-center justify-center relative">
                <FaBusinessTime
                  className="text-brand-dark relative z-1 group-hover:scale-105 transition-transform duration-300"
                  size={80}
                />
              </div>
              <h3 className="text-xl font-bold text-center group-hover:text-brand-dark transition-colors">
                Bisnis & Organisasi
              </h3>
              <p className="text-xs text-muted-darker text-center">
                Optimalkan proses pengumpulan data pelanggan secara efisien.
                Konversi dokumen PDF formulir fisik atau SOP perusahaan menjadi
                formulir digital secara otomatis.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden flex items-center justify-center bg-linear-to-b from-foreground via-muted-light to-muted p-6 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102 hover:border-brand/50 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/12 rounded-full -translate-y-12 translate-x-12 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/12 rounded-full translate-y-8 -translate-x-8 group-hover:bg-brand/10 transition-colors duration-300"></div>
            <div className="space-y-3 max-w-sm relative z-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:bg-brand/10 transition-colors duration-300"></div>
              <div className="w-full aspect-2/1 flex items-center justify-center relative">
                <FaUsers
                  className="text-brand-dark relative z-1 group-hover:scale-105 transition-transform duration-300"
                  size={80}
                />
              </div>
              <h3 className="text-xl font-bold text-center group-hover:text-brand-dark transition-colors">
                Komunitas & Acara
              </h3>
              <p className="text-xs text-muted-darker text-center">
                Kelola administrasi pendaftaran dan konfirmasi kehadiran dengan
                akurat. Ekstrak data proposal PDF Anda secara otomatis menjadi
                formulir digital siap pakai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
