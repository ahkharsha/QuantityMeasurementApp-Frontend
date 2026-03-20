/*
 * Application State and Initialization Module
 * Handles global state management and DOM lifecycle events.
 * @author Developer
 * @version 1.0
 */

import { getUnits, getConversion, saveHistory, getHistory } from './api.js';
import { populateDropdown, setActive, showResult, toggleOperators, renderHistory } from './ui.js';
import { applyConversion, evaluateExpression, compareValues } from './conversion.js';

export const state = {
    type: "Length",
    action: "Conversion",
    fromVal: null,
    fromUnit: "",
    toVal: null, 
    toUnit: "",
    operator: "+"
};

// Runs conversion, comparison or arithmetic and displays result.
export async function calculate() {
    if (state.fromVal === null || state.fromVal === undefined || state.fromVal === "") return;
    if (!state.fromUnit || !state.toUnit) return;

    try {
        let resultVal, expression, resultText;

        if (state.action === "Conversion") {
            if (state.fromUnit === state.toUnit) {
                resultVal = state.fromVal;
            } else {
                const conv = await getConversion(state.fromUnit, state.toUnit);
                resultVal = applyConversion(state.fromVal, conv);
            }
            expression = `${state.fromVal} ${state.fromUnit} to ${state.toUnit}`;
            resultText = `${resultVal} ${state.toUnit}`;
            showResult(resultVal, state.toUnit);
        } else if (state.action === "Comparison") {
            if (state.toVal === null || state.toVal === undefined || state.toVal === "") return;
            
            let normToVal;
            if (state.fromUnit === state.toUnit) {
                normToVal = state.toVal;
            } else {
                const conv = await getConversion(state.toUnit, state.fromUnit);
                normToVal = applyConversion(state.toVal, conv);
            }

            resultVal = compareValues(state.fromVal, normToVal);
            
            let cmpWord = "EQUAL TO";
            if (resultVal === 1) cmpWord = "GREATER THAN";
            if (resultVal === -1) cmpWord = "LESS THAN";

            expression = `${state.fromVal} ${state.fromUnit} ? ${state.toVal} ${state.toUnit}`;
            resultText = cmpWord;
            const sentence = `${state.fromVal} ${state.fromUnit} is ${cmpWord} ${state.toVal} ${state.toUnit}`;
            showResult(sentence, "");
        } else { // Arithmetic
            if (state.toVal === null || state.toVal === undefined || state.toVal === "") return;

            let normToVal;
            if (state.fromUnit === state.toUnit) {
                normToVal = state.toVal;
            } else {
                const conv = await getConversion(state.toUnit, state.fromUnit);
                normToVal = applyConversion(state.toVal, conv);
            }

            resultVal = evaluateExpression(state.fromVal, normToVal, state.operator);
            expression = `${state.fromVal} ${state.fromUnit} ${state.operator} ${state.toVal} ${state.toUnit}`;
            resultText = `${resultVal} ${state.fromUnit}`;
            showResult(resultVal, state.fromUnit);
        }

        const record = {
            type: state.type,
            action: state.action,
            expression: expression,
            result: resultText,
            timestamp: new Date().toISOString()
        };

        await saveHistory(record);
        const historyData = await getHistory();
        renderHistory(historyData);

    } catch (e) {
        showResult("Error: " + e.message, "");
    }
}

// Fetches units for a specific type and populates dropdowns.
const loadUnits = async (type) => {
    try {
        const units = await getUnits(type);
        const fromSelect = document.querySelector("#from-unit");
        const toSelect = document.querySelector("#to-unit");
        populateDropdown(fromSelect, units);
        populateDropdown(toSelect, units);
        state.fromUnit = "";
        state.toUnit = "";
    } catch (error) {
        console.error("Units initialization error:", error);
        throw error;
    }
};

