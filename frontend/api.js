const BACKEND_URL = "http://localhost:8080/entities";

export const API = {

    async findAll() {
        const response = await fetch(BACKEND_URL);
        if (response.ok) {
            return await response.json();
        } else {
            const errorBody = await response.json();
            throw new Error(`${errorBody.message}`);
        }
    },

    async createOne(newStock) {
        const response = await fetch(BACKEND_URL, {
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

        const response = await fetch(`${BACKEND_URL}/${id}`, {
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
        const response = await fetch(`${BACKEND_URL}/${id}`, {
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