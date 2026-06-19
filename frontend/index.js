/**
 * index.js: Represents the "controller." Primary purpose is to set up event listeners that trigger logic from API and UI js files.
 * Secondary purposes:
 *      - set up pie chart
 *      - reload stocks every time something is updated/paginated
 */

// importing other components for functions
import {API} from "./api.js";
import {UI} from "./ui.js";

let stocks = []; // current stocks of the page

let currentPage = 0; // page we're looking at
let totalPages = 1; // total page count

let currentSort = "tickerSymbol"; // current header selected for sorting

let editingId = null; // editing ID is null if we are just adding, otherwise it is set to the ID of the stock to edit

let pieChart = null; // piechart holder

// Table components
const tableBody = document.getElementById("stock-table-body");
const tableHead = document.querySelector("thead"); // used for selecting headers

// Search bar
const searchInput = document.getElementById("search-input");


// Buttons (pagination)
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Buttons for modal
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = document.getElementById("close-modal-btn");
const closeBtnX = document.getElementById("close-modal-x");

// Modal components
const modal = document.getElementById("stock-modal");
const modalTitle = document.getElementById("modal-title");
const backdrop = document.getElementById("modal-backdrop");
const form = document.getElementById("new-stock-form");

// Pie chart component
const pieChartContext = document.getElementById('sector-chart').getContext('2d');

