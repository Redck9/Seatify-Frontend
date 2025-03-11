/*"use client";

import { useState } from "react";
import * as fabric from "fabric";
import axios from "axios";

interface Table {
  restaurantUid: string;
  xPosition: number;
  yPosition: number;
  chairsCapacity: number;
  tableUid?: string; // Assigned after saving to DB
}

interface Chair {
  tableUid: string;
  xPosition: number;
  yPosition: number;
}

interface Props {
  restaurantUid: string;
  maxTables: number; // From `tablesCapacity`
}

export default function FloorPlan({ restaurantUid, maxTables }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  // Initialize fabric.js Canvas
  /*function initCanvas() {
    const newCanvas = new fabric.Canvas("restaurantCanvas", {
      backgroundColor: "#f3f4f6",
      width: 800,
      height: 600,
    });
    setCanvas(newCanvas);
  }*/

  // Add a new table (before saving to DB)
  /*function addTable() {
    if (tables.length >= maxTables) {
      alert("Max tables reached!");
      return;
    }

    const newTable: Table = {
      restaurantUid: restaurantUid,
      xPosition: 50 + tables.length * 60, // Example positioning
      yPosition: 100,
      chairsCapacity: 4,
    };

    setTables([...tables, newTable]);

    if (canvas) {
      const rect = new fabric.Rect({
        left: newTable.xPosition,
        top: newTable.yPosition,
        fill: "brown",
        width: 50,
        height: 50,
        selectable: true,
      });

      canvas.add(rect);
      canvas.renderAll();
    }
  }

  // Save tables to DB and receive `tableUid`
  async function saveTablesToDB() {
    try {
      const savedTables = await Promise.all(
        tables.map(async (table) => {
          const response = await axios.post("http://localhost:8282/restaurant/bff/api/tables", table);
          return { ...table, tableUid: response.data.tableUid };
        })
      );

      setTables(savedTables);
      alert("Tables saved successfully!");
    } catch (error) {
      console.error("Error saving tables:", error);
    }
  }

  // Add a chair to a specific table
  function addChair(tableUid: string) {
    const table = tables.find((t) => t.tableUid === tableUid);
    if (!table) return;

    if (chairs.filter((c) => c.tableUid === tableUid).length >= table.chairsCapacity) {
      alert("Max chairs reached for this table!");
      return;
    }

    const newChair: Chair = {
      tableUid,
      xPosition: table.xPosition + 10, // Example positioning
      yPosition: table.yPosition + 60,
    };

    setChairs([...chairs, newChair]);

    if (canvas) {
      const circle = new fabric.Circle({
        left: newChair.xPosition,
        top: newChair.yPosition,
        fill: "black",
        radius: 10,
        selectable: true,
      });

      canvas.add(circle);
      canvas.renderAll();
    }
  }

  // Save chairs to DB
  async function saveChairsToDB() {
    try {
      await axios.post("http://localhost:8282/restaurant/bff/api/chairs", chairs);
      alert("Chairs saved successfully!");
    } catch (error) {
      console.error("Error saving chairs:", error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-xl font-bold">Restaurant Floor Plan</h2>

      {/* Canvas for the restaurant layout *//*}
      <canvas id="restaurantCanvas" className="border" />

      <div className="mt-4 space-x-2">
        <button onClick={addTable} className="px-4 py-2 text-white bg-blue-500 rounded">
          Add Table
        </button>
        <button onClick={saveTablesToDB} className="px-4 py-2 text-white bg-green-500 rounded">
          Save Tables
        </button>
        <button onClick={saveChairsToDB} className="px-4 py-2 text-white bg-green-500 rounded">
          Save Chairs
        </button>
      </div>

      {/* Display tables with "Add Chair" buttons *//*}
      <div className="mt-4">
        {tables.map((table) =>
          table.tableUid ? (
            <button
              key={table.tableUid}
              onClick={() => addChair(table.tableUid!)}
              className="px-3 py-1 m-2 text-white bg-gray-700 rounded"
            >
              Add Chair to Table {table.tableUid}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}*/
