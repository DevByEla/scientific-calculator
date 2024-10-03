document.addEventListener("DOMContentLoaded", function() {
    console.log("Document is ready");
    const display = document.getElementById('calc-display');
    const buttons = document.getElementsByClassName('btn');
    const clearButton = document.getElementById('btn-clear');  // Target the AC/CE button
   
    let currentValue = "";
    let isExponentMode = false;
    let pressTimer;  // For tracking long press

    // Function to evaluate the current expression
    function evaluateResult() {
        console.log('current value: ', currentValue);
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
            currentValue = result.toString(); 
            display.value = currentValue;
        } catch (error) {
            console.error(error);
            currentValue = "ERROR";
            display.value = currentValue;
        }
    }

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
    clearButton.addEventListener('mousedown', function() {
        // Start the timer when the button is pressed
        pressTimer = setTimeout(function() {
            // If held for long enough, clear everything (AC)
            currentValue = "";  
            display.value = currentValue;
            updateClearButton();
        }, 500);  // Set the threshold for a long press (500ms)
    });

    clearButton.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);  // Clear the long press timer
    });

    clearButton.addEventListener('mouseleave', function() {
        clearTimeout(pressTimer);  // Also clear if the user moves away from the button
    });

    clearButton.addEventListener('click', function() {
        // If the button was not held long enough for an "AC", perform the "CE" action
        if (clearButton.innerText === "CE") {
            currentValue = currentValue.slice(0, -1); // Remove the last character
            display.value = currentValue;
            updateClearButton(); // Switch back to AC if display is empty
        }
    });

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', function() {
            const value = button.innerText;

            // Skip adding "AC" or "CE" to the display
            if (value === "AC" || value === "CE" || value === "123" || value === "fx") {
                return;
            }

            try {
                if (value === "=") {
                    if (isExponentMode) {
                        const [base, exponent] = currentValue.split("^");
                        currentValue = Math.pow(parseFloat(base), parseFloat(exponent)).toString();
                        isExponentMode = false;
                    } else {
                        evaluateResult();
                    }
                    display.value = currentValue;
                } else if (value === "x!") {
                    const num = parseInt(currentValue);
                    currentValue = factorial(num).toString();
                    display.value = currentValue;
                } else if (value === "x²") {
                    currentValue = Math.pow(parseFloat(currentValue), 2).toString();
                    display.value = currentValue;
                } else if (value === "xʸ") {
                    currentValue += "^";
                    isExponentMode = true;
                } else if (isExponentMode) {
                    currentValue += value;
                    display.value = currentValue;
                } else {
                    currentValue += value;
                    display.value = currentValue;
                }

                updateClearButton();  // Check whether to show "AC" or "CE"
            } catch (error) {
                console.error(error);
                currentValue = "ERROR";
                display.value = currentValue;
            }
        });
    }

    // Toggle between 123 and fx operations
    document.getElementById('btn-123').addEventListener('click', function() {
        document.getElementById('simple-ops').classList.remove('hidden');
        document.getElementById('advanced-ops').classList.add('hidden');
    });

    document.getElementById('btn-fx').addEventListener('click', function() {
        document.getElementById('advanced-ops').classList.remove('hidden');
        document.getElementById('simple-ops').classList.add('hidden');
    });
});
