/**
 * api.js: Triggers fetching commands to the backend to do CRUD operations
 */


// create a config.js file in frontend folder to store backend URL
import {CONFIG} from "./config.js";


export const API = {

    async findAll(page = 0, sort = "tickerSymbol") {
        const response = await fetch(`${CONFIG.BACKEND_URL}?page=${page}&size=10&sort=${sort}`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
    },

    async search(query, page = 0, sort = "tickerSymbol") {
        const response = await fetch(`${CONFIG.BACKEND_URL}/search?query=${query}&page=${page}&size=10&sort=${sort}`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
            
        }
    },

    async getSectorStats() {
        const response = await fetch(`${CONFIG.BACKEND_URL}/sectorStats`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`)
        }
    },

    async createOne(newStock) {
        const response = await fetch(CONFIG.BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(newStock)
            }
        )

        if (response.ok) {
            
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
        
    },

    async updateOne(id, updatedStock) {

        const response = await fetch(`${CONFIG.BACKEND_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
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

    async deleteOne(id) {
        const response = await fetch(`${CONFIG.BACKEND_URL}/${id}`, {
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