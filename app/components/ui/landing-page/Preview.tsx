export default function Preview() {
  return (
    <section id="preview" className="content space-y-6">
      <div className="w-full max-w-3xl flex items-center justify-center justify-self-center border-4 border-border border-double rounded-3xl overflow-hidden shadow-lg">
        <div className="w-full aspect-video">
          <img src="/preview-video.png" />
        </div>
      </div>
    </section>
  );
}
