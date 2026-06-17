const BACKEND_URL = "http://localhost:8080/entities";

export const API = {

    async findAll() {
        const response = await fetch(BACKEND_URL);
        return await response.json();
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
        return await response.json();
    }
    // update and delete fns
}