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

import com.java.skillstorm.stocks.dtos.StockEntityDto;
import com.java.skillstorm.stocks.models.StockEntity;
import com.java.skillstorm.stocks.services.StockEntityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/entities")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class StockEntityController {
    private final StockEntityService service;

    public StockEntityController(StockEntityService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<StockEntity>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "tickerSymbol") String sort) { // sorts our paginated pages by given parameter

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).ascending());
        return service.getAll(pageable);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<StockEntity>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "tickerSymbol") String sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).ascending());
        return service.search(query, pageable);

    }

    @GetMapping("/sectorStats")
    public ResponseEntity<List<Map<String, Object>>> getSectorStats() {
        return service.getSectorStats();
    }

    @PostMapping
    public ResponseEntity<StockEntity> createOne(@Valid @RequestBody StockEntityDto dto) {
        return service.createOne(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockEntity> updateOne(@PathVariable int id, @Valid @RequestBody StockEntityDto dto) {
        return service.updateOne(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOne(@PathVariable int id) {
        return service.deleteOne(id);
    }

    
    
}

