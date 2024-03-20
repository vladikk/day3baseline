BEGIN;

CREATE SCHEMA IF NOT EXISTS fleetops;

CREATE TABLE IF NOT EXISTS fleetops.seat_types (
    seat_type_id VARCHAR(50) PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    width_cm INTEGER NOT NULL,
    height_cm INTEGER NOT NULL,
    pitch_cm INTEGER NOT NULL,
    weight_kg INTEGER NOT NULL,
    production_year INTEGER NOT NULL,
    comfort_level INTEGER NOT NULL,
    features TEXT NOT NULL,
    __version INT NOT NULL DEFAULT 1
);

INSERT INTO fleetops.seat_types (seat_type_id, type_name, width_cm, height_cm, pitch_cm, weight_kg, production_year, comfort_level, features) VALUES
('ECON-HRTG', 'Heritage Economy Non-Reclining', 43, 88, 70, 12, 1980, 5, 'Wooden, non-reclining, minimal cushion'),
('ECON-CLSC', 'Classic Economy Plus', 46, 92, 78, 15, 1990, 35, 'Basic padding, limited recline, extra legroom'),
('BIZ-RETRO', 'Retro Business Class Basic', 49, 95, 89, 22, 1998, 55, 'Basic reclining, added comfort features'),
('ECON-MILN', 'Millennium Economy Reclining', 45, 90, 72, 16, 2000, 25, 'Improved cushion, limited recline'),
('ECON-CONTP', 'Contemporary Economy Plus', 47, 94, 82, 18, 2010, 65, 'Enhanced padding, more legroom'),
('BIZ-ADV', 'Advanced Business Class Basic', 51, 97, 120, 28, 2005, 80, 'Premium reclining, superior comfort features'),
('BIZ-NEODLX', 'Neo Business Class Deluxe', 53, 100, 210, 32, 2015, 90, 'Lie-flat, luxury materials, maximum comfort'),
('ECON-FUTR', 'Future Economy Non-Reclining', 44, 89, 73, 14, 2018, 30, 'State-of-the-art materials, non-reclining'),
('ECON-GENP', 'Generation Plus Economy', 48, 96, 84, 20, 2020, 75, 'High comfort, adjustable legroom'),
('BIZ-ULTRA', 'Ultra Business Class', 54, 101, 220, 35, 2018, 100, 'Ultimate lie-flat, exclusive luxury features');

CREATE TABLE IF NOT EXISTS fleetops.aircrafts (
    model VARCHAR(50) PRIMARY KEY,
    manufacturer VARCHAR(50) NOT NULL,
    wingspan_m NUMERIC(5,2) NOT NULL,
    cabin_width_m NUMERIC(4,2) NOT NULL,
    cabin_height_m NUMERIC(4,2) NOT NULL,
    cabin_length_m NUMERIC(5,2) NOT NULL,
    cargo_capacity_mc NUMERIC(6,2) NOT NULL,
    range_km INT NOT NULL,
    cruise_speed_m NUMERIC(4,3) NOT NULL,
    engine_type VARCHAR(50) NOT NULL,
    noise_level_EPNdB_min INT NOT NULL,
    noise_level_EPNdB_max INT NOT NULL,
    __version INT NOT NULL DEFAULT 1
);

INSERT INTO fleetops.aircrafts (model, manufacturer, wingspan_m, cabin_width_m, cabin_height_m, cabin_length_m, cargo_capacity_mc, range_km, cruise_speed_m, engine_type, noise_level_EPNdB_min, noise_level_EPNdB_max) VALUES
('737-300', 'Boeing', 28.9, 3.54, 2.2, 24.13, 27.5, 4444, 0.785, 'CFM56-3 Series', 65, 70),
('757-200', 'Boeing', 38.05, 3.54, 2.13, 43.21, 43.4, 7222, 0.8, 'RB211', 65, 72),
('757-300', 'Boeing', 38.05, 3.54, 2.13, 54.47, 52.5, 6295, 0.8, 'RB211', 65, 72),
('747SP', 'Boeing', 59.64, 6.13, 2.41, 56.31, 170, 12320, 0.85, 'Pratt & Whitney JT9D', 70, 75),
('A310', 'Airbus', 43.9, 5.28, 2.54, 36.85, 150, 8050, 0.8, 'GE CF6-80', 65, 70),
('A300', 'Airbus', 44.84, 5.28, 2.54, 40.7, 164, 7500, 0.82, 'PW4000', 65, 70);

CREATE TABLE IF NOT EXISTS fleetops.fleet_units (
    unit_id VARCHAR(50) PRIMARY KEY,
    unit_data JSONB NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    __version INT NOT NULL DEFAULT 1
);

