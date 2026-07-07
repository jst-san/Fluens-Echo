import { LuCircleCheck, LuSparkles } from "react-icons/lu";
import { PrimaryBtn } from "../buttons";

export default function Benefits() {
  return (
    <section id="benefits" className="content">
      <div className="w-full">
        <div className="flex gap-6 justify-center">
          <div className="space-y-3 mt-24">
            <h2 className="max-w-xl text-6xl font-bold text-shadow-sm text-shadow-brand-light">
              Dapatkan Manfaat Tanpa Biaya
            </h2>
            <p className="text-muted-darker max-w-xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi
              laborum praesentium vero natus quibusdam voluptatibus expedita, at
              veniam. Est, voluptate. Excepturi porro in animi ullam officiis
              maxime cupiditate ipsa neque?
            </p>
            <div className="">
              <PrimaryBtn>Dapatkan sekarang</PrimaryBtn>
            </div>
          </div>
          <div className="w-112 bg-foreground p-12 rounded-3xl border border-border shadow-lg">
            <ul className="space-y-6">
              <li className="flex gap-3">
                <LuSparkles className="text-[#6f16ff]" size={24} />
                <div>
                  <h3 className="text-lg bg-linear-to-l from-[#b516ff] via-[#6f16ff] to-brand bg-clip-text text-transparent">
                    Ekstrak pertanyaan dari file PDF
                  </h3>
                  <p className="text-muted-darker text-sm border-l-2 border-border pl-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand" size={24} />
                <div>
                  <h3 className="text-lg">Lorem ipsum dolor</h3>
                  <p className="text-muted-darker text-sm border-l-2 border-border pl-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand" size={24} />
                <div>
                  <h3 className="text-lg">Lorem ipsum dolor</h3>
                  <p className="text-muted-darker text-sm border-l-2 border-border pl-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand" size={24} />
                <div>
                  <h3 className="text-lg">Lorem ipsum dolor</h3>
                  <p className="text-muted-darker text-sm border-l-2 border-border pl-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand" size={24} />
                <div>
                  <h3 className="text-lg">Lorem ipsum dolor</h3>
                  <p className="text-muted-darker text-sm border-l-2 border-border pl-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuCircleCheck className="text-brand" size={24} />
                <div>
                  <h3 className="text-lg">Lorem ipsum dolor</h3>
                  <p className="text-muted-darker text-sm border-l-2 border-border pl-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
