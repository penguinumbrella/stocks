import {API} from "./api.js";
import {UI} from "./ui.js";

let stocks = [];

const tableBody = document.getElementById("stock-table-body");
const form = document.getElementById("new-stock-form");

document.addEventListener("DOMContentLoaded", async () => {

    // Initial fetch of data
    try {
        stocks = await API.findAll();
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
        const id = newStock.id;
        //const stockData = UI.getFormData(eventInfo.target);

        try {
            if (id) {
                //console.log("we're in edit mode");
                await API.updateOne(id, newStock);
                UI.updateRow(id, newStock);
                
                form.querySelector('input[name="id"]')?.remove();
            } else {
                const stock = await API.createOne(newStock);
                console.log("Adding stock: ", stock);
                stocks.push(stock);
                console.log(stocks);
                UI.renderRow(tableBody, stock);
            }
            form.reset();
            
        } catch(err) {
            console.error(err);
            alert("Error: That Ticker Symbol already exists or the data is invalid.");
        }
    })

    // Remove/Edit a stock
    tableBody.addEventListener("click", async (eventInfo) => {

        // Handle Delete
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

        // Handle Edit

        else if (event.target.classList.contains("edit-btn")) {
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];

            const stockToEdit = stocks.find(s => s.id == id);

            console.log("id", id);
            console.log(stocks)

            
            console.log(stockToEdit);
            UI.populateForm(form, stockToEdit);
        }
        
    })



})