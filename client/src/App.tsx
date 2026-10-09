import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { FitResult } from "../../shared/src/fit";
import FitDiagram from "./FitDiagram";

type SavedItem = { id: number; name: string; width: number; height: number; depth: number };

export default function App() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [itemId, setItemId] = useState("");
  const [doorWidth, setDoorWidth] = useState("");
  const [doorHeight, setDoorHeight] = useState("");
  const [clearance, setClearance] = useState("2");
  const [result, setResult] = useState<FitResult | null>(null);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [newWidth, setNewWidth] = useState("");
  const [newHeight, setNewHeight] = useState("");
  const [newDepth, setNewDepth] = useState("");

  useEffect(() => {
    fetch("/items")
      .then((r) => r.json())
      .then((data: SavedItem[]) => {
        setItems(data);
        if (data.length > 0) setItemId(String(data[0].id));
      })
      .catch(() => setError("Couldn't load items. Is the server running?"));
  }, []);

  const item = items.find((i) => String(i.id) === itemId);

  // Updates a field and clears any stale result
  function edit(setter: (v: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setResult(null);
    };
  }

  async function handleCheck() {
    setError("");
    setResult(null);
    try {
      const res = await fetch("/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: Number(itemId),
          door: { width: Number(doorWidth), height: Number(doorHeight) },
          clearance: Number(clearance),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          res.status === 404
            ? "That item no longer exists."
            : "Please check your numbers: dimensions must be positive."
        );
        return;
      }
      setResult(data);
    } catch {
      setError("Couldn't reach the server.");
    }
  }

  async function handleAddItem() {
    setError("");
    try {
      const res = await fetch("/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          width: Number(newWidth),
          height: Number(newHeight),
          depth: Number(newDepth),
        }),
      });
      if (!res.ok) {
        setError("Couldn't add the item. Check the name and that all sizes are positive.");
        return;
      }
      const created: SavedItem = await res.json();
      setItems((prev) => [...prev, created]);
      setItemId(String(created.id));
      setResult(null);
      setNewName("");
      setNewWidth("");
      setNewHeight("");
      setNewDepth("");
    } catch {
      setError("Couldn't reach the server.");
    }
  }

  return (
    <main style={{ maxWidth: 500, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Will It Fit?</h1>

      <h2>Item</h2>
      <select
        value={itemId}
        onChange={(e) => {
          setItemId(e.target.value);
          setResult(null);
        }}
      >
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name} ({i.width} × {i.height} × {i.depth} cm)
          </option>
        ))}
      </select>

      <h3>Add your own item</h3>
      <label>
        Name
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </label>
      <label>
        Width (cm)
        <input type="number" min="0" value={newWidth} onChange={(e) => setNewWidth(e.target.value)} />
      </label>
      <label>
        Height (cm)
        <input type="number" min="0" value={newHeight} onChange={(e) => setNewHeight(e.target.value)} />
      </label>
      <label>
        Depth (cm)
        <input type="number" min="0" value={newDepth} onChange={(e) => setNewDepth(e.target.value)} />
      </label>
      <button
        onClick={handleAddItem}
        disabled={!newName.trim() || !newWidth || !newHeight || !newDepth}
      >
        Add item
      </button>

      <h2>Doorway</h2>
      <label>
        Width (cm)
        <input type="number" min="0" value={doorWidth} onChange={edit(setDoorWidth)} />
      </label>
      <label>
        Height (cm)
        <input type="number" min="0" value={doorHeight} onChange={edit(setDoorHeight)} />
      </label>
      <label>
        Total clearance (cm)
        <input type="number" min="0" value={clearance} onChange={edit(setClearance)} />
      </label>

      <button onClick={handleCheck} disabled={!itemId || !doorWidth || !doorHeight}>
        Check fit
      </button>

      <div aria-live="polite">
        {error && <p>{error}</p>}
        {result && !result.fits && <p>Oh no. It doesn't fit.</p>}
        {result && result.fits && item && (
          <>
            <p>
              It fits with {result.margin.toFixed(1)} cm to spare. Feed the {item[result.leads]} cm edge
              through first, with the {item[result.horizontal]} cm side across the doorway and the{" "}
              {item[result.vertical]} cm side running up and down.
            </p>
            <FitDiagram
              doorWidth={Number(doorWidth)}
              doorHeight={Number(doorHeight)}
              clearance={Number(clearance)}
              itemAcross={item[result.horizontal]}
              itemUp={item[result.vertical]}
              fits={true}
            />
            <figcaption>Cross-section as seen from the front of the door</figcaption>
          </>
        )}
      </div>
    </main>
  );
}