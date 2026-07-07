import Link from "next/link";
import { PrimaryBtn } from "./buttons";
import { FaThList } from "react-icons/fa";

export default function Header() {
  return (
    <header className="px-6 sm:px-16 sticky top-0 z-999">
      <div className="content h-20 flex justify-between items-center">
        <a className="flex items-center sm:w-48" href="/">
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
        </a>
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
          <PrimaryBtn
            onClick={() => {
              window.navigation.navigate("/get-started");
            }}
          >
            Ayo mulai
          </PrimaryBtn>
        </div>
      </div>
    </header>
  );
}
