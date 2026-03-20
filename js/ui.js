/*
 * Quantity Measurement App - UI Module
 * Handles DOM manipulation, rendering, and dynamic class toggling.
 * @author Developer
 * @version 1.0
 */

// Populates a target select element with a list of unit options.
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

// Sets the active CSS class on a clicked element while removing it from all siblings.
export function setActive(parentEl, clickedEl, childSelector, activeClass = "active") {
    if (!parentEl) return;
    
    parentEl.querySelectorAll(childSelector).forEach(el => {
        el.classList.remove(activeClass);
    });
    
    if (clickedEl) {
        clickedEl.classList.add(activeClass);
    }
}

// Displays the calculation result on the screen and triggers a brief highlight animation.
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

// Shows or hides the arithmetic operator buttons row.
export function toggleOperators(show) {
    const opRow = document.querySelector("#operator-selector");
    if (!opRow) {
        console.warn("Operator selector row not found in DOM");
        return;
    }
    
    // FIXED: Properly manage Bootstrap classes to prevent !important overrides
    if (show) {
        opRow.classList.remove("d-none");
        opRow.classList.add("d-flex");
    } else {
        opRow.classList.remove("d-flex");
        opRow.classList.add("d-none");
    }
}

// Renders the history records array into the history list DOM element.
export function renderHistory(records) {
    const list = document.querySelector("#history-list");
    if (!list) {
        console.warn("History list container not found in DOM");
        return;
    }

    list.innerHTML = "";

    const safeRecords = Array.isArray(records) ? records : [];

    if (safeRecords.length === 0) {
        list.innerHTML = "<li>No history yet.</li>";
        return;
    }

    safeRecords.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.expression}  =  ${r.result}  (${new Date(r.timestamp).toLocaleString()})`;
        list.appendChild(li);
    });
}