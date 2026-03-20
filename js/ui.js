/**
 * Quantity Measurement App - UI Module
 * Handles DOM manipulation, rendering, and dynamic class toggling.
 * @author Developer
 * @version 1.0
 */

/**
 * Populates a target `<select>` element with a list of unit options.
 * @param {HTMLElement} selectEl - The target select element
 * @param {Array} units - The array of unit objects containing label and symbol
 */
export function populateDropdown(selectEl, units) {
    if (!selectEl) {
        console.warn("Dropdown element not found in DOM");
        return;
    }

    selectEl.innerHTML = "";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "-- Select Unit --";
    defaultOpt.selected = true;
    defaultOpt.disabled = true;
    selectEl.appendChild(defaultOpt);

    if (!Array.isArray(units)) return;

    units.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.symbol;
        opt.textContent = `${u.label} (${u.symbol})`;
        selectEl.appendChild(opt);
    });
}

/**
 * Sets the "active" CSS class on a clicked element while removing it from all siblings.
 * @param {HTMLElement} parentEl - The parent container element
 * @param {HTMLElement} clickedEl - The specific button/card that was clicked
 * @param {string} childSelector - The CSS selector matching all sibling elements
 */
export function setActive(parentEl, clickedEl, childSelector) {
    if (!parentEl) return;
    
    parentEl.querySelectorAll(childSelector).forEach(el => {
        el.classList.remove("active");
    });
    
    if (clickedEl) {
        clickedEl.classList.add("active");
    }
}

/**
 * Displays the calculation result on the screen and triggers a brief highlight animation.
 * @param {string|number} value - The computed numerical value or a comparison sentence
 * @param {string} unitSymbol - The resulting unit symbol (or empty string for comparisons)
 */
export function showResult(value, unitSymbol) {
    const resValue = document.querySelector("#result-value");
    const resUnit = document.querySelector("#result-unit");
    
    if (resValue) {
        resValue.textContent = (value === null || value === undefined) ? "—" : value;
    }
    
    if (resUnit) {
        resUnit.textContent = unitSymbol || "";
    }

    const panel = document.querySelector(".result-panel");
    if (panel) {
        panel.classList.add("highlight");
        setTimeout(() => {
            panel.classList.remove("highlight");
        }, 1500);
    }
}

/**
 * Shows or hides the arithmetic operator buttons row.
 * @param {boolean} show - True to display the row, false to hide it
 */
export function toggleOperators(show) {
    const opRow = document.querySelector("#operator-selector");
    if (!opRow) {
        console.warn("Operator selector row not found in DOM");
        return;
    }
    
    opRow.style.display = show ? "flex" : "none";
}
