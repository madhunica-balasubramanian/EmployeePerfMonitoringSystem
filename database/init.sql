-- Create database
CREATE DATABASE wellness_db;

-- Connect to the database
\c wellness_db;

-- Create enum types
CREATE TYPE department_type AS ENUM ('USPS', 'HEALTHCARE', 'TRANSPORTATION');
CREATE TYPE role_type AS ENUM ('POSTAL_WORKER', 'HEALTHCARE_STAFF', 'TRANSPORTATION_STAFF', 'SUPERVISOR', 'ADMIN');

-- Create tables
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type department_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role role_type NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metric_definitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    metric_type VARCHAR(50) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wellness_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    metric_id INTEGER REFERENCES metric_definitions(id) NOT NULL,
    date DATE NOT NULL,
    value FLOAT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    metric_id INTEGER REFERENCES metric_definitions(id) NOT NULL,
    date DATE NOT NULL,
    value FLOAT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    layout TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for departments
INSERT INTO departments (name, type, description)
VALUES 
('United States Postal Service', 'USPS', 'Postal delivery services'),
('VA Healthcare System', 'HEALTHCARE', 'Veterans healthcare services'),
('Federal Aviation Administration', 'TRANSPORTATION', 'Air transportation safety');

-- Insert sample metric definitions for each department
-- USPS Metrics
INSERT INTO metric_definitions (name, description, metric_type, data_type, unit, department_id)
VALUES 
('Mail Delivery Rate', 'Percentage of mail delivered on time', 'performance', 'float', '%', 1),
('Package Delivery Rate', 'Percentage of packages delivered on time', 'performance', 'float', '%', 1),
('Customer Complaints', 'Number of customer complaints received', 'performance', 'integer', 'count', 1),
('Customer Praise', 'Number of customer praise received', 'performance', 'integer', 'count', 1),
('Delivery Accuracy', 'Percentage of accurately delivered mail/packages', 'performance', 'float', '%', 1),
('Daily Steps', 'Number of steps walked during delivery', 'wellness', 'integer', 'steps', 1),
('Distance Walked', 'Distance walked during delivery', 'wellness', 'float', 'miles', 1),
('Injury Reports', 'Number of injuries reported', 'wellness', 'integer', 'count', 1),
('Weather Exposure', 'Hours exposed to extreme weather', 'wellness', 'float', 'hours', 1);

-- Healthcare Metrics
INSERT INTO metric_definitions (name, description, metric_type, data_type, unit, department_id)
VALUES 
('Patients Attended', 'Number of patients attended', 'performance', 'integer', 'count', 2),
('Patient Satisfaction', 'Average patient satisfaction score', 'performance', 'float', 'score', 2),
('Report Timeliness', 'Percentage of reports submitted on time', 'performance', 'float', '%', 2),
('Response Time', 'Average response time to patient requests', 'performance', 'float', 'minutes', 2),
('Hours Worked', 'Number of hours worked per day', 'wellness', 'float', 'hours', 2),
('Breaks Taken', 'Number of breaks taken per day', 'wellness', 'integer', 'count', 2),
('Burnout Risk', 'Burnout risk assessment score', 'wellness', 'float', 'score', 2),
('Sleep Hours', 'Hours of sleep per night', 'wellness', 'float', 'hours', 2),
('Stress Level', 'Self-reported stress level', 'wellness', 'float', 'score', 2);

-- Transportation Metrics
INSERT INTO metric_definitions (name, description, metric_type, data_type, unit, department_id)
VALUES 
('Project Completions', 'Number of project milestones completed', 'performance', 'integer', 'count', 3),
('Maintenance Checks', 'Number of maintenance checks completed on time', 'performance', 'integer', 'count', 3),
('Incident-free Days', 'Number of consecutive days without incidents', 'performance', 'integer', 'days', 3),
('Sleep Tracking', 'Hours of sleep per night for operators', 'wellness', 'float', 'hours', 3),
('Fatigue Risk', 'Fatigue risk index score', 'wellness', 'float', 'score', 3),
('Shift Duration', 'Duration of work shifts', 'wellness', 'float', 'hours', 3);