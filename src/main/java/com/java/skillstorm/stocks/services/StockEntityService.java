package com.java.skillstorm.stocks.services;

import org.apache.catalina.startup.ClassLoaderFactory.Repository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
        if (this.repo.existsById(id)) {
            StockEntity updated = this.repo.save(new StockEntity(  0, 
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
        this.repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    
}
