import { PrimaryBtn } from "../buttons";

export default function ArticlesPreview() {
  return (
    <section id="articles-preview" className="content">
      <h2 className="text-4xl font-medium text-center">Artikel Terkait</h2>
      <div className="py-6">
        <div className="mx-auto max-w-5xl grid grid-cols-3 gap-3 sm:gap-6">
          <div>
            <div className="flex flex-col gap-3">
              <div className="aspect-16/10 bg-muted rounded-lg"></div>
              <div className="w-full h-8 bg-muted"></div>
              <div className="w-full h-4 bg-muted"></div>
              <div className="w-7/10 h-4 bg-muted"></div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <div className="aspect-16/10 bg-muted rounded-lg"></div>
              <div className="w-full h-8 bg-muted"></div>
              <div className="w-full h-4 bg-muted"></div>
              <div className="w-7/10 h-4 bg-muted"></div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <div className="aspect-16/10 bg-muted rounded-lg"></div>
              <div className="w-full h-8 bg-muted"></div>
              <div className="w-full h-4 bg-muted"></div>
              <div className="w-7/10 h-4 bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <PrimaryBtn className="py-3 h-max text-sm">Lihat lainnya</PrimaryBtn>
      </div>
    </section>
  );
}
