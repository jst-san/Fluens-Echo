import { useFormEditorStore } from "@/stores/form-editor-store";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useRef } from "react";
import { LuChevronDown, LuChevronUp, LuMoveVertical } from "react-icons/lu";

export default function QuestionSortButtons({
  qi,
  attributes,
  listeners,
}: {
  qi: number;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}) {
  const moveQuestionByIndex = useFormEditorStore((s) => s.moveQuestionByIndex);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="absolute top-1 left-1/2 -translate-x-1/2 group/sort z-81"
      ref={ref}
    >
      <button
        type="button"
        className="cursor-grab! active:cursor-grabbing! p-1 group/drag"
        style={{ touchAction: "none" }}
        {...attributes}
        {...listeners}
      >
        <LuMoveVertical
          size={18}
          className="text-muted-darker group-active/drag:text-brand"
        />
      </button>
      <div className="absolute left-full top-1/2 -translate-y-1/2 z-50 bg-foreground p-1 flex flex-col gap-1 rounded-full border border-border opacity-0 pointer-events-none transition-all group-focus-within/sort:opacity-100 group-focus-within/sort:translate-x-1 group-focus-within/sort:pointer-events-auto">
        <button
          className="p-2 rounded-full hover:bg-muted-light active:bg-muted"
          onClick={(e) => {
            if (qi === 0) return;
            moveQuestionByIndex(qi, qi - 1);
            requestAnimationFrame(() => {
              ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            });
          }}
        >
          <LuChevronUp size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-muted-light active:bg-muted"
          onClick={() => {
            moveQuestionByIndex(qi, qi + 1);
            requestAnimationFrame(() => {
              ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            });
          }}
        >
          <LuChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
