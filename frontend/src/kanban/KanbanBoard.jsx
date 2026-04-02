// src/kanban/KanbanBoard.jsx
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import API from "../api/axios.js";

export default function KanbanBoard({ data, setData }) {
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceCol = data[source.droppableId];
    const destCol = data[destination.droppableId];

    const [moved] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, moved);

    moved.status = destination.droppableId;

    setData({ ...data });

    // 🔥 UPDATE API obligatoire
    await API.patch(`/announcements/${moved.id}`, {
      status: moved.status,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {Object.entries(data).map(([key, items]) => (
          <Column key={key} id={key} items={items} />
        ))}
      </div>
    </DragDropContext>
  );
}