document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready");
    const currentInputDisplay = document.getElementById('current-input');  // Display for current value
    const prevAnswerDisplay = document.getElementById('prev-answer');  // Display for previous answer
    const buttons = document.getElementsByClassName('btn');
    const clearButton = document.getElementById('btn-clear');  // Target the AC/CE button
    const historyDisplay = document.getElementById('history-display'); // History display section
    const historyList = document.getElementById('history-list'); // List to display history

    let currentValue = "";
    let lastAnswer = 0;  // To store the result of the last computation
    let isExponentMode = false;
    let pressTimer;  // For tracking long press
    let history = []; // Array to store history of calculations

    // Function to evaluate the current expression
    function evaluateResult() {
        console.log('current value: ', currentValue);
         // Store the original expression before evaluating
         const originalExpression = currentValue;


        const convertedValue = currentValue
            .replace("×", "*")
            .replace("÷", "/")
            .replace("%", "/100")
            .replace("sin", 'Math.sin')
            .replace("cos", 'Math.cos')
            .replace("ln", 'Math.log')
            .replace("π", 'Math.PI')
            .replace("log", 'Math.log10')
            .replace('e', 'Math.E')
            .replace("tan", 'Math.tan')
            .replace("√", 'Math.sqrt');

        try {
            const result = eval(convertedValue);
            lastAnswer = result.toString();  // Store the result

            // Update the displays
            prevAnswerDisplay.innerText = currentValue + " =";  // Show the full equation
            currentInputDisplay.innerText = lastAnswer;  // Show only the result
            currentValue = lastAnswer;  // Set currentValue to the result for next operations
// Store the result in the history
history.push(originalExpression + " = " + lastAnswer);
updateHistoryDisplay();

        } catch (error) {
            console.error(error);
            currentValue = "ERROR";
            currentInputDisplay.innerText = currentValue;
        }
    }

        // Function to update history display
        function updateHistoryDisplay() {
            // Clear the existing history list
            historyList.innerHTML = ""; // Clear existing list items
    
            // Populate the history list
            history.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item; // Set the text for the list item
                historyList.appendChild(li); // Append the list item to the history list
            });
        }

         // Event listener for the History button
    document.getElementById('btn-history').addEventListener('click', function() {
        // Toggle visibility of the history display
        historyDisplay.classList.toggle('hidden');
    });



    // Function to calculate factorial
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Function to update the clear button between "AC" and "CE"
    function updateClearButton() {
        if (currentValue.length > 0) {
            clearButton.innerText = "CE";
        } else {
            clearButton.innerText = "AC";
        }
    }

    // Event listener for AC/CE button functionality
    clearButton.addEventListener('mousedown', function () {
        // Start the timer when the button is pressed
        pressTimer = setTimeout(function () {
            // If held for long enough, clear everything (AC)
            currentValue = "";
            currentInputDisplay.innerText = currentValue;
            prevAnswerDisplay.innerText = "ANS = " + lastAnswer;  // Reset to show last answer
            updateClearButton();
        }, 500);  // Set the threshold for a long press (500ms)
    });

    clearButton.addEventListener('mouseup', function () {
        clearTimeout(pressTimer);  // Clear the long press timer
    });

    clearButton.addEventListener('mouseleave', function () {
        clearTimeout(pressTimer);  // Also clear if the user moves away from the button
    });

    clearButton.addEventListener('click', function () {
        // If the button was not held long enough for an "AC", perform the "CE" action
        if (clearButton.innerText === "CE") {
            currentValue = currentValue.slice(0, -1); // Remove the last character
            currentInputDisplay.innerText = currentValue;
            updateClearButton();  // Switch back to AC if display is empty
        }
    });

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', function () {
            const value = button.innerText;

            // Skip adding "AC" or "CE" to the display
            if (value === "AC" || value === "CE" || value === "123" || value === "fx" || value === "History") {
                return;
            }

            try {
                if (value === "=") {
                    if (isExponentMode) {
                        const [base, exponent] = currentValue.split("^");
                        currentValue = Math.pow(parseFloat(base), parseFloat(exponent)).toString();
                        isExponentMode = false;
                    } else {
                        evaluateResult();  // Calculate and display results
                    }
                } else if (value === "x!") {
                    const num = parseInt(currentValue);
                    currentValue = factorial(num).toString();
                } else if (value === "x²") {
                    currentValue = Math.pow(parseFloat(currentValue), 2).toString();
                } else if (value === "xʸ") {
                    currentValue += "^";
                    isExponentMode = true;
                } else {
                    currentValue += value;
                }

                // Update the current input display
                currentInputDisplay.innerText = currentValue;
                updateClearButton();  // Check whether to show "AC" or "CE"
            } catch (error) {
                console.error(error);
                currentValue = "ERROR";
                currentInputDisplay.innerText = currentValue;
            }
        });
    }

    // Toggle between 123 and fx operations
    document.getElementById('btn-123').addEventListener('click', function () {
        document.getElementById('simple-ops').classList.remove('hidden');
        document.getElementById('advanced-ops').classList.add('hidden');
    });

    document.getElementById('btn-fx').addEventListener('click', function () {
        document.getElementById('advanced-ops').classList.remove('hidden');
        document.getElementById('simple-ops').classList.add('hidden');
    });

    // Initialize with ANS = 0
    prevAnswerDisplay.innerText = "ANS = 0";
    currentInputDisplay.innerText = "0";  // Default display value
});
