import { PrimaryBtn } from "../buttons";

export default function FinalCTA() {
  return (
    <section id="final-cta" className="content relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-full h-6/10 bg-brand-light/12 [clip-path:shape(from_0_100%,vline_to_0,curve_to_37.5%_5rem_with_25%_5rem,curve_to_62.5%_3rem_with_50%_5rem,curve_to_100%_0_with_75%_1rem,vline_to_100%,_hline_to_0)]"></div>
      <div className="absolute left-0 bottom-0 w-full h-4/10 bg-brand-light/12 [clip-path:shape(from_0_100%,vline_to_0,curve_to_37.5%_5rem_with_25%_5rem,curve_to_62.5%_3rem_with_50%_5rem,curve_to_100%_0_with_75%_1rem,vline_to_100%,_hline_to_0)]"></div>
      <div className="h-142! p-12 bg-linear-to-bl from-brand-light/12 via-brand/18 to-brand-dark/24 rounded-t-4xl flex gap-12 overflow-hidden shadow-lg border border-b-0 border-muted-light">
        <div className="w-142 aspect-3/4 h-max bg-foreground rounded-3xl border-2 border-border shadow-lg translate-y-12"></div>
        <div className="flex-1 space-y-3 self-end">
          <h2 className="max-w-2xl text-7xl font-bold text-shadow-sm text-shadow-brand-light">
            Buat Form Pertamamu Sekarang
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam ex
            nostrum soluta quia veniam ad fugit, alias iste, laudantium vitae
            quos adipisci. Nisi, mollitia qui recusandae officia nesciunt
            quibusdam doloribus?
          </p>
          <PrimaryBtn>Ayo mulai</PrimaryBtn>
        </div>
      </div>
    </section>
  );
}