// runs our frontend logic after everything in DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {

    // Initial fetch of data / pagination, load chart
    await loadStocks(0);
    await renderChart(stocks);

    // data-sort represents the viable headers we can sort by
    document.querySelector('[data-sort="tickerSymbol"]').classList.add("active");

    // Pagination Listeners

    // navigate to previous page
    prevBtn.addEventListener("click", () => {
        if (currentPage > 0) {
            loadStocks(currentPage - 1);
        }
    })

    // navigate to next page
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            loadStocks(currentPage + 1);
        }
    })

    // Modal Configuration Listeners

    // open the modal if "+ New Stock" clicked
    openBtn.addEventListener("click", () => {
        // clear editing id just in case
        editingId = null;
        openModal(null);
    });


    // IN MODAL MODE

    // exit if background clicked
    backdrop.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    // exit if "Escape" tapped
    document.addEventListener("keydown", (eventInfo) => {
        if (eventInfo.key === "Escape") modal.classList.add("hidden");
    });
    // exit if close btn clicked
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    // exit if X clicked
    closeBtnX.addEventListener("click", () => {
        modal.classList.add("hidden");
    });


    // Search Input Listener
    // refresh table any time something is typed
    searchInput.addEventListener("input", async (eventInfo) => {
        loadStocks(0);
    })

    // Table Sorting Listener
    tableHead.addEventListener("click", (eventInfo => {
        // retrieve clicked header
        const header = eventInfo.target.closest(".table-header");

         // check if exists
        if (header && header.dataset.sort) {

            // remove active visual from all
            document.querySelectorAll(".table-header").forEach(th => {
                th.classList.remove("active");
            });

            // only add active visual to selected header
            header.classList.add("active");

            // set the new currentSort
            currentSort = header.dataset.sort;
            // refresh table (with new header to be sorted by in place)
            loadStocks(0);
        }
    }));


    // Form Listeners

    // Clicked Remove/Edit buttons to remove/edit a stock
    tableBody.addEventListener("click", async (eventInfo) => {

        // Handle Delete
        if (eventInfo.target.classList.contains("delete-btn")) {

            // Retrieve ID of delete button
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];

            // Confirmation before user deletes for good
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
        
            // cancels the action, returns early
            if (!caution.isConfirmed) {
                return;
            }

            try {
                // try calling backend to delete
                await API.deleteOne(id);

                // if we are on the last page and there aren't any more stocks, go to the previous page
                if (stocks.length === 1 && currentPage > 0) {
                    await loadStocks(currentPage - 1);
                } else {
                    await loadStocks(currentPage);
                }

                // re-render chart
                renderChart(stocks);

            } catch(err) {
                // potential to return 404 error (not found)
                console.error(err);
            }
        }

        // Handle Edit

        else if (eventInfo.target.classList.contains("edit-btn")) {

            // Retrieve ID of edit button
            const idString = eventInfo.target.id;
            const id = idString.split("-")[1];

            // retireve the stock in our stocks list
            const stockToEdit = stocks.find(s => s.id == id);

            // if stock is found, trigger the edit modal
            if (stockToEdit) {
                // set editingid to the id (we are now in edit mode)
                editingId = stockToEdit.id;
                openModal(stockToEdit);
            }
        }
        
    })

    // Edit/Add a stock (after we hit submit on the modal)
    form.addEventListener("submit", async (eventInfo) => {

        // prevent built in default behavior
        eventInfo.preventDefault();

        // retrieve stock data from form
        const newStock = UI.getFormData(form);

         // refuse if data is invalid
        if (!UI.validateStockData(newStock)) return;

        try {
            // Edit existing stock
            if (editingId) {
                // call the backend to update it to DB
                await API.updateOne(editingId, newStock);
                // refresh the table
                await loadStocks(currentPage);
                
                // remove the id selector, make sure we're back in add mode
                form.querySelector('input[name="id"]')?.remove();
            } else {    // Add new stock
                // call backend to add it to DB
                await API.createOne(newStock);
                // refresh the table, go to the end to see update
                await loadStocks(totalPages - 1);
            }
            // rerender the chart
            renderChart(stocks);
            // modal goes back to hiding
            modal.classList.add("hidden");
            // back to add mode
            editingId = null;
            
        } catch(err) {
            console.error(err);

            // Trigger SweetAlert2 error message (specifically for duplicate ticker)
            // occurs if either edit or add throw an error from the API call
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

    
})

// Helper Functions

// load the current iteration of stocks on the page (default page 0)
const loadStocks = async (page = 0) => {
    try {

        // loads the query from the search input, removing spacing on either end
        const activeQuery = searchInput.value.trim();

        // trigger API call for pagination
        let pageData;
        if(activeQuery.length > 0) {
            // if we have something typed, trigger the search API call
            pageData = await API.search(activeQuery, page, currentSort);
        } else {
            // otherwise, trigger the default call
            pageData = await API.findAll(page, currentSort);
        }

        // set the stocks to match the data content 
        stocks = pageData.content;


        // reset original rows of table
        tableBody.innerHTML = "";
        

        // call renderRow for each stock
        stocks.forEach(stock => UI.renderRow(tableBody, stock));


        // set the current page we're on, out of total pages
        currentPage = pageData.number;
        totalPages = stocks.length > 0 ? pageData.totalPages : 1;
        document.getElementById("page-info").textContent = `Page ${currentPage + 1}/${totalPages}`;

        // disable prev/next buttons according to if we're on the first/last page
        document.getElementById("prev-btn").disabled = pageData.first;
        document.getElementById("next-btn").disabled = pageData.last;

        

    } catch(err) {
        // catch error if API call failed
        console.error(err);
    }
}

// Helper functions

// open modal functionality
const openModal = (stock = null) => {

    // reset the form before opening it
    form.reset();
    // make the form visible
    modal.classList.remove("hidden");

    // change the title and button text if we're in edit mode
    modalTitle.textContent = editingId ? "Edit Stock" : "Add New Stock";
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = editingId ? "Update Stock" : "Add Stock";

    // edit mode
    if (editingId && stock) {
        // populate form with existing values
        UI.populateForm(form, stock);
    } // add mode otherwise
}

// render the chart
const renderChart = async (stocks) => {
    
    try {
        // retrieve sector stats from backend
        const sectorData = await API.getSectorStats();

        // map labels and counts from retrieved sector data
        const labels = sectorData.map(item => item.sector);
        const counts = sectorData.map(item => item.count);

        // delete the existing pie chart if it exists
        if (pieChart) pieChart.destroy();

        // create new pie chart with params (from Chart.js)
        // customization config
        pieChart = new Chart(pieChartContext, {
            type: "doughnut",

            // pie chart customization
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

                // sector breakdown legend
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
                            padding: 25,       
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

    } catch(err) {
        // catch error if API call failed
        console.error(err);
    }
    
}