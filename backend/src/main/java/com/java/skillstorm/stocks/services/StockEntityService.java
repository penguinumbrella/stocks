package com.java.skillstorm.stocks.services;

import java.util.Optional;

import org.apache.catalina.startup.ClassLoaderFactory.Repository;
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

    public StockEntityService(StockEntityRepository repo) {
        this.repo = repo;
    }

    // findAll
    public ResponseEntity<Iterable<StockEntity>> getAll() {
        return ResponseEntity.ok(this.repo.findAll());
    }

    // create one
    public ResponseEntity<StockEntity> createOne(StockEntityDto dto) {

        if(repo.existsByTickerSymbol(dto.tickerSymbol())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Ticker " + dto.tickerSymbol() + " already exists."
            );
        }

        if (dto.currentMarketPrice() <= 0 || dto.targetPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Prices must be positive values."
            );
        }

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

        Optional<StockEntity> optionalStock = this.repo.findById(id);
        StockEntity existingStock;

        if (optionalStock.isPresent()) {
            existingStock = optionalStock.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot update stock. Stock with id " + id + " not found.");
        }

        if (!existingStock.getTickerSymbol().equals(dto.tickerSymbol()) && repo.existsByTickerSymbol(dto.tickerSymbol())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Ticker '" + dto.tickerSymbol() + "' is already in use by another stock."
            );
        }

        if (dto.currentMarketPrice() <= 0 || dto.targetPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Prices must be positive values."
            );
        }

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

        if(!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Cannot delete. Stock with ID " + id + " not found."
            );
        }

        this.repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    
}
