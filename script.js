let brewingStyle = "standard"; // Default brewing style

// Set brewing style
function setBrewingStyle(style) {
  brewingStyle = style;
  // Remove active class from all buttons
  document.querySelectorAll(".style-options button").forEach(button => {
    button.classList.remove("active");
  });
  // Add active class to the selected button
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
      // 40% of total water split into 2 pours (30% and 70%)
      pour1 = totalWater * 0.4 * 0.3; // 12% of total water
      pour2 = totalWater * 0.4 * 0.7; // 28% of total water
      // 60% of total water split into 3 pours (33.3% each)
      pour3 = totalWater * 0.6 / 3; // 20% of total water
      pour4 = totalWater * 0.6 / 3; // 20% of total water
      pour5 = totalWater * 0.6 / 3; // 20% of total water
      break;
    case "brighter":
      // 40% of total water split into 2 pours (70% and 30%)
      pour1 = totalWater * 0.4 * 0.7; // 28% of total water
      pour2 = totalWater * 0.4 * 0.3; // 12% of total water
      // 60% of total water split into 3 pours (33.3% each)
      pour3 = totalWater * 0.6 / 3; // 20% of total water
      pour4 = totalWater * 0.6 / 3; // 20% of total water
      pour5 = totalWater * 0.6 / 3; // 20% of total water
      break;
    default: // Standard
      // 40% of total water split into 2 pours (50% and 50%)
      pour1 = totalWater * 0.4 * 0.5; // 20% of total water
      pour2 = totalWater * 0.4 * 0.5; // 20% of total water
      // 60% of total water split into 3 pours (33.3% each)
      pour3 = totalWater * 0.6 / 3; // 20% of total water
      pour4 = totalWater * 0.6 / 3; // 20% of total water
      pour5 = totalWater * 0.6 / 3; // 20% of total water
  }

  // Combined timeline and pour amounts
  const steps = [
    { time: "0:00", action: "1st Pour", amount: `${pour1.toFixed(1)}g` },
    { time: "0:45", action: "2nd Pour", amount: `${pour2.toFixed(1)}g` },
    { time: "1:30", action: "3rd Pour", amount: `${pour3.toFixed(1)}g` },
    { time: "2:15", action: "4th Pour", amount: `${pour4.toFixed(1)}g` },
    { time: "2:45", action: "5th Pour", amount: `${pour5.toFixed(1)}g` },
    { time: "3:30", action: "Remove the coffee dripper", amount: "" }
  ];

  let combinedHTML = "<h2>Brewing Steps</h2>";
  steps.forEach(step => {
    combinedHTML += `
      <div class="step">
        <div class="time">${step.time}</div>
        <div class="action">${step.action}</div>
        <div class="amount">${step.amount}</div>
      </div>
    `;
  });

  // Display the combined results
  document.getElementById('combined-results').innerHTML = combinedHTML;
}

// Initialize default brewing style
setBrewingStyle("standard");