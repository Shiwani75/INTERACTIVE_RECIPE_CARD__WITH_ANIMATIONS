document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const toggleIngredientsBtn = document.getElementById('toggle-ingredients-btn');
    const ingredientsList = document.getElementById('ingredients-list');
    const toggleInstructionsBtn = document.getElementById('toggle-instructions-btn');
    const instructionsList = document.getElementById('instructions-list');
    const instructionItems = document.querySelectorAll('.instruction-item');
    const prevStepBtn = document.getElementById('prev-step-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const startTimerBtn = document.getElementById('start-timer-btn');
    const timerDisplay = document.getElementById('timer');
    const printRecipeBtn = document.getElementById('print-recipe-btn');
    const prepTimeDisplay = document.getElementById('prep-time-display');
    const completionMessage = document.getElementById('completion-message'); // NEW: Get completion message element

    let currentStep = 0; // Tracks the current instruction step (0-indexed)
    let timerInterval;
    // Extract minutes from "60 minutes" - assuming format like "XX minutes"
    let totalPrepMinutes = parseInt(prepTimeDisplay.textContent.match(/\d+/)[0]);
    let timeLeft = totalPrepMinutes * 60; // Convert to seconds

    // --- Helper Functions ---

    /**
     * Toggles the visibility of an element by adding/removing 'visible' and 'hidden' classes.
     * Updates button text accordingly.
     * @param {HTMLElement} element - The element to toggle.
     * @param {HTMLElement} button - The button that triggers the toggle.
     * @param {string} showText - Text for the button when element is hidden.
     * @param {string} hideText - Text for the button when element is visible.
     */
    function toggleVisibility(element, button, showText, hideText) {
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
            element.classList.add('visible');
            button.textContent = hideText;
        } else {
            element.classList.remove('visible');
            element.classList.add('hidden');
            button.textContent = showText;
        }
    }

    /**
     * Updates the display of the timer.
     */
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Updates the active instruction step in the UI and manages completion message.
     */
    function updateInstructionDisplay() {
        instructionItems.forEach((item, index) => {
            if (index === currentStep) {
                item.classList.add('active-instruction');
            } else {
                item.classList.remove('active-instruction');
            }
        });

        // Enable/disable navigation buttons
        prevStepBtn.disabled = currentStep === 0;

        if (currentStep === instructionItems.length - 1) {
            nextStepBtn.disabled = true;
            // Show completion message
            completionMessage.classList.remove('hidden');
            completionMessage.classList.add('visible');
            // Optionally, hide next/prev buttons when completed
            prevStepBtn.classList.add('hidden');
            nextStepBtn.classList.add('hidden');

        } else {
            nextStepBtn.disabled = false;
            // Hide completion message if not on last step
            completionMessage.classList.remove('visible');
            completionMessage.classList.add('hidden');
            // Show next/prev buttons
            prevStepBtn.classList.remove('hidden');
            nextStepBtn.classList.remove('hidden');
        }
    }

    // --- Event Listeners ---

    // 1. Toggle Ingredients
    toggleIngredientsBtn.addEventListener('click', () => {
        toggleVisibility(ingredientsList, toggleIngredientsBtn, 'Show Ingredients', 'Hide Ingredients');
    });

    // 2. Toggle Instructions (initial state or a full reveal)
    toggleInstructionsBtn.addEventListener('click', () => {
        toggleVisibility(instructionsList, toggleInstructionsBtn, 'Show Instructions', 'Hide Instructions');
        if (instructionsList.classList.contains('visible')) {
            // If showing instructions, ensure the first step is active
            if (instructionItems.length > 0 && currentStep === 0) {
                instructionItems[0].classList.add('active-instruction');
            }
        } else {
            // If hiding, remove active state from all and reset step
            instructionItems.forEach(item => item.classList.remove('active-instruction'));
            currentStep = 0; // Reset to first step if instructions are hidden
        }
        updateInstructionDisplay(); // Re-evaluate button states and completion message
    });


    // 3. Instruction Step Navigation
    nextStepBtn.addEventListener('click', () => {
        if (currentStep < instructionItems.length - 1) {
            currentStep++;
            updateInstructionDisplay();
        }
    });

    prevStepBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateInstructionDisplay();
        }
    });

    // 4. Start Timer Functionality
    startTimerBtn.addEventListener('click', () => {
        if (timerInterval) { // Clear existing timer if any
            clearInterval(timerInterval);
        }

        // Reset timeLeft if starting after it finished or was manually stopped
        if (timeLeft <= 0 || startTimerBtn.textContent === "Timer Running...") {
             timeLeft = totalPrepMinutes * 60; // Reset to full time
        }

        updateTimerDisplay(); // Display initial time

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerDisplay.textContent = "00:00 - Done!";
                startTimerBtn.disabled = true; // Disable button after timer finishes
                startTimerBtn.textContent = "Time's Up!";
                alert("Cooking time is up!");
            }
        }, 1000); // Update every second

        startTimerBtn.textContent = "Timer Running...";
        startTimerBtn.disabled = true; // Disable button once timer starts
    });

    // 5. Print Functionality
    printRecipeBtn.addEventListener('click', () => {
        window.print();
    });

    // --- Initial Setup ---
    updateInstructionDisplay(); // Set initial active instruction and button states
    updateTimerDisplay(); // Display initial preparation time on timer
});