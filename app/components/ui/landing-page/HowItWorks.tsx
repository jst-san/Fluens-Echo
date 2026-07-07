export default function HowItWorks() {
  return (
    <section id="how-it-works" className="content">
      <h2 className="text-4xl font-medium text-center">
        Hanya <span className="text-brand">3</span> Langkah Mudah
      </h2>
      <div className="mt-36 grid grid-cols-3 gap-6">
        <div className="relative p-6">
          <hr className="absolute w-full top-0 left-1/2 h-0.5 border-none bg-linear-to-r from-brand-dark to-brand rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-1/2 w-12 h-12 bg-brand-dark text-foreground rounded-full grid place-content-center">
            1
          </div>
          <div className="aspect-2/1"></div>
          <h3 className="text-2xl font-bold text-center">
            Daftar atau masuk ke akun
          </h3>
          <p className="text-sm text-muted-darker text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            in, dignissimos iste consequatur esse, sapiente eius a reiciendis
            veritatis hic doloremque.
          </p>
        </div>
        <div className="relative p-6">
          <hr className="absolute w-full top-0 left-1/2 h-0.5 border-none bg-linear-to-r from-brand to-brand-light rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-1/2 w-12 h-12 bg-brand text-foreground rounded-full grid place-content-center">
            2
          </div>
          <div className="aspect-2/1"></div>
          <h3 className="text-2xl font-bold text-center">
            Buat dan kreasikan formulir
          </h3>
          <p className="text-sm text-muted-darker text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            in, dignissimos iste consequatur esse, sapiente eius a reiciendis
            veritatis hic doloremque.
          </p>
        </div>
        <div className="relative p-6">
          <div className="absolute top-0 left-1/2 -translate-1/2 w-12 h-12 bg-brand-light text-foreground rounded-full grid place-content-center">
            3
          </div>
          <div className="aspect-2/1"></div>
          <h3 className="text-2xl font-bold text-center">
            Simpan dan pantau hasil
          </h3>
          <p className="text-sm text-muted-darker text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            in, dignissimos iste consequatur esse, sapiente eius a reiciendis
            veritatis hic doloremque.
          </p>
        </div>
      </div>
    </section>
  );
}
