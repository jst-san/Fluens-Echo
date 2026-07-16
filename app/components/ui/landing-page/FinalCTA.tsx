import { PrimaryAnchorBtn } from "../anchor-buttons";
import { PrimaryBtn } from "../buttons";

export default function FinalCTA() {
  return (
    <section id="final-cta" className="content relative z-1 pt-24 overflow-hidden">
      <div className="absolute -z-1 inset-0 overflow-hidden">
        <div className="absolute left-0 bottom-0 w-full h-6/10 bg-brand-light/12 shape-wave"></div>
        <div className="absolute left-0 bottom-0 w-full h-4/10 bg-brand-light/12 shape-wave"></div>
      </div>
      <div className="h-auto lg:h-142! p-6 pt-24! sm:p-12 md:pt-12! bg-linear-to-bl from-brand-light/12 via-brand/18 to-brand-dark/24 rounded-t-4xl flex flex-col md:flex-row gap-8 md:gap-12 shadow-lg border border-b-0 border-muted-light items-center">
        <div className="opacity-90 max-w-sm md:max-w-none flex-1 aspect-square md:aspect-1/2 lg:self-start bg-foreground rounded-3xl overflow-hidden border-2 border-border shadow-lg lg:-translate-y-24 order-2 md:order-1 shrink-0">
          <img
            className="w-full h-full object-top object-cover"
            src="/images/form-builder-preview.png"
          />
        </div>
        <div className="md:flex-1 space-y-4 text-center md:text-left order-1 md:order-2 pb-4 md:pb-6">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight md:leading-none text-shadow-xs md:text-shadow-sm text-shadow-brand-light">
            Siap Buat Formulir Baru?
          </h2>
          <p className="max-w-sm sm:max-w-3xl text-sm md:text-base text-muted-darker">
            Mulai gunakan Fluens Echo dalam membuat dan mengelola formulir Anda.
            Rasakan peningkatan produktivitas secara langsung dan ciptakan
            pengalaman terbaik untuk responden Anda.
          </p>
          <div className="flex justify-center md:justify-start w-full">
            <PrimaryAnchorBtn href="/app">Ayo mulai</PrimaryAnchorBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
