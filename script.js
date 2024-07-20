/* VARIABLES */
let gameStarted = false; // Variable to track game start
let buttonX, buttonY, buttonWidth, buttonHeight;
let endButtonX, endButtonY, endButtonWidth, endButtonHeight;
let player;
let flames = []; // Array to store flames (obstacles)
let droplets = []; // Array to store collectible droplets
let step = 10; // Adjust this value to control movement speed
let score = 0; // Variable to track score

// Timer variables
let startTime;
let elapsedTime = 0; // In seconds
let timerRunning = false; // To track whether the timer is running

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(600, 400);
  console.log("Canvas created");
  buttonWidth = 100;
  buttonHeight = 50;
  buttonX = width / 2 - buttonWidth / 2;
  buttonY = height / 2 + 60; // Positioning button below the text

  endButtonWidth = 100;
  endButtonHeight = 50;
  endButtonX = width / 2 - endButtonWidth / 2;
  endButtonY = height / 2 + 120; // Positioning end button below the start button

  // Create player sprite (initial position doesn't matter until game starts)
  player = {
    x: width / 2,
    y: height / 2,
    width: 40,
    height: 40
  };

  // Initialize flames (adjust positions and dimensions as needed)
  flames.push(new Flame(200, 150, 30, 30));
  flames.push(new Flame(350, 250, 30, 30));

  // Initialize droplets (adjust positions and dimensions as needed)
  droplets.push(new Droplet(100, 100, 20, 20));
  droplets.push(new Droplet(400, 100, 20, 20));
  droplets.push(new Droplet(250, 300, 20, 20));
}

/* DRAW LOOP REPEATS */
function draw() {
  console.log("Drawing frame");
  background('silver');

  // Display start screen if game hasn't started
  if (!gameStarted) {
    drawStartScreen();
  } else {
    drawGameScreen();
  }
}

/* DRAW START SCREEN */
function drawStartScreen() {
  // Title
  fill('RED');
  textSize(32);
  textAlign(CENTER);
  text("Maze Game", width / 2, height / 2 - 140);

  // Display instructions
  fill('BLUE');
  textSize(20);
  textAlign(CENTER);
  text("Collect all of the blue circles.", width / 2, height / 2 - 80);
  text("Avoid the red squares.", width / 2, height / 2 - 50);
  text("See how fast you can collect them.", width / 2, height / 2 - 20);
  text("While using the arrow keys.", width / 2, height / 2 + 10);
  text("When you're done collecting click the end button.", width / 2, height / 2 + 40);
  text("Click the start button to begin.", width / 2, height / 2 + 70);
 
  // Adjusted button position
  buttonY = height / 2 + 100; // Move the button downwards

  // Draw start button
  fill('GREEN'); // Green color for button
  rect(buttonX, buttonY, buttonWidth, buttonHeight); // Centered button position

  // Text inside button
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Start", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

/* DRAW GAME SCREEN */
function drawGameScreen() {
  if (timerRunning) {
    let currentTime = millis(); // Get current time in milliseconds
    elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
  }

  // Clear and draw the background
  background('silver');

  // Draw maze, player, flames, droplets, and score
  drawMaze();

  fill(0, 0, 255);
  rect(player.x, player.y, player.width, player.height);

  for (let flame of flames) {
    flame.display();
  }
  for (let droplet of droplets) {
    droplet.display();
  }

  // Display score and elapsed time
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  text('Time: ' + nf(elapsedTime, 1, 2) + 's', 10, 40); // Display elapsed time

  // Check if player has collected all droplets
  if (droplets.length === 0) {
    // Draw end button if all droplets are collected
    fill('orange');
    rect(endButtonX, endButtonY, endButtonWidth, endButtonHeight); // Centered button position

    // Text inside end button
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("End", endButtonX + endButtonWidth / 2, endButtonY + endButtonHeight / 2);

    // No need to check further conditions or collisions
    return;
  }

  // Check for collision with flames
  for (let flame of flames) {
    if (player.x < flame.x + flame.width &&
        player.x + player.width > flame.x &&
        player.y < flame.y + flame.height &&
        player.y + player.height > flame.y) {
      endGame(false); // Player loses
      return; // Ensure no further processing in this frame
    }
  }

  // Check for collision with droplets
  for (let i = droplets.length - 1; i >= 0; i--) {
    let droplet = droplets[i];
    if (player.x < droplet.x + droplet.width &&
        player.x + player.width > droplet.x &&
        player.y < droplet.y + droplet.height &&
        player.y + player.height > droplet.y) {
      droplets.splice(i, 1); // Remove collected droplet
      score++; // Increment score
    }
  }
}

/* DRAW MAZE */
function drawMaze() {
  // Draw the maze walls
  fill(0); // Black walls
  rect(160, 10, 300, 5);
  rect(10, height / 2, 5, height - 15);
  rect(150, 60, 5, 100);
  rect(width / 2 + 35, 390, 325, 5);
  rect(50, 300, 75, 5);
  rect(340, 146, 110, 5);
  rect(340, 250, 110, 5);
  rect(285, 198, 5, 109);
  rect(185, 332, 5, 109);
  rect(190, 197, 185, 5);
  rect(395, 200, 5, 380);
}

/* END GAME */
function endGame(win) {
  timerRunning = false; // Stop the timer
  fill('green');
  textSize(30);
  textAlign(CENTER, CENTER);
  if (win) {
    text('You Win! Score: ' + score + ' Time: ' + nf(elapsedTime, 1, 2) + 's', width / 2, height / 2);
  } else {
    text('Game Over! You Hit a Flame!', width / 2, height / 2);
  }
}

/* START GAME */
function startGame() {
  gameStarted = true;
  score = 0; // Reset score
  player.x = width / 2; // Reset player position
  player.y = height / 2; // Reset player position
  startTime = millis(); // Record start time in milliseconds
  timerRunning = true; // Start the timer
  console.log("Game Started!");
}

/* MOUSE CLICKED */
function mouseClicked() {
  console.log("Mouse clicked at", mouseX, mouseY);

  // Check if start button is clicked
  if (!gameStarted && mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    startGame();
  }

  // Check if end button is clicked
  if (gameStarted && droplets.length === 0 &&
      mouseX > endButtonX && mouseX < endButtonX + endButtonWidth &&
      mouseY > endButtonY && mouseY < endButtonY + endButtonHeight) {
    endGame(true); // End the game with a win
  }
}

/* KEY PRESSED */
function keyPressed() {
  // Arrow key controls for player movement
  if (gameStarted) {
    console.log("Key pressed:", keyCode);
    if (keyCode === UP_ARROW) {
      player.y -= step;
    } else if (keyCode === DOWN_ARROW) {
      player.y += step;
    } else if (keyCode === LEFT_ARROW) {
      player.x -= step;
    } else if (keyCode === RIGHT_ARROW) {
      player.x += step;
    }
  }
}

/* FLAME CLASS */
class Flame {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  display() {
    console.log('Drawing flame at:', this.x, this.y); // Debug line
    fill('red'); // Red color for flames
    rect(this.x, this.y, this.width, this.height);
  }
}

/* DROPLET CLASS */
class Droplet {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  display() {
    fill('blue'); // Blue color for droplets
    console.log('Drawing droplet at:', this.x, this.y); // Debug line
    ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height); // Draw as ellipse
  }
}
