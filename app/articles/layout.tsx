import Link from "next/link";
import { PrimaryBtn } from "../components/ui/buttons";
import Header from "../components/ui/Header";

export default function ArticleLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
    </div>
  );
}
