package com.java.skillstorm.stocks.dtos;
import java.sql.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record StockEntityDto(   
    int id, 

    @NotBlank(message = "Ticker symbol is required")
    @Size(min = 1, max = 10, message = "Ticker must be between 1 and 10 characters")
    String tickerSymbol, 
                                
    @NotBlank(message = "Company name is required")
    String companyName, 
                   
    @NotBlank(message = "Sector is required")
    String sector, 
               
    @Positive(message = "Current market price must be greater than 0")
    double currentMarketPrice,
          
    @Positive(message = "Target price must be greater than 0")
    double targetPrice, 
                              
    @NotNull(message = "Date added is required")
    Date dateAdded, 
                                
    String analystNotes) {
    
}
