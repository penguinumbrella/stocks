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

    /**
     * Returns a paginated list of all stocks.
     * @param page the requested page
     * @param size the number of items per page
     * @param sort the header to sort the items by
     * @return a {@link ResponseEntity} containing the paginated list of all stocks
     * 
     * */
    public ResponseEntity<Page<StockEntity>> getAll(Pageable pageable) {
        return ResponseEntity.ok(this.repo.findAll(pageable));
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
    public ResponseEntity<Page<StockEntity>> search(String query, Pageable pageable) {
        return ResponseEntity.ok(this.repo.findByTickerSymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCaseOrSectorContainingIgnoreCase(query, query, query, pageable));
    }

     /**
     * Returns an aggregated list stocks grouped by sector
     * @return an {@link ResponseEntity} aggregated {@link List} of {@link StockEntity} grouped by sector
     * 
     * */
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

    /**
     * Creates a stock in the database and returns it
     * @param dto a data transfer object representing the stock we wish to add
     * @return a {@link ResponseEntity} with 201 status if successful with the {@link StockEntity} inside
     * @throws ResponseStatusException 404 if the stock id cannot be found, 409 if its updated ticker is already in use by another ticker.
     * 
     * */
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

    /**
     * Updates an existing stock in the database and returns it.
     * @param id the id of the stock
     * @param dto a data transfer object representing the stock we wish to update
     * @return a {@link ResponseEntity} with 200 status if successful with the {@link StockEntity} inside
     * @throws ResponseStatusException 404 if the stock id cannot be found, 409 if its updated ticker is already in use by another ticker.
     * 
     * */
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

    /**
     * Deletes a stock according to the id.
     * @param id the id of the stock
     * @return a {@link ResponseEntity} with 204 status if successful
     * @throws ResponseStatusException if no stock with such id exists
     * 
     * */
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
