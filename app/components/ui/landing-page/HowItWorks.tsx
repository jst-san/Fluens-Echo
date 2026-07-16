export default function HowItWorks() {
  return (
    <section id="how-it-works" className="content pt-24">
      <h2 className="text-2xl sm:text-4xl font-medium text-center">
        Hanya <span className="text-brand">3</span> Langkah Mudah
      </h2>
      <div className="mt-20 md:mt-36 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6">
        <div className="relative pt-10 md:pt-6 p-6">
          <hr className="hidden md:block absolute w-full top-0 left-1/2 h-0.5 border-none bg-linear-to-r from-brand-dark to-brand rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-1/2 w-12 h-12 bg-brand-dark text-foreground rounded-full grid place-content-center">
            1
          </div>
          <div className="py-6 flex justify-center">
            <div className="w-8/10 aspect-2/1 rounded-lg overflow-hidden border-2 border-double border-border">
              <img className="object-cover" src="/images/login.png" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-center mt-4 md:mt-0">
            Daftar atau masuk ke akun
          </h3>
          <p className="text-sm text-muted-darker text-center mt-2">
            Daftar atau masuk untuk mulai menggunakan seluruh fitur dan
            mengelola formulir Anda.
          </p>
        </div>
        <div className="relative pt-10 md:pt-6 p-6">
          <hr className="hidden md:block absolute w-full top-0 left-1/2 h-0.5 border-none bg-linear-to-r from-brand to-brand-light rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-1/2 w-12 h-12 bg-brand text-foreground rounded-full grid place-content-center">
            2
          </div>
          <div className="py-6 flex justify-center">
            <div className="w-8/10 aspect-2/1 rounded-lg overflow-hidden border-2 border-double border-border">
              <img className="object-cover" src="/images/create.png" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-center mt-4 md:mt-0">
            Buat dan kreasikan formulir
          </h3>
          <p className="text-sm text-muted-darker text-center mt-2">
            Gunakan editor yang intuitif untuk membuat dan mengedit formulir
            Anda dengan efisien.
          </p>
        </div>
        <div className="relative pt-10 md:pt-6 p-6">
          <div className="absolute top-0 left-1/2 -translate-1/2 w-12 h-12 bg-brand-light text-foreground rounded-full grid place-content-center">
            3
          </div>
          <div className="py-6 flex justify-center">
            <div className="w-8/10 aspect-2/1 rounded-lg overflow-hidden border-2 border-double border-border">
              <img className="object-cover" src="/images/share.png" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-center mt-4 md:mt-0">
            Bagikan dan pantau hasil
          </h3>
          <p className="text-sm text-muted-darker text-center mt-2">
            Bagikan tautan formulir Anda kepada responden. Pantau respons yang
            masuk secara langsung.
          </p>
        </div>
      </div>
    </section>
  );
}
