export type Item = { width: number; height: number; depth: number };
export type Door = { width: number; height: number };
export type Dim = "width" | "height" | "depth";

export type FitResult =
  | { fits: false }
  | { fits: true; margin: number; leads: Dim; horizontal: Dim; vertical: Dim };

export function fitsThroughDoor(item: Item, door: Door, clearance = 0): FitResult {
  const doorW = door.width - clearance;
  const doorH = door.height - clearance;
  const dims: Dim[] = ["width", "height", "depth"];

  let best: FitResult = { fits: false };

  for (const leads of dims) {
    const [a, b] = dims.filter((d) => d !== leads);
    for (const [horizontal, vertical] of [[a, b], [b, a]] as [Dim, Dim][]) {
      const margin = Math.min(doorW - item[horizontal], doorH - item[vertical]);
      if (margin >= 0 && (!best.fits || margin > best.margin)) {
        best = { fits: true, margin, leads, horizontal, vertical };
      }
    }
  }
  return best;
}