// Attaches all application event listeners.
const attachEventListeners = () => {
    const typeSelector = document.querySelector(".type-container");
    const actionSelector = document.querySelector(".action-container");
    const operators = document.querySelectorAll(".operator-btn");
    const fromInput = document.querySelector("#from-value");
    const toInput = document.querySelector("#to-value");

    document.querySelectorAll(".action-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const newAction = e.currentTarget.dataset.action;
            if (!newAction) return;

            state.action = newAction;
            setActive(actionSelector, e.currentTarget, ".action-btn", "active");

            document.querySelectorAll(".action-btn").forEach(b => {
                b.classList.remove("btn-primary");
                b.classList.add("btn-light", "text-secondary", "border");
            });
            e.currentTarget.classList.remove("btn-light", "text-secondary", "border");
            e.currentTarget.classList.add("btn-primary");

            toggleOperators(state.action === "Arithmetic");

            if (fromInput) fromInput.value = "";
            if (toInput) {
                toInput.value = "";
                
                // FIXED: Visually lock/unlock the TO input based on the mode
                const isConversion = state.action === "Conversion";
                toInput.readOnly = isConversion;
                if (isConversion) {
                    toInput.classList.add("bg-light");
                } else {
                    toInput.classList.remove("bg-light");
                }
            }
            showResult(0, "");

            state.fromVal = null;
            state.toVal = null;
            state.operator = "+";

            operators.forEach(ob => ob.classList.remove("active"));
            const plusBtn = document.querySelector('.operator-btn[data-op="+"]');
            if (plusBtn) plusBtn.classList.add("active");
        });
    });

    document.querySelectorAll(".type-card").forEach(card => {
        card.addEventListener("click", async (e) => {
            const newType = e.currentTarget.dataset.type;
            if (!newType) return;

            state.type = newType;
            setActive(typeSelector, e.currentTarget, ".type-card", "card-active");

            if (fromInput) fromInput.value = "";
            if (toInput) toInput.value = "";
            showResult(0, "");

            try {
                await loadUnits(state.type);
            } catch (err) {
                // Ignore gracefully
            }
        });
    });

    // We create a single timer variable outside the loop to track keystrokes
    let debounceTimer;

    const inputs = ["#from-value", "#to-value", "#from-unit", "#to-unit"];
    inputs.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
            const eventType = el.tagName === "SELECT" ? "change" : "input";
            
            el.addEventListener(eventType, () => {
                // Clear the previous timer every time they hit a new key
                clearTimeout(debounceTimer);
                
                // Start a new 500ms countdown
                debounceTimer = setTimeout(async () => {
                    const fVal = document.querySelector("#from-value").value;
                    const tVal = document.querySelector("#to-value").value;
                    
                    state.fromVal = fVal === "" ? null : Number(fVal);
                    state.toVal = tVal === "" ? null : Number(tVal);
                    state.fromUnit = document.querySelector("#from-unit").value;
                    state.toUnit = document.querySelector("#to-unit").value;
                    
                    await calculate();
                }, 500); // 500 milliseconds delay
            });
        }
    });

    document.querySelectorAll(".operator-btn").forEach(btn => {
        btn.addEventListener('click', async (e) => {
            operators.forEach(ob => ob.classList.remove("active"));
            e.currentTarget.classList.add("active");
            state.operator = e.currentTarget.dataset.op;
            await calculate();
        });
    });
};

// Loads history records into the DOM.
const loadHistory = async () => {
    try {
        const historyData = await getHistory();
        renderHistory(historyData);
    } catch (error) {
        console.error("History initialization error:", error);
    }
};

// Initializes the application upon DOM load.
export const initApp = async () => {
    attachEventListeners();

    const firstTypeCard = document.querySelector('.type-card[data-type="Length"]');
    const firstActionBtn = document.querySelector('.action-btn[data-action="Conversion"]');
    
    if (firstTypeCard) firstTypeCard.classList.add('card-active');
    if (firstActionBtn) firstActionBtn.classList.add('active');

    toggleOperators(false);

    try {
        await loadUnits(state.type);
    } catch (error) {
        console.error("Units initialization error:", error);
        const resultValue = document.querySelector("#result-value");
        if (resultValue) {
            resultValue.textContent = "Server unavailable";
        }
    }

    try {
        await loadHistory();
    } catch (error) {
        console.error("History initialization error:", error);
    }
};

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", initApp);
    } else {
        initApp();
    }
}