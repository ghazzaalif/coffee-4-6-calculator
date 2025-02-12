let brewingStyle = "standard"; // Default brewing style
let timerInterval; // To store the timer interval
let currentStep = 0; // To track the current brewing step
let startTime; // To store the start time of the timer
let pausedTime = 0; // To store the elapsed time when paused
let isPaused = false; // To track if the timer is paused

// Set dark mode as default
document.documentElement.setAttribute("data-theme", "dark");

// Theme Toggle Functionality
const themeToggle = document.getElementById("dark-mode-toggle");

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});

// Brewing steps with their durations (in seconds)
const brewingSteps = [
  { time: 0, action: "1st Pour" },
  { time: 45, action: "2nd Pour" },
  { time: 90, action: "3rd Pour" },
  { time: 135, action: "4th Pour" },
  { time: 165, action: "5th Pour" },
  { time: 210, action: "Remove the coffee dripper" }
];

// Set brewing style
function setBrewingStyle(style) {
  brewingStyle = style;
  document.querySelectorAll(".style-options button").forEach(button => {
    button.classList.remove("active");
  });
  document.querySelector(`.style-options button[onclick="setBrewingStyle('${style}')"]`).classList.add("active");
}

// Auto-calculate water based on 1:15 ratio
function calculateWater() {
  const coffeeAmount = parseFloat(document.getElementById('coffeeAmount').value);

  if (!isNaN(coffeeAmount) && coffeeAmount > 0) {
    const totalWater = coffeeAmount * 15; // 1:15 ratio
    document.getElementById('totalWater').value = totalWater.toFixed(1);
  } else {
    document.getElementById('totalWater').value = "";
  }
}

// Calculate pours based on brewing style and total water
function calculatePours() {
  const coffeeAmount = parseFloat(document.getElementById('coffeeAmount').value);
  const totalWater = parseFloat(document.getElementById('totalWater').value);

  if (isNaN(coffeeAmount) || isNaN(totalWater)) {
    alert("Please enter a valid coffee amount.");
    return;
  }

  let pour1, pour2, pour3, pour4, pour5;

  // Adjust pour amounts based on brewing style
  switch (brewingStyle) {
    case "sweeter":
      pour1 = totalWater * 0.4 * 0.3; // 12% of total water
      pour2 = totalWater * 0.4 * 0.7; // 28% of total water
      pour3 = totalWater * 0.6 / 3; // 20% of total water
      pour4 = totalWater * 0.6 / 3; // 20% of total water
      pour5 = totalWater * 0.6 / 3; // 20% of total water
      break;
    case "brighter":
      pour1 = totalWater * 0.4 * 0.7; // 28% of total water
      pour2 = totalWater * 0.4 * 0.3; // 12% of total water
      pour3 = totalWater * 0.6 / 3; // 20% of total water
      pour4 = totalWater * 0.6 / 3; // 20% of total water
      pour5 = totalWater * 0.6 / 3; // 20% of total water
      break;
    default: // Standard
      pour1 = totalWater * 0.4 * 0.5; // 20% of total water
      pour2 = totalWater * 0.4 * 0.5; // 20% of total water
      pour3 = totalWater * 0.6 / 3; // 20% of total water
      pour4 = totalWater * 0.6 / 3; // 20% of total water
      pour5 = totalWater * 0.6 / 3; // 20% of total water
  }

  // Calculate cumulative water amounts
  const cumulativeWater = [
    pour1,
    pour1 + pour2,
    pour1 + pour2 + pour3,
    pour1 + pour2 + pour3 + pour4,
    pour1 + pour2 + pour3 + pour4 + pour5,
    pour1 + pour2 + pour3 + pour4 + pour5 // Total water
  ];

  // Combined timeline and pour amounts
  const steps = [
    { time: "0:00", action: "1st Pour", amount: `${pour1.toFixed(1)}g`, cumulative: `${cumulativeWater[0].toFixed(1)}g` },
    { time: "0:45", action: "2nd Pour", amount: `${pour2.toFixed(1)}g`, cumulative: `${cumulativeWater[1].toFixed(1)}g` },
    { time: "1:30", action: "3rd Pour", amount: `${pour3.toFixed(1)}g`, cumulative: `${cumulativeWater[2].toFixed(1)}g` },
    { time: "2:15", action: "4th Pour", amount: `${pour4.toFixed(1)}g`, cumulative: `${cumulativeWater[3].toFixed(1)}g` },
    { time: "2:45", action: "5th Pour", amount: `${pour5.toFixed(1)}g`, cumulative: `${cumulativeWater[4].toFixed(1)}g` },
    { time: "3:30", action: "Remove the coffee dripper", amount: "", cumulative: `${cumulativeWater[5].toFixed(1)}g` }
  ];

  let combinedHTML = "<h2>Brewing Steps</h2>";
  steps.forEach(step => {
    combinedHTML += `
      <div class="step">
        <div class="time">${step.time}</div>
        <div class="action">${step.action}</div>
        <div class="amount">${step.amount}</div>
        <div class="cumulative">${step.cumulative}</div>
      </div>
    `;
  });

  // Display the combined results
  document.getElementById('combined-results').innerHTML = combinedHTML;
}

