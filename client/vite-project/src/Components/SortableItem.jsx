import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Briefcase } from "lucide-react";

export const SortableItem = ({ id, title, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [jobTitle, company] = title.split(" @ ");
  const timerRef = useRef(null);

  const handleClick = (e) => {
    // Delay to avoid triggering on drag
    timerRef.current = setTimeout(() => {
      onClick?.();
    }, 200);
  };

  const handleDragStart = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onDragStart={handleDragStart}
      className="bg-[#1b1f27] p-3 rounded-md border border-[#2d2f33] text-sm text-white cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition"
    >
      <h4 className="font-semibold leading-snug text-white mb-1">{jobTitle}</h4>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5 text-purple-400" />
          {company}
        </span>
        <span className="text-gray-500 text-[10px]">1mo</span>
      </div>
    </div>
  );
};
