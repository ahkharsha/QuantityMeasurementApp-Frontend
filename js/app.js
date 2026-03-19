/**
 * Application State and Initialization Module
 * Handles global state management and DOM lifecycle events.
 * @author Developer
 * @version 1.0
 */

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

// Local stubs required to satisfy initial lifecycle flow without throwing ReferenceErrors
const attachEventListeners = () => {};
const loadUnits = async (type) => {};
const loadHistory = async () => {};
const toggleOperators = (show) => {
    const opRow = document.querySelector("#operator-selector");
    if (opRow) opRow.style.display = show ? "flex" : "none";
};

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