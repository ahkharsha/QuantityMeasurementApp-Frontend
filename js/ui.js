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
