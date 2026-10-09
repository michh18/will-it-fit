# Will It Fit?

A small full-stack app that checks whether an item will fit through a doorway
(and, later, into a car boot).

## Status

Work in progress. Currently done:

- Original vanilla JS prototype (`legacy/`), kept for reference
- Fit logic in TypeScript (`shared/src/fit.ts`), with unit tests
- Express API with `POST /check` and CRUD for saved items (`/items`)
- Input validation using Zod
- SQLite persistence, seeded with sample items
- React frontend

Planned:

- Car boot mode
- Deployment

## How it works

The doorway is treated as a 2D opening. The function tries each of the item's
three dimensions as the one that travels through the door, and both rotations
of the other two across the opening. It returns the orientation with the most
spare room, in cm.

The Express API validates incoming requests using Zod before passing the dimensions to the fit-checking function.

## Running the app

Install dependencies for the server and the client:

```bash
npm install
npm --prefix client install
```

Start the API (in one terminal):

```bash
npm run dev
```

The first run creates a local `will-it-fit.db` file and seeds it with sample items.

Start the React client (in a second terminal):

```bash
npm run client
```

Then open `http://localhost:5173`.

## Running the tests

```bash
npm test
```

## API

### POST /check

Checks whether an item can fit through a doorway.

Example request body:

```json
{
  "item": {
    "width": 80,
    "height": 120,
    "depth": 40
  },
  "door": {
    "width": 90,
    "height": 200
  },
  "clearance": 0
}
```

All dimensions are in centimetres.

- `item`: Width, height and depth of the item
- `door`: Width and height of the doorway
- `clearance`: Optional non-negative clearance value (defaults to `0`)

The API returns the fit calculation result as JSON.

Invalid inputs return a `400 Bad Request` response with validation details.

`POST /check` also accepts `itemId` (a saved item's id) instead of `item`. Send one or the other, not both.

### /items

| Method | Path | Description |
|---|---|---|
| GET | `/items` | List saved items |
| GET | `/items/:id` | Get one item (404 if missing) |
| POST | `/items` | Create an item (`name`, `width`, `height`, `depth`) |
| DELETE | `/items/:id` | Delete an item (404 if missing) |

## Known limitations

- Ignores tilting an item diagonally through the opening
- Ignores door thickness and hallway turns
- Clearance is total, not per side (2 cm means 1 cm each side)