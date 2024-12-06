-- Table to track serial numbers in database system
CREATE TABLE serial_numbers (
    serial_number TEXT PRIMARY KEY,
    date_entered TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Transactional table to track when a test has been inserted
CREATE TABLE completed_tests (
    test_id BIGSERIAL PRIMARY KEY,
    serial_number TEXT,
    test_type TEXT NOT NULL,
    date_entered TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    test_start_timestamp TIMESTAMPTZ NOT NULL,
    test_end_timestamp TIMESTAMPTZ NOT NULL,
    notes TEXT, -- can be null
    -- metadata JSONB -- uncomment to add in metadata if needed
    CONSTRAINT fk_serial_number 
        FOREIGN KEY(serial_number) 
        REFERENCES serial_numbers(serial_number)
);
-- Index for faster lookups by serial_number and test_type
CREATE INDEX idx_serial_test 
ON completed_tests(serial_number, test_type);



-- Example test tables
CREATE TABLE test_qc (
    datapoint_id BIGSERIAL PRIMARY KEY,
    test_id BIGINT NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(10) NOT NULL
);