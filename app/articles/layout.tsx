import Link from "next/link";
import { PrimaryBtn } from "../components/ui/buttons";

export default function ArticleLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="">
      <header className="px-6 sm:px-16 sticky top-0 z-999">
        <div className="content h-20 flex justify-between items-center">
          <div className="flex items-center sm:w-48">
            <img className="w-16" src="/fluens.png" />
            <div className="ml-2 font-bold tracking-widest text-2xl text-transparent bg-linear-to-l from-brand-light via-brand to-brand-dark bg-clip-text">
              Form
            </div>
          </div>
          <nav className="flex gap-3 sm:gap-6">
            <Link
              className="text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/"
              as="/"
            >
              Beranda
            </Link>
            <a
              className="text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/#features"
            >
              Fitur
            </a>
            <Link
              className="text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="/app"
              as="/app"
            >
              Dashboard
            </Link>
            <Link
              className="text-sm transition-colors hover:text-muted-darker active:text-brand"
              href="#"
              as="/articles"
            >
              Artikel
            </Link>
          </nav>
          <div className="sm:w-48">
            <PrimaryBtn>Ayo mulai</PrimaryBtn>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
