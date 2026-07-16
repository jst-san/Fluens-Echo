import { FaWrench } from "react-icons/fa";

export default function ArticlesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="relative">
        <FaWrench className="text-muted" size={96} />
      </div>
      <div className="mt-8 text-center font-bold text-2xl text-muted">
        Halaman Sedang Dikembangkan
      </div>
    </div>
  );
}
