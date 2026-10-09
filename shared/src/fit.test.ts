import { describe, it, expect } from "vitest";
import { fitsThroughDoor } from "./fit";

const door = { width: 80, height: 200 };

describe("fitsThroughDoor", () => {
    it("fits with room to spare", () => {
        const r = fitsThroughDoor({ width: 55, height: 153, depth: 55 }, door);
        expect(r.fits).toBe(true);
    });

    it("fits exactly with zero margin", () => {
        const r = fitsThroughDoor({ width: 80, height: 200, depth: 300 }, door);
        expect(r).toMatchObject({ fits: true, margin: 0 });
    });

    it("does not fit when every orientation is too big", () => {
        const r = fitsThroughDoor({ width: 90, height: 210, depth: 100 }, door);
        expect(r.fits).toBe(false);
    });

    it("needs rotation: wide item goes through upright", () => {
        const r = fitsThroughDoor({ width: 150, height: 60, depth: 300 }, door);
        expect(r).toMatchObject({ fits: true, horizontal: "height", vertical: "width" });
    });

    it("clearance can turn a fit into a non-fit", () => {
        const item = { width: 79, height: 199, depth: 300 };
        expect(fitsThroughDoor(item, door, 0).fits).toBe(true);
        expect(fitsThroughDoor(item, door, 2).fits).toBe(false);
    });

    it("picks the orientation with the most margin", () => {
        const r = fitsThroughDoor({ width: 70, height: 190, depth: 40 }, door);
        expect(r).toMatchObject({
            fits: true, margin: 40, leads: "height",
            horizontal: "depth",
            vertical: "width",
        });
    });

    it("bookcase box only fits end-first through a 78x200 door", () => {
        const r = fitsThroughDoor({ width: 80, height: 202, depth: 28 }, { width: 78, height: 200 }, 2);
        expect(r).toMatchObject({ fits: true, margin: 48, leads: "height" });
    });
});