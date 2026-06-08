// Object references for color display
const colorBox = document.querySelector('.color-box');
const colorValue = document.querySelector('.color-value');

//  Object references for RGB sliders
const redInput = document.getElementById('red');
const greenInput = document.getElementById('green');
const blueInput = document.getElementById('blue');

// Object references for other buttons
const randomizeBtn = document.getElementById('randomize-btn');
const toggleHexBtn = document.getElementById('toggle-hex-btn');
const saveColorBtn = document.getElementById('save-color-btn');

// Can be 'rgb' or 'hex'
let colorDisplayMode = 'rgb';
let colorIsDark = false;

// Function that will run when the page loads
// Anything that we need to set up before the user interacts with the page can go here
function init() {
    randomizeColor();
    colorDisplayMode = 'rgb'; 
}

// Function that will update the color display based on RGB slider values
function updateColor() {
    const r = parseInt(redInput.value);
    const g = parseInt(greenInput.value);
    const b = parseInt(blueInput.value);

    const color = `rgb(${r}, ${g}, ${b})`;
    
    colorBox.style.backgroundColor = color;

    if (colorDisplayMode === 'rgb') {
        colorValue.textContent = color.toUpperCase();
    } else {
        colorValue.textContent = rgbToHex(r, g, b).toUpperCase();
    }

    document.documentElement.style.setProperty('--current-color', color);

    colorIsDark = isDarkColor(r, g, b);
    document.documentElement.style.setProperty('--fg-color', colorIsDark ? 'var(--fg-color-dark)' : 'var(--fg-color-light)');
}


// Call the init function to set up the page when it loads
init();

// Add event listeners to update color when sliders change
redInput.addEventListener('input', updateColor);
greenInput.addEventListener('input', updateColor);
blueInput.addEventListener('input', updateColor);


// Event listener for the randomize button
randomizeBtn.addEventListener('click', randomizeColor);

// Event listener for the toggle display mode button
toggleHexBtn.addEventListener('click', () => {
    colorDisplayMode = colorDisplayMode === 'rgb' ? 'hex' : 'rgb';
    updateColor();
});

saveColorBtn.addEventListener('click', () => {
    const savedColorsContainer = document.querySelector('.saved-colors');

    const savedColor = document.querySelector('.saved-color-template').content.cloneNode(true);
    savedColorsContainer.appendChild(savedColor);
    
    const newSavedColorBox = document.querySelector('.saved-color-box:last-child');

    newSavedColorBox.style.backgroundColor = colorBox.style.backgroundColor;

    newSavedColorBox.addEventListener('click', (e) => {
        const bgColor = e.target.style.backgroundColor;
        const rgbValues = bgColor.match(/\d+/g).map(Number);

        redInput.value = rgbValues[0];
        greenInput.value = rgbValues[1];
        blueInput.value = rgbValues[2];

        updateColor();
    });

    newSavedColorBox.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.target.remove();
    });
});







// HELPER FUNCTIONS
// Below are some functions that execute specific tasks that are useful to us

// Helper function that converts RGB values to Hex format
// For example, rgb(255, 255, 255) -> #FFFFFF
function rgbToHex(r, g, b) {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// This function simply returns a random integer between 0 and 255
function rand255() {
    return Math.floor(Math.random() * 256);
}

// Function to generate a random color and update the display
function randomizeColor() {
    const r = rand255();
    const g = rand255();
    const b = rand255();

    redInput.value = r;
    greenInput.value = g;
    blueInput.value = b;

    updateColor();
}

function calculateLuminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isDarkColor(r, g, b) {
    const luminance = calculateLuminance(r, g, b);
    return luminance < 128;
}