INSERT INTO fleetops.fleet_units (unit_id, unit_data) VALUES
('E731', '{"tailNumber": "E731", "model": "Boeing 737-300", "manufacturingDate": "1984-05-20", "dateOfPurchase": "2015-04-15", "nextMaintenanceDate": "2024-04-25", "cabinLayoutId": "C3001"}'),
('E752', '{"tailNumber": "E752", "model": "757-200", "manufacturingDate": "1987-09-12", "dateOfPurchase": "2015-06-30", "nextMaintenanceDate": "2024-06-10", "cabinLayoutId": "C2001"}'),
('E753', '{"tailNumber": "E753", "model": "757-200", "manufacturingDate": "1987-10-05", "dateOfPurchase": "2016-02-20", "nextMaintenanceDate": "2024-07-15", "cabinLayoutId": "C2002"}'),
('E754', '{"tailNumber": "E754", "model": "757-200", "manufacturingDate": "1988-01-20", "dateOfPurchase": "2016-03-05", "nextMaintenanceDate": "2024-08-05", "cabinLayoutId": "C2003"}'),
('E763', '{"tailNumber": "E763", "model": "757-300", "manufacturingDate": "1999-04-27", "dateOfPurchase": "2017-05-17", "nextMaintenanceDate": "2024-09-10", "cabinLayoutId": "C3002"}'),
('E764', '{"tailNumber": "E764", "model": "757-300", "manufacturingDate": "1999-05-30", "dateOfPurchase": "2017-07-21", "nextMaintenanceDate": "2024-10-20", "cabinLayoutId": "C3003"}'),
('E747', '{"tailNumber": "E747", "model": "747SP", "manufacturingDate": "1976-03-05", "dateOfPurchase": "2015-09-10", "nextMaintenanceDate": "2024-11-12", "cabinLayoutId": "C7471"}'),
('E310', '{"tailNumber": "E310", "model": "A310", "manufacturingDate": "1983-04-03", "dateOfPurchase": "2016-01-11", "nextMaintenanceDate": "2024-05-22", "cabinLayoutId": "A3101"}'),
('E311', '{"tailNumber": "E311", "model": "A310", "manufacturingDate": "1983-06-12", "dateOfPurchase": "2016-04-08", "nextMaintenanceDate": "2024-12-05", "cabinLayoutId": "A3102"}'),
('E300', '{"tailNumber": "E300", "model": "A300", "manufacturingDate": "1980-11-07", "dateOfPurchase": "2015-08-23", "nextMaintenanceDate": "2024-07-05", "cabinLayoutId": "A3001"}');

CREATE TABLE IF NOT EXISTS fleetops.cabin_layouts (
    layout_id VARCHAR(50) PRIMARY KEY,
    layout_data JSONB NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    __version INT NOT NULL DEFAULT 1
);

INSERT INTO fleetops.cabin_layouts(layout_id, layout_data) VALUES
('C100', '{"layoutId":"C100","width":280,"length":2222,"rows":[{"seatType":"BIZ-ULTRA","seatGroups":[2,2],"extraSpace":10},{"seatType":"BIZ-ULTRA","seatGroups":[2,2],"extraSpace":10},{"seatType":"BIZ-ULTRA","seatGroups":[2,2],"extraSpace":0},{"seatType":"BIZ-ULTRA","seatGroups":[2,2],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[2,2],"extraSpace":10},{"seatType":"ECON-CLSC","seatGroups":[2,2],"extraSpace":10},{"seatType":"ECON-CLSC","seatGroups":[2,2],"extraSpace":10},{"seatType":"ECON-CLSC","seatGroups":[2,2],"extraSpace":10},{"seatType":"ECON-CLSC","seatGroups":[2,2],"extraSpace":10},{"seatType":"ECON-CLSC","seatGroups":[2,2],"extraSpace":10},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":0},{"seatType":"ECON-CLSC","seatGroups":[3,3],"extraSpace":10}],"version":1}');

COMMIT;

BEGIN;

CREATE SCHEMA IF NOT EXISTS wolfdesk;

CREATE SEQUENCE IF NOT EXISTS wolfdesk.support_cases_seq;

CREATE TABLE IF NOT EXISTS wolfdesk.support_cases (
  agg_id UUID PRIMARY KEY,
  case_data JSONB,
  case_version INTEGER,
  enumeration_timestamp BIGINT NOT NULL DEFAULT nextval('wolfdesk.support_cases_seq')
);

CREATE OR REPLACE FUNCTION increment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.enumeration_timestamp = nextval('wolfdesk.support_cases_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_enum_timestamp_before_update
BEFORE UPDATE ON wolfdesk.support_cases
FOR EACH ROW EXECUTE FUNCTION increment_timestamp();

CREATE TABLE IF NOT EXISTS wolfdesk.outbox (
    event_id BIGSERIAL PRIMARY KEY,
    agg_id UUID NOT NULL,
    payload JSON NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_on TIMESTAMP NULL
);

CREATE INDEX idx_events_is_published ON wolfdesk.outbox (is_published);

CREATE SEQUENCE IF NOT EXISTS wolfdesk.support_cases_es_seq;

CREATE TABLE wolfdesk.support_cases_es (
    agg_id UUID NOT NULL,
    changeset_id INTEGER NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_on TIMESTAMP NULL,
    enumeration_timestamp BIGINT NOT NULL DEFAULT nextval('wolfdesk.support_cases_es_seq'),
    PRIMARY KEY (agg_id, changeset_id)
    
);

CREATE TRIGGER increment_es_enum_timestamp_before_update
BEFORE UPDATE ON wolfdesk.support_cases_es
FOR EACH ROW EXECUTE FUNCTION increment_timestamp();

COMMIT;
