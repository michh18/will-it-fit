const doorWidthInput = document.getElementById("door-width");
const doorHeightInput = document.getElementById("door-height");
const clearanceInput = document.getElementById("clearance");

const itemWidthInput = document.getElementById("item-width");
const itemHeightInput = document.getElementById("item-height");
const itemDepthInput = document.getElementById("item-depth");

const checkFitButton = document.getElementById("check-fit");
const result = document.getElementById("result");

function readNumber(input) {
    return input.value === "" ? null : Number(input.value);
}

function fitsThroughDoor(object, door, clearance = 0) {
    const [L, W, H] = object;
    const doorW = door.width - clearance;
    const doorH = door.height - clearance;

    const crossSections = [
        { name: "lengthwise", a: W, b: H },
        { name: "sideways", a: L, b: H },
        { name: "on its end", a: L, b: W },
    ];

    for (const cs of crossSections) {
        if (cs.a <= doorW && cs.b <= doorH) return { fits: true, method: cs.name, flipped: false };
        if (cs.b <= doorW && cs.a <= doorH) return { fits: true, method: cs.name, flipped: true };
    }
    return { fits: false };
}

checkFitButton.addEventListener("click", function () {
    const doorWidth = readNumber(doorWidthInput);
    const doorHeight = readNumber(doorHeightInput);
    const clearance = readNumber(clearanceInput) ?? 0;

    const itemWidth = readNumber(itemWidthInput);
    const itemHeight = readNumber(itemHeightInput);
    const itemDepth = readNumber(itemDepthInput);

    const values = [doorWidth, doorHeight, itemWidth, itemHeight, itemDepth];

    if (values.includes(null)) {
        result.textContent = "Please enter all dimensions.";
        return;
    }

    if (values.some(v => v <= 0)) {
        result.textContent = "Dimensions must be greater than 0.";
        return;
    }

    if (clearance < 0) {
        result.textContent = "Clearance can't be negative.";
        return;
    }

    const outcome = fitsThroughDoor(
        [itemDepth, itemWidth, itemHeight],
        { width: doorWidth, height: doorHeight },
        clearance
    );

    if (outcome.fits) {
        let message = `It fits! Push it through ${outcome.method}.`;
        if (outcome.flipped) {
            message += " You'll need to turn it 90° so the longer side goes up and down.";
        }
        result.textContent = message;
    } else {
        result.textContent = "Oh no. It doesn't fit.";
    }
});

