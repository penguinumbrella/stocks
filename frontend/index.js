import {API} from "./api.js";
import {UI} from "./ui.js";

//const allStocks = [];

const tableBody = document.getElementById("stock-table-body");
const form = document.getElementById("new-stock-form");

document.addEventListener("DOMContentLoaded", async () => {

    // Initial fetch of data
    try {
        const stocks = await API.findAll();
        console.log("Loading all stocks: ", stocks);
        stocks.forEach(stock => UI.renderRow(tableBody, stock));
    } catch(err) {
        console.error(err);
    }

    // Form Listeners

    // Add a stock
    form.addEventListener("submit", async (eventInfo) => {

        eventInfo.preventDefault();

        const newStock = UI.getFormData(form);

        try {
            const stock = await API.createOne(newStock);
            console.log("Adding stock: ", stock);
            UI.renderRow(tableBody, stock);
            form.reset(); // Clear form on success
        } catch(err) {
            console.error(err);
            alert("Error: That Ticker Symbol already exists or the data is invalid.");
        }
    })

    // Remove a stock
    tableBody.addEventListener("click", async (eventInfo) => {

        if (event.target.classList.contains("delete-btn")) {
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];
            // console.log("Deleting ID:", id);
            try {
                await API.deleteOne(id);
                UI.removeRow(id);
            } catch(err) {
                console.error(err);
            }
        }
        
        
    })



})