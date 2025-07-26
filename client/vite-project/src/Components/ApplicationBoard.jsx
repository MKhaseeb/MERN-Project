// ApplicationBoard.jsx
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

const statusOrder = ["wishlist", "applied", "interview", "offer", "rejected"];

const statusTitles = {
  wishlist: "📝 Wishlist",
  applied: "📤 Applied",
  interview: "🎤 Interview",
  offer: "💼 Offer",
  rejected: "❌ Rejected",
};

export const ApplicationBoard = ({ userId }) => {
  const [columns, setColumns] = useState({});
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/jobs/user/${userId}/applications`)
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((err) => console.error("❌ Failed to load applications:", err));
  }, [userId]);

  const findColumnKeyByItemId = (id) => {
    return Object.keys(columns).find((key) =>
      columns[key].some((i) => i.id === id)
    );
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const fromCol = findColumnKeyByItemId(active.id);
    const toCol = findColumnKeyByItemId(over.id) || over.id;

    if (!fromCol || !toCol || fromCol === toCol) return;

    const draggedItem = columns[fromCol].find((i) => i.id === active.id);

    const newFrom = columns[fromCol].filter((i) => i.id !== active.id);
    const newTo = [...columns[toCol], { ...draggedItem, status: toCol }];

    const newColumns = {
      ...columns,
      [fromCol]: newFrom,
      [toCol]: newTo,
    };
    setColumns(newColumns);

    try {
      const response = await fetch(
        `http://localhost:8000/api/jobs/${draggedItem.jobId}/applications/${draggedItem.userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newStatus: toCol }),
        }
      );

      if (!response.ok) throw new Error("Status update failed");
    } catch (err) {
      console.error("❌ Backend error:", err);
      setColumns({
        ...columns,
        [fromCol]: [...columns[fromCol], draggedItem],
        [toCol]: columns[toCol].filter((i) => i.id !== active.id),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1214] p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">
        📋 My Applications Board
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusOrder.map((status) => (
          <div
            key={status}
            className="bg-[#1c1f23] rounded-xl p-4 border border-[#2c343c]"
          >
            <h2 className="text-lg font-semibold mb-4">
              {statusTitles[status]}
            </h2>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
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
            </DndContext>
          </div>
        ))}
      </div>
    </div>
  );
};