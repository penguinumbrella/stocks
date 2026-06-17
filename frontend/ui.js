export const UI = {
    renderRow (tableBody, stock) {
        let tr = document.createElement("tr"); // one single stock row

        tr.id = `TR-${stock.id}`;

        tr.innerHTML = `
            <td class="table-cell">${stock.tickerSymbol}</td>
            <td class="table-cell">${stock.companyName}</td>
            <td class="table-cell">${stock.sector}</td>
            <td class="table-cell">${stock.currentMarketPrice}</td>
            <td class="table-cell">${stock.targetPrice}</td>
            <td class="table-cell">${stock.dateAdded}</td>
            <td class="table-cell">${stock.analystNotes}</td>

            <td class="table-cell text-center">
                <button class = "edit-btn"     id="EDIT-${stock.id}"    >   Edit    </button>
                <button class = "delete-btn"   id="DEL-${stock.id}"     >   Delete  </button>
            </td>
            `
        
            tableBody.appendChild(tr);
    },

    removeRow(id) {
        document.getElementById(`TR-${id}`)?.remove();
    },

    updateRow(id, stock) {
        const tr = document.getElementById(`TR-${id}`);

        console.log(`TR-${stock.id}`);
        
        if (tr) {
            tr.innerHTML = `
                <td>${stock.tickerSymbol}</td>
                <td>${stock.companyName}</td>
                <td>${stock.sector}</td>
                <td>${stock.currentMarketPrice}</td>
                <td>${stock.targetPrice}</td>
                <td>${stock.dateAdded}</td>
                <td>${stock.analystNotes}</td>
                
                <button class = "edit-btn"     id="EDIT-${stock.id}"    >   Edit    </button>
                <button class = "delete-btn"   id="DEL-${stock.id}"     >   Delete  </button>
            `;
        }
    },

    getFormData(form) {
        let inputData = new FormData(form);

        const newStock = {
            id: inputData.get("id"),
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

    populateForm (form, stock) {
        //console.log(form, stock);
        form.querySelector('input[name="ticker-symbol"]').value = stock.tickerSymbol;
        form.querySelector('input[name="company-name"]').value = stock.companyName;
        form.querySelector('input[name="sector"]').value = stock.sector;
        form.querySelector('input[name="current-market-price"]').value = stock.currentMarketPrice;
        form.querySelector('input[name="target-price"]').value = stock.targetPrice;
        form.querySelector('input[name="analyst-notes"]').value = stock.analystNotes;

        let hiddenId = form.querySelector('input[name="id"]');
        if (!hiddenId) {
            hiddenId = document.createElement("input");
            hiddenId.type = "hidden";
            hiddenId.name = "id";
            form.appendChild(hiddenId);
        }
        hiddenId.value = stock.id;

    },

    updateButtonState (form, isEditMode) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = isEditMode ? "Update Stock" : "Add Stock";
    },

    validateStockData(stock) {
        if (!stock.tickerSymbol || !stock.companyName || !stock.sector) {
            alert("Please fill in all required fields.");
            return false;
        }
        if (stock.currentMarketPrice <= 0 || stock.targetPrice <= 0) {
            alert("Prices must be postiive values greater than zero.");
            return false;
        }
        return true;
    }
        
}

// Helper functions


const getCurrentDateString = () => {
    return new Date().toISOString().split('T')[0];
};
