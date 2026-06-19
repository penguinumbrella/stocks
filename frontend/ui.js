/**
 * ui.js: Handles UI rendering elements, form validation, injecting code.
 */


export const UI = {
    // render a single row in the table
    renderRow (tableBody, stock) {

         // one single stock row
        let tr = document.createElement("tr");

        // stock id
        tr.id = `TR-${stock.id}`;

        // calculate gap between values
        const current = parseFloat(stock.currentMarketPrice);
        const target = parseFloat(stock.targetPrice);
        const gap = (target - current).toFixed(2);

        // determine if gap is positive
        const targetMet = gap >= 0;

        // formatting for price gap
        const formattedGap = `${targetMet ? '' : '-'}$${Math.abs(gap).toFixed(2)}`;

        // green for positive gap, red for negative
        const colorClass = targetMet ? 'text-green-400' : 'text-red-400';

        // up for positive gap, down for negative
        const iconMarkup = targetMet ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>` 
            :   `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`;

         // highlight row when hovering over
        tr.className = "group hover:bg-slate-700/50 transition-colors duration-200 ";

        // setting up individual cells
        tr.innerHTML = `
            <td class="table-cell">${stock.tickerSymbol}</td>
            <td class="table-cell">${stock.companyName}</td>
            <td class="table-cell">${stock.sector}</td>
            <td class="table-cell">$${current.toFixed(2)}</td>
            <td class="table-cell">$${target.toFixed(2)}</td>
            <td class="table-cell ${colorClass}">
                <div class = "flex items-center gap-1 font-medium">
                    
                    ${formattedGap}
                    ${iconMarkup}
                    </div>
            </td>
            <td class="table-cell">${stock.dateAdded}</td>
            <td class="table-cell max-w-[150px] truncate">${stock.analystNotes}</td>

            <td class="table-cell">
                <div class="flex flex-row gap-3 justify-center items-center">
                    <button class = "edit-btn"     id="EDIT-${stock.id}"    >
                        <svg class="w-5 h-5 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button class = "delete-btn"   id="DEL-${stock.id}"     >
                        <svg class="w-5 h-5 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    </div>
            </td>
            `
        
            // finally attach to the table!
            tableBody.appendChild(tr);
    },

    // create a stock object from the modal form
    getFormData(form) {
        // wrap in FormData for easier access
        let inputData = new FormData(form);

        const newStock = {
            id: inputData.get("id"), // this only appears if the form has the hidden id from edit
            tickerSymbol: inputData.get("ticker-symbol"),
            companyName: inputData.get("company-name"),
            sector: inputData.get("sector"),
            currentMarketPrice: inputData.get("current-market-price"),
            targetPrice: inputData.get("target-price"),
            dateAdded: getCurrentDateString(),
            analystNotes: inputData.get("analyst-notes")
        }

        return newStock;
    },

    // populate form with values assuming edit mode
    populateForm (form, stock) {
        // each field gets assigned from the stock values
        form.querySelector('input[name="ticker-symbol"]').value = stock.tickerSymbol;
        form.querySelector('input[name="company-name"]').value = stock.companyName;

        form.querySelector('select[name="sector"]').value = stock.sector;

        form.querySelector('input[name="current-market-price"]').value = stock.currentMarketPrice;
        form.querySelector('input[name="target-price"]').value = stock.targetPrice;

        form.querySelector('textarea[name="analyst-notes"]').value = stock.analystNotes;

        // hidden id
        let hiddenId = form.querySelector('input[name="id"]');
        if (!hiddenId) {
            hiddenId = document.createElement("input");
            hiddenId.type = "hidden";
            hiddenId.name = "id";
            form.appendChild(hiddenId);
        }
        hiddenId.value = stock.id;

    },

    // Frontend validation if form entries are valid
    validateStockData(stock) {
        
        // check if required fields were all filled in
        if (!stock.tickerSymbol || !stock.companyName || !stock.sector || !stock.currentMarketPrice || !stock.targetPrice) {

            // trigger an alert error
            Swal.fire({
                title: 'Error',
                text: "Please fill in all required fields.",
                icon: 'error',

                background: '#1d3d52',
                color: '#d3dae6',
                confirmButtonColor: '#1d3d52',
                confirmButtonText: 'OK'
            });
            return false;
        }

        // check if price values are positive
        if (stock.currentMarketPrice <= 0 || stock.targetPrice <= 0) {

            // trigger an alert error
            Swal.fire({
                title: 'Error',
                text: "Prices must be postiive values greater than zero.",
                icon: 'error',

                background: '#1d3d52',
                color: '#d3dae6',
                confirmButtonColor: '#1d3d52',
                confirmButtonText: 'OK'
            });
            return false;
        }
        return true;
    },

    
        
}

// Helper functions


const getCurrentDateString = () => {
    return new Date().toISOString().split('T')[0];
};
