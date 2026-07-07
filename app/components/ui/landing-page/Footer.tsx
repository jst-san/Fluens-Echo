import { LuCopyright } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="pt-12 bg-foreground border-t border-border">
      <div className="container py-0">
        <div className="content grid grid-cols-3 gap-3 sm:gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">
              Fluens Form
              <hr className="w-6 border-brand" />
            </h3>
            <p className="text-muted-darker">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
              veritatis voluptate dolor voluptates architecto magni ipsam ipsum
              deserunt tenetur, esse vel, magnam, quasi facere velit sit
              repudiandae? Deserunt, praesentium ipsam!
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">
              Navigasi
              <hr className="w-6 border-brand" />
            </h3>
            <nav className="flex flex-col gap-1">
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
                Fitur
              </a>
              <a
                className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
                href="/#how-it-works"
              >
                Cara kerja
              </a>
              <a
                className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand"
                href="/articles"
              >
                Artikel
              </a>
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">
              Artikel
              <hr className="w-6 border-brand" />
            </h3>
            <nav className="flex flex-col gap-1">
              <a className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand">
                Lorem ipsum dolor sit amet
              </a>
              <a className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand">
                Lorem ipsum dolor sit amet
              </a>
              <a className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand">
                Lorem ipsum dolor sit amet
              </a>
              <a className="w-max text-sm transition-colors hover:text-muted-darker active:text-brand">
                Lorem ipsum dolor sit amet
              </a>
            </nav>
          </div>
        </div>
      </div>
      <div className="">
        <div className="container">
          <div className="content flex items-center justify-end text-muted-darker text-sm">
            <LuCopyright />
            2026 - Fluens Form
          </div>
        </div>
      </div>
    </footer>
  );
}
