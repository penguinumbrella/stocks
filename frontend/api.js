/**
 * api.js: Triggers fetching commands to the backend to do CRUD operations
 */


// create a config.js file in frontend folder to store backend URL
import {CONFIG} from "./config.js";


export const API = {

    // retrieve all paginated stocks, sorted by header
    async findAll(page = 0, sort = "tickerSymbol") {
        // fetch request
        const response = await fetch(`${CONFIG.BACKEND_URL}?page=${page}&size=10&sort=${sort}`);
        if (response.ok) {
            return await response.json();
        } else {
            // return an error if failed, will show to console
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
    },

    // retrieve paginated stocks according to search input, filtering by ticker, company, and sector
    async search(query, page = 0, sort = "tickerSymbol") {
        const response = await fetch(`${CONFIG.BACKEND_URL}/search?query=${query}&page=${page}&size=10&sort=${sort}`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
            
        }
    },

    // retrieve sectors stats from backend for pie chart
    async getSectorStats() {
        const response = await fetch(`${CONFIG.BACKEND_URL}/sectorStats`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`)
        }
    },

    // create a stock in DB and get it back
    async createOne(newStock) {
        const response = await fetch(CONFIG.BACKEND_URL, {
            // adjust headers to post JSON
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(newStock) // turn JS object into json
            }
        )

        if (response.ok) {
            
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
        
    },

    // update a stock in DB and get it back
    async updateOne(id, updatedStock) {

        const response = await fetch(`${CONFIG.BACKEND_URL}/${id}`, {
            // adjust headers to put JSON
            method: "PUT",
            headers: {
                "Content-Type" : "application/json" // turn JS object into json
            },
            body: JSON.stringify(updatedStock)
        })
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
    },

    // delete a stock in DB
    async deleteOne(id) {
        const response = await fetch(`${CONFIG.BACKEND_URL}/${id}`, {
            // adjust headers to delete
            method: "DELETE"
            }
        )
        if (response.ok) {
            return true;
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
    }
}