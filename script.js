const spaceWidthInput = document.getElementById("space-width");
const spaceHeightInput = document.getElementById("space-height");
const spaceDepthInput = document.getElementById("space-depth");

const itemWidthInput = document.getElementById("item-width");
const itemHeightInput = document.getElementById("item-height");
const itemDepthInput = document.getElementById("item-depth");

const checkFitButton = document.getElementById("check-fit");

const result = document.getElementById("result");

checkFitButton.addEventListener("click", function () {
    const spaceWidth = Number(spaceWidthInput.value);
    const spaceHeight = Number(spaceHeightInput.value); 
    const spaceDepth = Number(spaceDepthInput.value); 

    const itemWidth = Number(itemWidthInput.value);
    const itemHeight = Number(itemHeightInput.value); 
    const itemDepth = Number(itemDepthInput.value); 

    if (itemWidth <= spaceWidth && itemHeight <= spaceHeight && itemDepth <= spaceDepth) {
        result.textContent = "It fits!";
    }
    else {
        result.textContent = "Oh no. It doesn't fit";
    }
})