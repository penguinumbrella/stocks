const BACKEND_URL = "http://localhost:8080/entities";



document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM fully loaded and parsed. Starting fetch...");

    fetchAllStocks();



    const stockForm = document.getElementById("new-stock-form");

    if (stockForm) {

        stockForm.addEventListener("submit", handleFormSubmit);

    } else {

        console.error("Could not find element with id 'new-stock-form'");

    }

});



async function fetchAllStocks() {

    try {

        console.log("Fetching stocks from:", BACKEND_URL);

        const response = await fetch(BACKEND_URL);

       

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

       

        const stocks = await response.json();

        console.log("Data received from backend:", stocks);



        stocks.forEach(stock => {

            console.log("Rendering stock:", stock);

            addStockToTable(stock);

        });

    } catch (error) {

        console.error("Failed to fetch stocks:", error);

    }

}



async function handleFormSubmit(event) {

    event.preventDefault();

    console.log("Form submitted. Processing data...");



    const formData = new FormData(event.target);

    const newStock = {

        tickerSymbol: formData.get("ticker-symbol"),

        companyName: formData.get("company-name"),

        sector: formData.get("sector"),

        currentMarketPrice: parseFloat(formData.get("current-market-price")),

        targetPrice: parseFloat(formData.get("target-price")),

        dateAdded: new Date().toISOString().split('T')[0],

        analystNotes: formData.get("analyst-notes")

    };



    console.log("Sending POST request with body:", newStock);



    try {

        const response = await fetch(BACKEND_URL, {

            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify(newStock)

        });



        console.log("Server response status:", response.status);



        if (response.status === 201) {

            const data = await response.json();

            console.log("Stock successfully created in DB:", data);

            addStockToTable(data); // Add the new row immediately

            event.target.reset();

        } else {

            console.warn("Server returned non-201 status:", response.status);

        }

    } catch (error) {

        console.error("Error during POST request:", error);

    }

}



const addStockToTable = (stock) => {

    console.log("Attempting to add to table, stock ID:", stock.id);

    const tableBody = document.getElementById("stock-table-body");

   

    if (!tableBody) {

        console.error("Error: Could not find table body with id 'stock-table-body'");

        return;

    }



    const tr = document.createElement("tr");

    tr.id = `TR-${stock.id}`;



    tr.innerHTML = `

        <td>${stock.tickerSymbol}</td>

        <td>${stock.companyName}</td>

        <td>${stock.sector}</td>

        <td>${stock.currentMarketPrice}</td>

        <td>${stock.targetPrice}</td>

        <td>${stock.dateAdded}</td>

        <td>${stock.analystNotes}</td>

        <td><button class="btn btn-primary p-1" id="EDIT-${stock.id}">Edit</button></td>

        <td><button class="btn btn-danger p-1" id="DEL-${stock.id}">Delete</button></td>

    `;



    tableBody.appendChild(tr);

    console.log("Stock added to table DOM.");

};