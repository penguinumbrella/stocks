package com.java.skillstorm.stocks.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.java.skillstorm.stocks.models.StockEntity;

// Using JpaRepository for maximum capability. Because it extends PagingAndSortingRepository, we can use pagination.
public interface StockEntityRepository extends JpaRepository<StockEntity, Integer> {

    // check for duplicate tickers
    boolean existsByTickerSymbol(String tickerSymbol); 
    
    // pagination search for stocks where the ticker, company name, or sector is like what we need
    Page<StockEntity> findByTickerSymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCaseOrSectorContainingIgnoreCase(
        String ticker, String companyName, String sector, Pageable pageable);

    // return counts of all stocks aggregated by sector
    @Query("SELECT s.sector as sector, COUNT(s) as count FROM StockEntity s GROUP BY s.sector")
    List<Object[]> countStocksBySector();
    
    
}
