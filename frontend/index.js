import {API} from "./api.js";
import {UI} from "./ui.js";

//const allStocks = [];

document.addEventListener("DOMContentLoaded", async () => {

    // Initial fetch of data
    try {
        const stocks = await API.findAll();
        console.log("Loading all stocks: ", stocks);
        stocks.forEach(stock => UI.renderRow(stock));
    } catch(err) {
        console.error(err);
    }

    // Form Listeners

    // Add a stock
    const form = document.getElementById("new-stock-form");
    form.addEventListener("submit", async (eventInfo) => {

        eventInfo.preventDefault();
        
        const newStock = UI.getFormData();

        try {
            const stock = await API.createOne(newStock);
            console.log("Adding stock: ", stock);
            UI.renderRow(stock);
        } catch(err) {
            console.error(err);
        }
    })


})