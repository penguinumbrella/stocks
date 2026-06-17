CREATE TABLE stocks.entry (
    id                      BIGSERIAL       PRIMARY KEY,
    ticker_symbol           VARCHAR(10)     NOT NULL UNIQUE,
    company_name            VARCHAR(255)    NOT NULL,
    sector                  VARCHAR(64)     DEFAULT 'Other',
    current_market_price    NUMERIC(19, 4)  NOT NULL CHECK (current_market_price > 0),
    target_price            NUMERIC(19, 4)  NOT NULL CHECK (target_price > 0),
    date_added              DATE            DEFAULT CURRENT_DATE NOT NULL,
    analyst_notes           TEXT
);