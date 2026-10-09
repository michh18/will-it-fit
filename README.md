# Will It Fit?

A small full-stack app that checks whether an item will fit through a doorway
(and, later, into a car boot).

## Status

Work in progress. Currently done:

- Fit logic in TypeScript (`shared/src/fit.ts`), with unit tests
- Original vanilla JS prototype (`index.html`, `script.js`, `styles.css`)

Planned:

- Express API with `POST /check` and CRUD for saved items
- React frontend
- Car boot mode
- Deployment

## How it works

The doorway is treated as a 2D opening. The function tries each of the item's
three dimensions as the one that travels through the door, and both rotations
of the other two across the opening. It returns the orientation with the most
spare room, in cm.

## Running the tests

    npm install
    npm test

## Known limitations

- Ignores tilting an item diagonally through the opening
- Ignores door thickness and hallway turns
- Clearance is total, not per side (2 cm means 1 cm each side)