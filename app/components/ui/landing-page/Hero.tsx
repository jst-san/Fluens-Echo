import { PrimaryBtn, SecondaryBtn } from "../buttons";

export default function Hero() {
  return (
    <section id="hero" className="h-max min-h-128 flex items-center">
      <div className="container w-full flex flex-col items-center">
        <div className="content flex flex-col items-center text-center space-y-3 relative">
          <h1 className="max-w-2xl text-7xl font-bold text-shadow-sm text-shadow-brand-light">
            Buat Form, Kuisioner Online Cepat dan Mudah
          </h1>
          <p className="max-w-3xl text-muted-darker">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            voluptatibus, repellendus laudantium quo accusamus numquam! Hic
            earum saepe unde. Ullam, blanditiis iusto officia obcaecati labore
            dicta quam eveniet voluptatem illo.
          </p>
          <div className="flex gap-3">
            <SecondaryBtn>Dokumentasi</SecondaryBtn>
            <PrimaryBtn>Coba sekarang</PrimaryBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
