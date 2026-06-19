/**
 * StockEntityController
 * 
 * Manages incoming requests from the frontend.
 * 
 */

package com.java.skillstorm.stocks.controllers;

import java.util.List;
import java.util.Map;

import org.apache.catalina.connector.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.java.skillstorm.stocks.dtos.StockEntityDto;
import com.java.skillstorm.stocks.models.StockEntity;
import com.java.skillstorm.stocks.services.StockEntityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/entities")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class StockEntityController {
    
    private final StockEntityService service;

    // inject ServiceBean to be used
    public StockEntityController(StockEntityService service) {
        this.service = service;
    }

    /**
     * Returns a paginated list of all stocks.
     * @param page the requested page
     * @param size the number of items per page
     * @param sort the header to sort the items by
     * @return a {@link ResponseEntity} containing the paginated list of all stocks
     * 
     * */
    @GetMapping
    public ResponseEntity<Page<StockEntity>> getAll(
            @RequestParam(defaultValue = "0") int page, // requested page
            @RequestParam(defaultValue = "10") int size, // number of items to include on a page
            @RequestParam(defaultValue = "tickerSymbol") String sort) { // sorts our paginated pages by given parameter

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).ascending());
        return service.getAll(pageable);
    }

    /**
     * Returns a paginated list of all stocks, filtered by query.
     * @param query the typed query from our search input
     * @param page the requested page
     * @param size the number of items per page
     * @param sort the header to sort the items by
     * @return a {@link ResponseEntity} containing the paginated list of all stocks, filtered by query
     * 
     * */
    @GetMapping("/search")
    public ResponseEntity<Page<StockEntity>> search(
            @RequestParam String query, // search query
            @RequestParam(defaultValue = "0") int page, // requested page
            @RequestParam(defaultValue = "10") int size, // number of items to include on a page
            @RequestParam(defaultValue = "tickerSymbol") String sort) { // sorts our paginated pages by given parameter

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).ascending());
        return service.search(query, pageable);

    }

    /**
     * Returns an aggregated list stocks grouped by sector
     * @return an {@link ResponseEntity} aggregated {@link List} of {@link StockEntity} grouped by sector
     * 
     * */
    @GetMapping("/sectorStats")
    public ResponseEntity<List<Map<String, Object>>> getSectorStats() {
        return service.getSectorStats();
    }

    /**
     * Creates a stock in the database and returns it
     * @param dto a data transfer object representing the stock we wish to add
     * @return a {@link ResponseEntity} with 201 status if successful with the {@link StockEntity} inside
     * */
    @PostMapping
    public ResponseEntity<StockEntity> createOne(@Valid @RequestBody StockEntityDto dto) {
        return service.createOne(dto);
    }

    /**
     * Updates an existing stock in the database and returns it.
     * @param id the id of the stock
     * @param dto a data transfer object representing the stock we wish to update
     * @return a {@link ResponseEntity} with 200 status if successful with the {@link StockEntity} inside
     * 
     * */
    @PutMapping("/{id}")
    public ResponseEntity<StockEntity> updateOne(@PathVariable int id, @Valid @RequestBody StockEntityDto dto) {
        return service.updateOne(id, dto);
    }

    /**
     * Deletes a stock according to the id.
     * @param id the id of the stock
     * @return a {@link ResponseEntity} with 204 status if successful
     * 
     * */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOne(@PathVariable int id) {
        return service.deleteOne(id);
    }

    
    
}

