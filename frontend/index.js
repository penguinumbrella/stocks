/**
 * index.js: Represents the "controller." Primary purpose is to set up event listeners that trigger logic from API and UI js files.
 * Secondary purposes:
 *      - set up pie chart
 *      - reload stocks every time something is updated/paginated
 */

import {API} from "./api.js";
import {UI} from "./ui.js";

let stocks = [];

let currentPage = 0;
let totalPages = 1;

let currentSort = "tickerSymbol";

let pieChart = null;

// Table components
const tableBody = document.getElementById("stock-table-body");
const tableHead = document.querySelector("thead");

// Search component
const searchInput = document.getElementById("search-input");


// Buttons
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Buttons for modal
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = document.getElementById("close-modal-btn");

// Modal components
const modal = document.getElementById("stock-modal");
const modalTitle = document.getElementById("modal-title");
const backdrop = document.getElementById("modal-backdrop");
const form = document.getElementById("new-stock-form");

// Pie chart component
const pieChartContext = document.getElementById('sector-chart').getContext('2d');

document.addEventListener("DOMContentLoaded", async () => {

    // Initial fetch of data / pagination, load chart
    await loadStocks(0);
    await renderChart(stocks);
    document.querySelector('[data-sort="tickerSymbol"]').classList.add("active");

    // Pagination Listeners
    prevBtn.addEventListener("click", () => {
        if (currentPage > 0) {
            loadStocks(currentPage - 1);
        }
    })

    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            loadStocks(currentPage + 1);
        }
    })

    // Modal Configuration Listeners
    openBtn.addEventListener("click", () => {
        openModal(false, null);
    });

    // exit if background clicked
    backdrop.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    // exit if "Escape" tapped
    document.addEventListener("keydown", (eventInfo) => {
        if (eventInfo.key === "Escape") modal.classList.add("hidden");
    });
    // exit if close btn (close and x) clicked
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    document.getElementById("close-modal-x").addEventListener("click", () => {
        modal.classList.add("hidden");
    });


    // Search Input Listener
    searchInput.addEventListener("input", async (eventInfo) => {

        loadStocks(0);
    })

    // Table Sorting Listener
    tableHead.addEventListener("click", (eventInfo => {
        const header = eventInfo.target.closest(".table-header");

        if (header && header.dataset.sort) { // check if exists

            // remove active visual from all
            document.querySelectorAll(".table-header").forEach(th => {
                th.classList.remove("active");
            });

            // only add active visual to selected header
            header.classList.add("active");

            currentSort = header.dataset.sort;
            loadStocks(0);
        }
    }));


    // Form Listeners

    // Edit/Add a stock
    form.addEventListener("submit", async (eventInfo) => {

        eventInfo.preventDefault();

        const newStock = UI.getFormData(form);
        const id = newStock.id;

        if (!UI.validateStockData(newStock)) return; // refuse if data is invalid

        try {
            // Edit existing stock
            if (id) {
                await API.updateOne(id, newStock);
                await loadStocks(currentPage);

                // update stock in stocks
                stocks = stocks.map(stock => stock.id == id ? newStock : stock); 
                
                form.querySelector('input[name="id"]')?.remove();
            } else {    // Add new stock
                const stock = await API.createOne(newStock);
                stocks.push(stock);
                await loadStocks(totalPages - 1);
            }
            renderChart(stocks);
            form.reset();
            modal.classList.add("hidden");
            
        } catch(err) {
            console.error(err);

            // Trigger SweetAlert2 error message
            Swal.fire({
                title: 'Error',
                text: err.message,
                icon: 'error',

                background: '#1d3d52',
                color: '#d3dae6',
                confirmButtonColor: '#1d3d52',
                confirmButtonText: 'OK'
            });
        }
    })

    // Remove/Edit a stock
    tableBody.addEventListener("click", async (eventInfo) => {

        // Handle Delete
        if (eventInfo.target.classList.contains("delete-btn")) {
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];


            const caution = await Swal.fire({
                    title: 'Are you sure?',
                    text: "This action cannot be undone.",
                    icon: 'warning',
                    
                    
                    background: '#1d3d52',
                    color: '#d3dae6',
                    confirmButtonColor: '#1d3d52',
                    confirmButtonText: 'OK',

                    showCancelButton: true,
                    cancelButtonColor: '#1d3d52',
                });;
        
            if (!caution.isConfirmed) {
                return;
            }

            try {
                await API.deleteOne(id);

                if (stocks.length === 1 && currentPage > 0) {
                    await loadStocks(currentPage - 1);
                } else {
                    await loadStocks(currentPage);
                }

                renderChart(stocks);

                // update stocks
                stocks = stocks.filter(stock => stock.id != id);
            } catch(err) {
                console.error(err);
            }
        }

        // Handle Edit

        else if (eventInfo.target.classList.contains("edit-btn")) {
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];

            const stockToEdit = stocks.find(s => s.id == id);

            if (stockToEdit) {
                openModal(true, stockToEdit);
            }
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


        tableBody.innerHTML = "";
        

        stocks.forEach(stock => UI.renderRow(tableBody, stock));


        currentPage = pageData.number;
        totalPages = stocks.length > 0 ? pageData.totalPages : 1;

        document.getElementById("page-info").textContent = `Page ${currentPage + 1}/${totalPages}`;

        document.getElementById("prev-btn").disabled = pageData.first;
        document.getElementById("next-btn").disabled = pageData.last;

        

    } catch(err) {
        console.error(err);
    }
}

// Helper functions

const openModal = (isEditMode = false, stock = null) => {
    form.reset();
    modal.classList.remove("hidden");
    modalTitle.textContent = isEditMode ? "Edit Stock" : "Add New Stock";

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = isEditMode ? "Update Stock" : "Add Stock";

    // Find or create the hidden ID input
    let hiddenId = form.querySelector('input[name="id"]');

    if (!hiddenId) {
        hiddenId = document.createElement("input");
        hiddenId.type = "hidden";
        hiddenId.name = "id";
        form.appendChild(hiddenId);
    }

    // edit mode
    if (isEditMode && stock) {
        UI.populateForm(form, stock);
    } else { // add mode
        form.querySelector('textarea[name="analyst-notes"]').value = "";
        form.reset();
        hiddenId.value = "";
    }
}


const renderChart = async (stocks) => {
    const sectorData = await API.getSectorStats();

    const labels = sectorData.map(item => item.sector);
    const counts = sectorData.map(item => item.count);


    if (pieChart) pieChart.destroy();

    pieChart = new Chart(pieChartContext, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    "#0ea5e9",
                    "#38bdf8",
                    "#818cf8",
                    "#c084fc",
                    "#e879f9",
                    "#f472b6",
                    "#fb7185",
                    "#fdba74",
                    "#fde047",
                    "#bef264",
                    "#4ade80"
                    ],
                    borderColor: "transparent",
                    spacing: 16,
                    hoverOffset: 15,
                    borderRadius: 10
                }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '40%',
            plugins: {
                legend: {
                    position: "right",
                    align: "center",
                    labels: {
                        color: "#adbfd9",
                        font: {
                            size: 14,
                            family: "'Inter', sans-serif"
                        },
                        padding: 30,       
                        boxWidth: 15,      
                        boxHeight: 20,     
                        usePointStyle: true, 
                        pointStyle: 'circle'
                    },
                    title: {
                        display: true,
                        text: 'SECTOR BREAKDOWN',
                        color: '#ffffff',
                        font: { size: 18, 
                                family: "'Inter', sans-serif"},
                        padding: { bottom: 10 }
                    }
                }
        }
        }
    });
}