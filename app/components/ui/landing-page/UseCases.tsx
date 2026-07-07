import {
  FaBusinessTime,
  FaClipboardList,
  FaFlask,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";

export default function UseCases() {
  return (
    <section id="use-cases" className="content">
      <div className="flex flex-col gap-24 items-center">
        <h2 className="max-w-2xl text-6xl font-bold text-shadow-sm text-shadow-brand-light text-center">
          Satu Aplikasi Untuk Berbagai Kebutuhan
        </h2>
        <div className="w-full grid grid-cols-4 gap-6">
          <div className="bg-linear-to-b from-foreground via-muted-light to-muted p-6 space-y-3 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102">
            <div className="w-full aspect-2/1 flex items-center justify-center relative">
              <FaGraduationCap className="text-brand-dark" size={96} />
            </div>
            <h3 className="text-2xl font-bold text-center">Pendidikan</h3>
            <p className="text-sm text-muted-darker text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              labore rerum sint, praesentium quam officia? Laudantium expedita
            </p>
          </div>
          <div className="bg-linear-to-b from-foreground via-muted-light to-muted p-6 space-y-3 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102">
            <div className="w-full aspect-2/1 flex items-center justify-center relative">
              <FaClipboardList className="text-brand-dark" size={96} />
            </div>
            <h3 className="text-2xl font-bold text-center">
              Penelitian & Survei
            </h3>
            <p className="text-sm text-muted-darker text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              labore rerum sint, praesentium quam officia? Laudantium expedita
            </p>
          </div>
          <div className="bg-linear-to-b from-foreground via-muted-light to-muted p-6 space-y-3 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102">
            <div className="w-full aspect-2/1 flex items-center justify-center relative">
              <FaBusinessTime className="text-brand-dark" size={96} />
            </div>
            <h3 className="text-2xl font-bold text-center">
              Bisnis & Organisasi
            </h3>
            <p className="text-sm text-muted-darker text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              labore rerum sint, praesentium quam officia? Laudantium expedita
            </p>
          </div>
          <div className="bg-linear-to-b from-foreground via-muted-light to-muted p-6 space-y-3 rounded-3xl border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:brightness-102">
            <div className="w-full aspect-2/1 flex items-center justify-center relative">
              <FaUsers className="text-brand-dark" size={96} />
            </div>
            <h3 className="text-2xl font-bold text-center">
              Komunitas & Acara
            </h3>
            <p className="text-sm text-muted-darker text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              labore rerum sint, praesentium quam officia? Laudantium expedita
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
