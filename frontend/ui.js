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
                
                <button class="edit-btn" id="EDIT-${stock.id}">Edit</button>
                <button class="delete-btn" id="DEL-${stock.id}">Delete</button>
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

    }
        
}

// Helper functions


const getCurrentDateString = () => {
    return new Date().toISOString().split('T')[0];
};