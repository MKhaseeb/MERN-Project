// DroppableColumn.jsx
import { useDroppable } from "@dnd-kit/core";

export const DroppableColumn = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="space-y-4 min-h-[100px]">
      {children}
    </div>
  );
};
