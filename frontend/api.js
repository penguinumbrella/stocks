/**
 * api.js: Triggers fetching commands to the backend to do CRUD operations
 */


// create a config.js file in frontend folder to store backend URL
import {CONFIG} from "./config.js";


export const API = {

    /**
     * Retrieves a paginated list of stocks
     * @param {number} page - Page number to retrieve
     * @param {*} sort - header to sort by
     * @returns {Promise<Object>} promise to be resolved
     */
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

     /**
     * Retrieves a paginated list of stocks based on the query string
     * @param {string} query - search term
     * @param {number} page - Page number to retrieve
     * @param {*} sort - header to sort by
     * @returns {Promise<Object>} promise to be resolved
     */
    async search(query, page = 0, sort = "tickerSymbol") {
        const response = await fetch(`${CONFIG.BACKEND_URL}/search?query=${query}&page=${page}&size=10&sort=${sort}`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
            
        }
    },

    /**
     * Retrieves stocks aggregated by sector.
     * @returns {Promise<Object>} promise to be resolved
     */
    async getSectorStats() {
        const response = await fetch(`${CONFIG.BACKEND_URL}/sectorStats`);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`)
        }
    },

    /**
     * Creates a new stock
     * @param {Object} newStock - stock object to create
     * @returns {Promise<Object>} created stock object in promise
     */
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

    /**
     * Update a stock by ID
     * @param {number} id - id of the stock
     * @param updatedStock - stock to update to
     * @returns {Promise<Object>} updatedStock - created stock
     */
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

    /**
     * Deletes stock by ID
     * @param {number} id - id of stock to delete
     * @returns {Promise<boolean>} - returns true if deletion succeeded
     */
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