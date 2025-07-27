import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { DroppableColumn } from "./DroppableColumn";
import {
  FileText,
  Send,
  Mic,
  Trophy,
  XCircle,
  Plus,
} from "lucide-react";

const statusOrder = ["wishlist", "applied", "interview", "offer", "rejected"];
const statusMeta = {
  wishlist: { icon: <FileText size={16} />, label: "Wishlist" },
  applied: { icon: <Send size={16} />, label: "Applied" },
  interview: { icon: <Mic size={16} />, label: "Interview" },
  offer: { icon: <Trophy size={16} />, label: "Offer" },
  rejected: { icon: <XCircle size={16} />, label: "Rejected" },
};

export const ApplicationBoard = ({ userId }) => {
  const [columns, setColumns] = useState({});
  const sensors = useSensors(useSensor(PointerSensor));

  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/user/${userId}/applications`);
      const data = await res.json();

      const grouped = {
        wishlist: [],
        applied: [],
        interview: [],
        offer: [],
        rejected: [],
      };

      data.forEach((app) => {
        const col = app.status || "applied";
        grouped[col].push({
          id: `${app.jobId}-${app.userId}`,
          jobId: app.jobId,
          userId: app.userId,
          title: `${app.title} @ ${app.company}`,
          status: col,
        });
      });

      setColumns(grouped);
    } catch (err) {
      console.error("❌ Failed to load applications:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchApplications();
  }, [userId]);

  const findColumnKeyByItemId = (id) =>
    Object.keys(columns).find((key) =>
      columns[key].some((i) => i.id === id)
    );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const fromCol = findColumnKeyByItemId(active.id);
    const toCol = statusOrder.includes(over.id)
      ? over.id
      : findColumnKeyByItemId(over.id);

    if (!fromCol || !toCol || fromCol === toCol) return;

    const draggedItem = columns[fromCol].find((i) => i.id === active.id);
    const newFrom = columns[fromCol].filter((i) => i.id !== active.id);
    const newTo = [...columns[toCol], { ...draggedItem, status: toCol }];

    setColumns({ ...columns, [fromCol]: newFrom, [toCol]: newTo });

    try {
      await fetch(
        `http://localhost:8000/api/jobs/${draggedItem.jobId}/applications/${draggedItem.userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newStatus: toCol }),
        }
      );
      setTimeout(fetchApplications, 300);
    } catch (err) {
      console.error("❌ Backend failed:", err);
      setColumns({
        ...columns,
        [fromCol]: [...columns[fromCol], draggedItem],
        [toCol]: columns[toCol].filter((i) => i.id !== draggedItem.id),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1214] p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        📋 My Applications Board
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px border border-[#202427] bg-[#202427] rounded-xl overflow-hidden min-h-[calc(100vh-8rem)]">
          {statusOrder.map((status) => {
            const Icon = statusMeta[status].icon;
            const label = statusMeta[status].label;
            const count = columns[status]?.length || 0;

            return (
              <div key={status} className="bg-[#16191d] flex flex-col px-4 py-4">
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-white font-semibold">
                    {Icon}
                    {label.toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-400">{count} Jobs</span>
                </div>

                {/* Add button placeholder */}
                <button className="flex items-center justify-center border border-[#2a2d31] text-gray-400 hover:text-white hover:border-blue-500 transition rounded-md py-1 mb-3">
                  <Plus size={16} />
                </button>

                {/* Droppable list */}
                <div className="flex-1 space-y-3">
                  <SortableContext
                    items={(columns[status] || []).map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn id={status}>
                      {(columns[status] || []).map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          title={item.title}
                        />
                      ))}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};
