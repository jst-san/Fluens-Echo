import { PrimaryAnchorBtn } from "./anchor-buttons";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="bg-foreground/90 border-b border-border px-6 sm:px-16 sticky top-0 z-999">
      <div className="content h-20 flex justify-between items-center">
        <a className="flex items-center sm:w-36" href="/">
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
        <nav className="hidden sm:flex gap-12">
          <a
            className="text-sm transition-colors hover:text-muted-darker active:text-brand"
            href="/"
          >
            Beranda
          </a>
          <a
            className="text-sm transition-colors hover:text-muted-darker active:text-brand"
            href="/#features"
          >
            Fitur
          </a>
          <a
            className="text-sm transition-colors hover:text-muted-darker active:text-brand"
            href="/app"
          >
            Dashboard
          </a>
        </nav>
        <MobileNav />
        <div className="hidden sm:block sm:w-36">
          <PrimaryAnchorBtn className="justify-self-end w-max h-max py-3 px-6" href="/app">Ayo mulai</PrimaryAnchorBtn>
        </div>
      </div>
    </header>
  );
}
