const display = document.querySelector("#display");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let resetInput = false;

function updateDisplay(value = currentInput) {
  display.textContent = value;
}

function inputNumber(number) {
  if (resetInput || currentInput === "Error") {
    currentInput = number;
    resetInput = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (resetInput || currentInput === "Error") {
    currentInput = "0.";
    resetInput = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function calculate(left, right, operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? null : left / right;
    default:
      return right;
  }
}

function inputOperator(operator) {
  if (currentInput === "Error") {
    return;
  }

  const value = Number(currentInput);

  if (pendingOperator !== null && !resetInput) {
    const result = calculate(storedValue, value, pendingOperator);

    if (result === null || !Number.isFinite(result)) {
      showError();
      return;
    }

    storedValue = result;
    currentInput = String(result);
    updateDisplay();
  } else {
    storedValue = value;
  }

  pendingOperator = operator;
  resetInput = true;
}

function inputEquals() {
  if (pendingOperator === null || storedValue === null || currentInput === "Error") {
    return;
  }

  const result = calculate(storedValue, Number(currentInput), pendingOperator);

  if (result === null || !Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = String(result);
  storedValue = null;
  pendingOperator = null;
  resetInput = true;
  updateDisplay();
}

function deleteLast() {
  if (currentInput === "Error" || resetInput) {
    return;
  }

  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  if (currentInput === "-") {
    currentInput = "0";
  }
  updateDisplay();
}

function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  resetInput = false;
  updateDisplay();
}

function showError() {
  currentInput = "Error";
  storedValue = null;
  pendingOperator = null;
  resetInput = true;
  updateDisplay();
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    inputOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    inputDecimal();
  } else if (button.dataset.action === "equals") {
    inputEquals();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "delete") {
    deleteLast();
  }
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    inputNumber(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    inputOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    inputEquals();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearCalculator();
  } else {
    return;
  }

  event.preventDefault();
});
