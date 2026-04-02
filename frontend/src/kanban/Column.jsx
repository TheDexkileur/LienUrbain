// src/kanban/Column.jsx
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";

export default function Column({ id, items }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-100 p-4 w-1/3 rounded-xl"
        >
          <h2 className="font-bold mb-2">{id}</h2>

          {items.map((item, index) => (
            <Card key={item.id} item={item} index={index} />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}