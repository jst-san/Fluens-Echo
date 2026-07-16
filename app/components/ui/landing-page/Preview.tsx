export default function Preview() {
  return (
    <section id="preview" className="pt-24 content space-y-6">
      <div className="w-full max-w-3xl flex items-center justify-center justify-self-center border-4 border-border border-double rounded-3xl overflow-hidden shadow-lg">
        <video
          className="w-full aspect-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/preview-video.mp4" type="video/mp4"></source>
        </video>
      </div>
    </section>
  );
}