// Start the brewing timer
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval); // Reset the timer if it's already running
  }

  if (isPaused) {
    // Resume from paused time
    startTime = performance.now() - pausedTime * 1000;
    isPaused = false;
    document.getElementById('pause-timer').textContent = 'Pause'; // Change button text back to Pause
  } else {
    // Start from the beginning
    startTime = performance.now();
    pausedTime = 0;
    currentStep = 0;
  }

  // Update button visibility
  document.getElementById('start-timer').style.display = 'none'; // Hide Start button
  document.getElementById('pause-timer').style.display = 'inline-block'; // Show Pause button
  document.getElementById('reset-timer').style.display = 'inline-block'; // Show Reset button

  // Update the timer every second
  timerInterval = setInterval(updateTimer, 1000);
}

// Pause the brewing timer
function pauseTimer() {
  if (isPaused) {
    // If already paused, resume the timer
    startTimer();
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    isPaused = true;
    pausedTime = Math.floor((performance.now() - startTime) / 1000); // Store elapsed time
    document.getElementById('pause-timer').textContent = 'Resume'; // Change button text to Resume
  }
}

// Reset the brewing timer
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  pausedTime = 0;
  currentStep = 0;
  document.getElementById('timer-display').textContent = '00:00'; // Reset timer display
  document.getElementById('start-timer').style.display = 'inline-block'; // Show Start button
  document.getElementById('pause-timer').style.display = 'none'; // Hide Pause button
  document.getElementById('reset-timer').style.display = 'none'; // Hide Reset button
  document.getElementById('pause-timer').textContent = 'Pause'; // Reset button text
}

// Update the timer display
function updateTimer() {
  const elapsedTime = Math.floor((performance.now() - startTime) / 1000); // Elapsed time in seconds
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  // Display the time in MM:SS format
  document.getElementById('timer-display').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Check if it's time for the next brewing step
  if (currentStep < brewingSteps.length && elapsedTime >= brewingSteps[currentStep].time) {
    alert(`Time for: ${brewingSteps[currentStep].action}`);
    currentStep++;
  }

  // Stop the timer after the last step
  if (elapsedTime >= brewingSteps[brewingSteps.length - 1].time) {
    clearInterval(timerInterval);
    resetTimer(); // Reset the timer
  }
}

// Handle tab visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Tab is inactive, pause the timer
    if (timerInterval && !isPaused) {
      pauseTimer();
    }
  } else {
    // Tab is active, resume the timer if it was paused
    if (isPaused) {
      startTimer();
    }
  }
});

// Initialize default brewing style
setBrewingStyle("standard");