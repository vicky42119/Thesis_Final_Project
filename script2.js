let table; // Variable to hold the CSV data

// Colors for heatmap intensity (min to max)
const minColor = [0, 0, 255]; // Blue for lower values
const maxColor = [255, 230, 0]; // Red for higher values

let actualMinValue = Infinity; // Correctly initialized to Infinity
let actualMaxValue = -Infinity; // Correctly initialized to -Infinity

function preload() {
  // Adjust the file path as necessary
  table = loadTable('data.csv', 'csv', 'header',
    () => console.log('CSV data loaded successfully'),
    error => console.error('Error loading CSV file:', error));
}

function setup() {
  createCanvas(800, 1000);
  noLoop(); // No need to redraw unless the data changes
  noSmooth(); // Ensure pixelated look

  // Calculate the actual min and max values from the data
  for (let row of table.getRows()) {
    for (let col = 1; col < table.getColumnCount(); col++) { // Skip the first column (time)
      let val = row.getNum(col);
      if (!isNaN(val)) { // Check if the value is a number
        actualMinValue = min(actualMinValue, val);
        actualMaxValue = max(actualMaxValue, val);
      }
    }
  }
}

function draw() {
  background(255);

  if (!table) {
    console.error('CSV data not loaded. Check the console for preload errors.');
    return;
  }

  drawHeatmap();
}

function valueToColor(value, minValue, maxValue) {
  const normalized = map(value, minValue, maxValue, 0, 1);
  if (normalized < 100) {
    // Interpolate between minColor and midColor
    return lerpColor(color(...minColor), color(100, 255, 300), normalized * 2); // Green as a middle color
  } else {
    // Interpolate between midColor and maxColor
    return lerpColor(color(10, 255, 0), color(...maxColor), (normalized - 0.5) * 300);
  }
}

function drawHeatmap() {
    const reductionFactor = 400; // Use every 20th data point for a more pixelated look
    const numTimeSteps = Math.ceil(table.getRowCount() / reductionFactor);
    const numSensors = table.getColumnCount() - 1; // Exclude the first column (time)
    const cellHeight = 100 / numSensors;
    const cellWidth = width / numTimeSteps;
  
    // Define a small margin for white space between cells
    const cellMargin = 2; // Adjust the margin size as needed
  
    for (let i = 0; i < table.getRowCount(); i += reductionFactor) { // Increment by reductionFactor
      let reducedIndex = Math.floor(i / reductionFactor); // Calculate reduced index for drawing
      for (let j = 1; j <= numSensors; j++) { // Start at 1 to skip the time column
        const sensorValue = table.getNum(i, j);
        const cellColor = valueToColor(sensorValue, actualMinValue, actualMaxValue);
        fill(cellColor);
        noStroke();
  
        // Draw each cell with a margin
        rect(reducedIndex * cellWidth + cellMargin / 2, 
             (j - 1) * cellHeight + cellMargin / 2, 
             cellWidth - cellMargin, 
             cellHeight - cellMargin);
      }
    }
  }
  
  


