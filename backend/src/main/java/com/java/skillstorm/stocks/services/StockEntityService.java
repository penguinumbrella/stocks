/**
 * StockEntityService: Handles business logic. Called from StockEntityController and uses StockEntityRepository to do desired tasks
 * 
 * - Throws custom ResponseStatusExceptions to GlobalExceptionHandler when something fails.
 * 
 */


package com.java.skillstorm.stocks.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.catalina.startup.ClassLoaderFactory.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.java.skillstorm.stocks.dtos.StockEntityDto;
import com.java.skillstorm.stocks.models.StockEntity;
import com.java.skillstorm.stocks.repositories.StockEntityRepository;

@Service
public class StockEntityService {

    private final StockEntityRepository repo;

    // Repository Bean Injection
    public StockEntityService(StockEntityRepository repo) {
        this.repo = repo;
    }

    // findAll (pagination)
    public ResponseEntity<Page<StockEntity>> getAll(Pageable pageable) {
        return ResponseEntity.ok(this.repo.findAll(pageable));
    }

    // search (pagination)
    public ResponseEntity<Page<StockEntity>> search(String query, Pageable pageable) {
        return ResponseEntity.ok(this.repo.findByTickerSymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCaseOrSectorContainingIgnoreCase(query, query, query, pageable));
    }

    // sector stats for piechart
    public ResponseEntity<List<Map<String,Object>>> getSectorStats() {
        List<Object[]> results = this.repo.countStocksBySector();
        List<Map<String, Object>> stats = new ArrayList<>();

        // map object[] to a map
        for (Object[] row: results) {
            Map<String, Object> map = new HashMap<>();
            map.put("sector", row[0]);
            map.put("count", row[1]);
            stats.add(map);
        }
        return ResponseEntity.status(200).body(stats);
    }

    // create one
    public ResponseEntity<StockEntity> createOne(StockEntityDto dto) {

        // throw 409 if ticker already exists in repo
        if(repo.existsByTickerSymbol(dto.tickerSymbol())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Ticker " + dto.tickerSymbol() + " already exists."
            );
        }

        // throw 404 if prices aren't positive
        if (dto.currentMarketPrice() <= 0 || dto.targetPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Prices must be positive values."
            );
        }

        // using DTO values, create the stock in the repo and return it
        return ResponseEntity.status(201).body(this.repo.save(new StockEntity(  0, 
                                                                                dto.tickerSymbol(), 
                                                                                dto.companyName(), 
                                                                                dto.sector(), 
                                                                                dto.currentMarketPrice(), 
                                                                                dto.targetPrice(),
                                                                                dto.dateAdded(),
                                                                                dto.analystNotes()
                                                                                )));
    }

    // update one
    public ResponseEntity<StockEntity> updateOne(int id, StockEntityDto dto) {

        // find the original stock in the database we are updating
        Optional<StockEntity> optionalStock = this.repo.findById(id);
        StockEntity existingStock;

        
        if (optionalStock.isPresent()) {
            existingStock = optionalStock.get();
        } else {
            // throw 404 if we can't find the stock
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot update stock. Stock with id " + id + " not found.");
        }

        // throw 409 if another stock in the DB already has the same ticker
        if (!existingStock.getTickerSymbol().equals(dto.tickerSymbol()) && repo.existsByTickerSymbol(dto.tickerSymbol())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Ticker '" + dto.tickerSymbol() + "' is already in use by another stock."
            );
        }

        // throw 404 if the prices aren't positive
        if (dto.currentMarketPrice() <= 0 || dto.targetPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Prices must be positive values."
            );
        }

        // using DTO values, update the stock in the DB and return it
        if (this.repo.existsById(id)) {
            StockEntity updated = this.repo.save(new StockEntity(  id, 
                                                                    dto.tickerSymbol(), 
                                                                    dto.companyName(), 
                                                                    dto.sector(), 
                                                                    dto.currentMarketPrice(), 
                                                                    dto.targetPrice(),
                                                                    dto.dateAdded(),
                                                                    dto.analystNotes()
                                                                    ));
            return ResponseEntity.status(HttpStatus.OK).body(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // delete one
    public ResponseEntity<Void> deleteOne(int id) {

        // if we can't find the id to the stock, throw a 404
        if(!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Cannot delete. Stock with ID " + id + " not found."
            );
        }

        this.repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    

    
}
