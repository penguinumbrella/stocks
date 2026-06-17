export const UI = {
    renderRow (tableBody, stock) {
        let tr = document.createElement("tr"); // one single stock row

        tr.id = `TR-${stock.id}`;

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
            `
        
            tableBody.appendChild(tr);
    },

    removeRow(id) {
        document.getElementById(`TR-${id}`)?.remove();
    },

    getFormData(form) {
        let inputData = new FormData(form);

        const newStock = {
            tickerSymbol: inputData.get("ticker-symbol"),
            companyName: inputData.get("company-name"),
            sector: inputData.get("sector"),
            currentMarketPrice: inputData.get("current-market-price"),
            targetPrice: inputData.get("target-price"),
            dateAdded: getCurrentDateString(),
            analystNotes: inputData.get("analyst-notes")
        }

        return newStock;
    }
        
}

// Helper functions


const getCurrentDateString = () => {
    return new Date().toISOString().split('T')[0];
};