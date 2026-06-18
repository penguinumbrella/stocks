import {API} from "./api.js";
import {UI} from "./ui.js";

let stocks = [];

let currentPage = 0;
let totalPages;

let currentSort = "tickerSymbol";

const tableBody = document.getElementById("stock-table-body");
const form = document.getElementById("new-stock-form");
const searchInput = document.getElementById("search-input");
const tableHead = document.querySelector("thead");

document.addEventListener("DOMContentLoaded", async () => {

    // Initial fetch of data / pagination
    await loadStocks(0);

    // Pagination Listeners

    document.getElementById("prev-btn").addEventListener("click", () => {
        if (currentPage > 0) {
            loadStocks(currentPage - 1);
        }
    })

    document.getElementById("next-btn").addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            loadStocks(currentPage + 1);
        }
    })

    // Search Input Listener

    searchInput.addEventListener("input", async (eventInfo) => {
        //console.log("searchtrigger0")

        //console.log(query);
        loadStocks(0);
    })

    // Table Sorting Listener
    tableHead.addEventListener("click", (eventInfo => {
        const header = eventInfo.target.closest(".table-header");

        if (header && header.dataset.sort) { // check if exists
            currentSort = header.dataset.sort;
            loadStocks(0);
        }
    }));


    // Form Listeners

    // Add a stock
    form.addEventListener("submit", async (eventInfo) => {

        eventInfo.preventDefault();

        const newStock = UI.getFormData(form);
        const id = newStock.id;

        if (!UI.validateStockData(newStock)) return; // refuse if data is invalid

        try {
            if (id) {
                //console.log("we're in edit mode");
                await API.updateOne(id, newStock);
                //UI.updateRow(id, newStock);
                await loadStocks(currentPage);

                // update stock in stocks
                stocks = stocks.map(stock => stock.id == id ? newStock : stock); 
                
                form.querySelector('input[name="id"]')?.remove();
            } else {
                const stock = await API.createOne(newStock);
                console.log("Adding stock: ", stock);
                stocks.push(stock);
                console.log(stocks);
                //UI.renderRow(tableBody, stock);
                await loadStocks(totalPages - 1);
            }
            form.reset();
            UI.updateButtonState(form, false);
            
        } catch(err) {
            console.error(err);
            alert(err.message);
        }
    })

    // Remove/Edit a stock
    tableBody.addEventListener("click", async (eventInfo) => {

        // Handle Delete
        if (event.target.classList.contains("delete-btn")) {
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];
            // console.log("Deleting ID:", id);

            const confirmed = confirm("Are you sure you want to delete this stock? This action cannot be undone.");
        
            if (!confirmed) {
                return;
            }

            try {
                await API.deleteOne(id);
                //UI.removeRow(id);
                if (stocks.length === 1 && currentPage > 0) {
                    await loadStocks(currentPage - 1);
                } else {
                    await loadStocks(currentPage);
                }

                // update stocks
                stocks = stocks.filter(stock => stock.id != id);
            } catch(err) {
                console.error(err);
            }
        }

        // Handle Edit

        else if (event.target.classList.contains("edit-btn")) {
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];

            const stockToEdit = stocks.find(s => s.id == id);

            console.log("id", id);
            console.log(stocks)

            
            console.log(stockToEdit);
            UI.populateForm(form, stockToEdit);
            UI.updateButtonState(form, true);
        }
        
    })
})

// Helper Functions

// load the current iteration of stocks on the page (default page 0)
const loadStocks = async (page = 0) => {
    try {

        const activeQuery = searchInput.value.trim();

        let pageData;
        if(activeQuery.length > 0) {
            
            pageData = await API.search(activeQuery, page, currentSort);
        } else {
            pageData = await API.findAll(page, currentSort);
        }

        stocks = pageData.content;

        //console.log("Loading all stocks: ", stocks);

        tableBody.innerHTML = "";
        

        stocks.forEach(stock => UI.renderRow(tableBody, stock));

        currentPage = pageData.number;
        totalPages = pageData.totalPages;

        document.getElementById("page-info").textContent = `Page ${currentPage + 1}/${totalPages}`;

        document.getElementById("prev-btn").disabled = pageData.first;
        document.getElementById("next-btn").disabled = pageData.last;

    } catch(err) {
        console.error(err);
    }
}