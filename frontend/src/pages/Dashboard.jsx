// src/pages/Dashboard.jsx
import KanbanBoard from "../kanban/KanbanBoard";
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/my-announcements").then((res) => {
      const grouped = {
        pending: [],
        ongoing: [],
        done: [],
      };

      res.data.forEach((a) => {
        grouped[a.status].push(a);
      });

      setData(grouped);
    });
  }, []);

  if (!data) return <div>Loading...</div>;

  return <KanbanBoard data={data} setData={setData} />;
}