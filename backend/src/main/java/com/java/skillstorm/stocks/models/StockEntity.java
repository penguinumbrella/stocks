package com.java.skillstorm.stocks.models;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;


@Entity
@Table(name = "entry")
public class StockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ticker_symbol", nullable = false, unique = true)
    private String tickerSymbol;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "sector", nullable = false)
    private String sector;

    @Column(name = "current_market_price", nullable = false)
    @Positive
    private double currentMarketPrice;

    @Column(name = "target_price", nullable = false)
    @Positive
    private double targetPrice;

    @Column(name = "date_added", nullable = false)
    private Date dateAdded;

    @Column(name = "analyst_notes")
    private String analystNotes;

    

    public StockEntity() {
    }



    public StockEntity( int id, 
                        String tickerSymbol, 
                        String companyName, 
                        String sector, 
                        double currentMarketPrice,
                        double targetPrice, 
                        Date dateAdded, 
                        String analystNotes) {
        this.id = id;
        this.tickerSymbol = tickerSymbol;
        this.companyName = companyName;
        this.sector = sector;
        this.currentMarketPrice = currentMarketPrice;
        this.targetPrice = targetPrice;
        this.dateAdded = dateAdded;
        this.analystNotes = analystNotes;
    }



    public int getId() {
        return id;
    }



    public void setId(int id) {
        this.id = id;
    }



    public String getTickerSymbol() {
        return tickerSymbol;
    }



    public void setTickerSymbol(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }



    public String getCompanyName() {
        return companyName;
    }



    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }



    public String getSector() {
        return sector;
    }



    public void setSector(String sector) {
        this.sector = sector;
    }



    public double getCurrentMarketPrice() {
        return currentMarketPrice;
    }



    public void setCurrentMarketPrice(double currentMarketPrice) {
        this.currentMarketPrice = currentMarketPrice;
    }



    public double getTargetPrice() {
        return targetPrice;
    }



    public void setTargetPrice(double targetPrice) {
        this.targetPrice = targetPrice;
    }



    public Date getDateAdded() {
        return dateAdded;
    }



    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }



    public String getAnalystNotes() {
        return analystNotes;
    }



    public void setAnalystNotes(String analystNotes) {
        this.analystNotes = analystNotes;
    }

    
    
}
