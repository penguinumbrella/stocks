package com.java.skillstorm.stocks.controllers;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
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

@RestController
@RequestMapping("/entities")
public class StockEntityController {
    private final StockEntityService service;

    public StockEntityController(StockEntityService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Iterable<StockEntity>> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<StockEntity> createOne(@RequestBody StockEntityDto dto) {
        return service.createOne(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockEntity> updateOne(@PathVariable int id, @RequestBody StockEntityDto dto) {
        return service.updateOne(id, dto);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteOne(@PathVariable int id) {
        return service.deleteOne(id);
    }
}

