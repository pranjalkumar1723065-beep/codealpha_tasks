
const result = document.getElementById("result");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;
let justCalculated = false;

function updateDisplay() {
  result.value = current;
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  waitingForNumber = false;
  justCalculated = false;
  expression.textContent = "";
  updateDisplay();
}

function inputNumber(number) {
  if (current === "Error" || waitingForNumber || justCalculated) {
    current = number === "." ? "0." : number;
    waitingForNumber = false;
    justCalculated = false;
  } else if (number === ".") {
    if (!current.includes(".")) current += ".";
  } else {
    current = current === "0" ? number : current + number;
  }

  updateDisplay();
}

function formatNumber(number) {
  if (!Number.isFinite(number)) return "Error";

  return String(Number(number.toPrecision(12)));
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    case "%": return a % b;
    default: return b;
  }
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;

  const input = Number(current);

  if (operator && !waitingForNumber) {
    const answer = calculate(previous, input, operator);
    current = formatNumber(answer);
    updateDisplay();

    if (current === "Error") {
      expression.textContent = "Cannot divide by zero";
      previous = null;
      operator = null;
      waitingForNumber = true;
      return;
    }

    previous = Number(current);
  } else {
    previous = input;
  }

  operator = nextOperator;
  waitingForNumber = true;
  justCalculated = false;
  expression.textContent = `${current} ${operator}`;
}

function showResult() {
  if (operator === null || previous === null || current === "Error") {
    return;
  }

  const first = previous;
  const second = Number(current);
  const op = operator;
  const answer = calculate(first, second, op);

  expression.textContent = `${first} ${op} ${second} =`;
  current = formatNumber(answer);

  operator = null;
  previous = null;
  waitingForNumber = true;
  justCalculated = true;

  updateDisplay();
}

function deleteLast() {
  if (current === "Error" || justCalculated) {
    current = "0";
    justCalculated = false;
  } else if (waitingForNumber) {
    return;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : "0";

    if (current === "-") current = "0";
  }

  updateDisplay();
}

function toggleSign() {
  if (current === "Error") return;

  current = String(-Number(current));
  justCalculated = false;
  updateDisplay();
}

// Handle calculator buttons
buttons.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.value !== undefined) {
    const value = button.dataset.value;

    if ("0123456789.".includes(value) && value.length === 1) {
      inputNumber(value);
    } else {
      chooseOperator(value);
    }

    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteLast();
      break;
    case "sign":
      toggleSign();
      break;
    case "calculate":
      showResult();
      break;
  }
});

// Keyboard support
document.addEventListener("keydown", event => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    inputNumber(key);
  } else if (["+", "-", "*", "/", "%"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    showResult();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});

updateDisplay();
