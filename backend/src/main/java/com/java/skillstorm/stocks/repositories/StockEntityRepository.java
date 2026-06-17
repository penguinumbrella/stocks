package com.java.skillstorm.stocks.repositories;

import org.springframework.data.repository.CrudRepository;

import com.java.skillstorm.stocks.models.StockEntity;

public interface StockEntityRepository extends CrudRepository<StockEntity, Integer> {

    boolean existsByTickerSymbol(String tickerSymbol); // helper function to see if ticker exists in repo
    
}
