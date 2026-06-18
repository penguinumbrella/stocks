package com.java.skillstorm.stocks.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.java.skillstorm.stocks.models.StockEntity;

public interface StockEntityRepository extends JpaRepository<StockEntity, Integer> {

    boolean existsByTickerSymbol(String tickerSymbol); // helper function to see if ticker exists in repo
    
    // search for stocks where the ticker, company name, or sector is like what we need
    Page<StockEntity> findByTickerSymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCaseOrSectorContainingIgnoreCase(
        String ticker, String companyName, String sector, Pageable pageable);

    
    
}
