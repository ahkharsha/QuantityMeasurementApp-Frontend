/**
 * Application State and Initialization Module
 * Handles global state management and DOM lifecycle events.
 * @author Developer
 * @version 1.0
 */

import { getUnits } from './api.js';
import { populateDropdown, setActive, showResult, toggleOperators, renderHistory } from './ui.js';

// Global state tracking current UI selections
export const state = {
    type: "Length",
    action: "Conversion",
    fromVal: null,
    fromUnit: "",
    toVal: null, 
    toUnit: "",
    operator: "+"
};

// Orchestration loadUnits replaces stub
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
            setActive(actionSelector, e.currentTarget, ".action-btn");
            toggleOperators(state.action === "Arithmetic");

            if (fromInput) fromInput.value = "";
            if (toInput) toInput.value = "";
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
            setActive(typeSelector, e.currentTarget, ".type-card");

            if (fromInput) fromInput.value = "";
            if (toInput) toInput.value = "";
            showResult(0, "");

            try {
                await loadUnits(state.type);
            } catch (err) {
                // Ignore gracefully as per alternate flow requirements
            }
        });
    });
};

const loadHistory = async () => {};

/**
 * Initializes the application upon DOM load.
 * Sets default active states and hides the operator row.
 */
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", async () => {
        // Safe UI initialization
        attachEventListeners();

        const firstTypeCard = document.querySelector('.type-card[data-type="Length"]');
        const firstActionBtn = document.querySelector('.action-btn[data-action="Conversion"]');
        
        if (firstTypeCard) firstTypeCard.classList.add('card-active');
        if (firstActionBtn) firstActionBtn.classList.add('active');

        toggleOperators(false);

        // Network calls wrapped individually to prevent blocking UI
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
    });
}