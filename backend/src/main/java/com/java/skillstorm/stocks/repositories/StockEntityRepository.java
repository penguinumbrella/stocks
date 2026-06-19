package com.java.skillstorm.stocks.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.java.skillstorm.stocks.models.StockEntity;

// Using JpaRepository for maximum capability. Because it extends PagingAndSortingRepository, we can use pagination.
public interface StockEntityRepository extends JpaRepository<StockEntity, Integer> {

    /**
     * Checks if a stock with the specified ticker symbol already exists.
     * @param tickerSymbol the ticker symbol to check
     * @return true if stock with this ticker exists, false otherwise
     */
    boolean existsByTickerSymbol(String tickerSymbol); 
    
    /**
     * Searches for stocks matching specific keyword to ticker, company name, or sector.
     * @param ticker the keyword for ticker symbols
     * @param companyName the keyword for company name
     * @param sector the keyword for sector
     * @param pageable pageable pagination information for result set
     * @return a {@link Page} of matching {@link StockEntity} objects
     */
    Page<StockEntity> findByTickerSymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCaseOrSectorContainingIgnoreCase(
        String ticker, String companyName, String sector, Pageable pageable);

    /**
     * Aggregates total stocks grouped by sector for piechart.
     * @return list of objects where each index includes sector name and count of stocks
     */
    @Query("SELECT s.sector as sector, COUNT(s) as count FROM StockEntity s GROUP BY s.sector")
    List<Object[]> countStocksBySector();
    
    
}
