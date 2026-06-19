package com.java.skillstorm.stocks.dtos;
import java.sql.Date;

public record StockEntityDto(   
    int id, 

    String tickerSymbol, 
                                
    String companyName, 
                   
    String sector, 
               
    double currentMarketPrice,
          
    double targetPrice, 
                              
    Date dateAdded, 
                                
    String analystNotes) {
    
}
