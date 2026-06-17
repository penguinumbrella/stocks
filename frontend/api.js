const BACKEND_URL = "http://localhost:8080/entities";

export const API = {

    async findAll() {
        const response = await fetch(BACKEND_URL);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Failed to retrieve all stocks: ${response.status}`);
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
            throw new Error(`Failed to create stock: ${response.status}`);
        }
        
    },

    async updateOne(id, updatedStock) {
        const response = await(fetch `${BACKEND_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(updatedStock)
        })
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Failed to update stock: ${response.status}`);
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
            throw new Error(`Delete failed with status: ${response.status}`);
        }
    }
}