// src/kanban/Card.jsx
import { Draggable } from "@hello-pangea/dnd";

export default function Card({ item, index }) {
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          className="bg-white p-3 rounded shadow mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3 className="font-bold">{item.title}</h3>
        </div>
      )}
    </Draggable>
  );
}