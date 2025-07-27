import { useDroppable } from "@dnd-kit/core";

export const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 min-h-full transition-all duration-150 ${
        isOver ? "bg-[#2a2f36] ring-2 ring-blue-400 rounded-md p-2" : ""
      }`}
    >
      {children}
    </div>
  );
};
