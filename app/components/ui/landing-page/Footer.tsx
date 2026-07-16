import { FaGithub, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { LuCopyright } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="bg-foreground relative z-1">
      <div className="absolute bottom-full w-full h-32 overflow-hidden">
        <div className="absolute top-0 justify-self-center bg-brand/25 w-[120%] min-w-[960px] h-32 shape-wave"></div>
        <div className="absolute top-0 justify-self-center bg-foreground translate-y-1 w-full min-w-[800px] h-32 shape-wave"></div>
      </div>
      <div className="container py-0">
        <div className="content flex flex-col min-[480px]:items-center md:space-y-3">
          <div className="flex items-center">
            <img className="w-16" src="/fluens.png" />
            <div className="ml-2">
              <div className="font-black tracking-widest leading-5 text-2xl text-transparent bg-linear-to-bl from-brand-light via-brand to-brand-dark bg-clip-text">
                Echo
              </div>
              <hr className="border-brand my-1 rounded-full" />
              <div className="font-bold tracking-widest leading-2 text-[0.5rem] text-brand-light">
                FORM BUILDER
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-6 min-[480px]:justify-center py-6">
            <a
              className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/#preview"
            >
              Preview
            </a>
            <a
              className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/#features"
            >
              Fitur-fitur
            </a>
            <a
              className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/#benefits"
            >
              Keuntungan
            </a>
            <a
              className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/#how-it-works"
            >
              Langkah-langkah
            </a>
            <a
              className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/#use-cases"
            >
              Penggunaan
            </a>
          </nav>
          <nav className="flex gap-3">
            <a
              className="p-2 bg-brand rounded-full text-foreground transition-colors hover:bg-brand-light active:bg-brand-light"
              href="https://wa.me/62895422813909"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={24} />
            </a>
            <a
              className="p-2 bg-brand rounded-full text-foreground transition-colors hover:bg-brand-light active:bg-brand-light"
              href="https://github.com/jst-san"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={24} />
            </a>
            <a
              className="p-2 bg-brand rounded-full text-foreground transition-colors hover:bg-brand-light active:bg-brand-light"
              href="https://instagram.com/_ridwankhoiril"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} />
            </a>
          </nav>
        </div>
      </div>
      <div className="mt-12">
        <div className="container">
          <div className="content flex gap-1 items-center justify-center text-muted-darker text-sm">
            <LuCopyright />
            2026 Fluens Echo
          </div>
        </div>
      </div>
    </footer>
  );
}
