-- Consult Vista - MySQL Database Schema
-- Version: 2.0
-- Description: A comprehensive, relational schema for a fresh installation.
-- This schema supports all application modules including detailed user management,
-- project and client tracking, advanced financials, and a structured tax system.

-- Create the database if it doesn't exist (optional, often done separately)
-- CREATE DATABASE IF NOT EXISTS ConsultVista;
-- USE ConsultVista;

--
-- Core User & Access Control Tables
--

-- Roles for users (e.g., Administrator, Project Manager)
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT
);

-- Users of the system
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255),
  `role_id` INT NOT NULL,
  `reports_to_user_id` INT,
  `status` ENUM('Active', 'Invited', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Invited',
  `last_login` TIMESTAMP NULL,
  `password_last_changed_at` TIMESTAMP NULL,
  `two_factor_secret` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
  FOREIGN KEY (`reports_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Active user sessions for security management
CREATE TABLE `sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `device_info` VARCHAR(255),
  `ip_address` VARCHAR(45),
  `last_active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Password reset tokens
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System-wide permissions that can be assigned to roles
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(255) NOT NULL,
  `module` VARCHAR(255) NOT NULL,
  `description` TEXT,
  UNIQUE KEY `unique_permission` (`action`, `module`)
);

-- Join table for roles and their permissions (Many-to-Many)
CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- User-specific permission overrides (for exceptions)
CREATE TABLE `user_permission_overrides` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    `has_permission` BOOLEAN NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `user_permission_override` (`user_id`, `permission_id`)
);


--
-- Client & Project Management Tables
--

-- Tax jurisdictions for clients and projects
CREATE TABLE `tax_jurisdictions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `country_code` VARCHAR(10),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Client companies
CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(255),
  `website` VARCHAR(255),
  `logo_url` VARCHAR(255),
  `address_street` VARCHAR(255),
  `address_city` VARCHAR(255),
  `address_state` VARCHAR(255),
  `address_zip` VARCHAR(50),
  `address_country` VARCHAR(255),
  `client_tier` ENUM('Strategic', 'Key', 'Standard', 'Other'),
  `status` ENUM('Active', 'Inactive', 'Prospect') NOT NULL DEFAULT 'Prospect',
  `credit_rating` ENUM('Excellent', 'Good', 'Fair', 'Poor'),
  `notes` TEXT,
  `jurisdiction_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`jurisdiction_id`) REFERENCES `tax_jurisdictions`(`id`)
);

-- Key contacts for each client
CREATE TABLE `key_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Projects for clients
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `client_id` INT NOT NULL,
  `project_manager_id` INT NOT NULL,
  `status` ENUM('To Do', 'In Progress', 'Done', 'On Hold', 'Cancelled') NOT NULL DEFAULT 'To Do',
  `priority` ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `actual_end_date` DATE,
  `budget` DECIMAL(12, 2),
  `currency` VARCHAR(3) DEFAULT 'USD',
  `billing_type` ENUM('Fixed Price', 'Time & Materials', 'Retainer'),
  `hourly_rate` DECIMAL(10,2),
  `completion_percent` TINYINT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_manager_id`) REFERENCES `users`(`id`)
);

-- Project team members (Many-to-Many join table)
CREATE TABLE `project_team_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Tags for projects or other entities
CREATE TABLE `tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `project_tags` (
    `project_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    PRIMARY KEY (`project_id`, `tag_id`),
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
);

-- Project milestones
CREATE TABLE `project_milestones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `due_date` DATE NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Delayed', 'At Risk') NOT NULL DEFAULT 'Pending',
  `completion_date` DATE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);

-- Individual tasks within a project
CREATE TABLE `project_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `milestone_id` INT,
  `assignee_user_id` INT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('To Do', 'In Progress', 'Done') NOT NULL DEFAULT 'To Do',
  `priority` ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  `due_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`milestone_id`) REFERENCES `project_milestones`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assignee_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

--
-- Financial & Tax Tables
--

-- Tax types (e.g., VAT, Sales Tax, WHT)
CREATE TABLE `tax_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `abbreviation` VARCHAR(20),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tax rates combining jurisdiction, type, and rate details
CREATE TABLE `tax_rates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jurisdiction_id` INT NOT NULL,
  `tax_type_id` INT NOT NULL,
  `rate` DECIMAL(5, 2) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  `is_compound` BOOLEAN NOT NULL DEFAULT FALSE,
  `applicable_to` JSON, -- Store an array like ["InvoiceLineItem", "Expense"]
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`jurisdiction_id`) REFERENCES `tax_jurisdictions`(`id`),
  FOREIGN KEY (`tax_type_id`) REFERENCES `tax_types`(`id`)
);

-- Budgets for projects or departments
CREATE TABLE `budgets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('Project', 'Departmental', 'General') NOT NULL,
  `project_id` INT,
  `department_name` VARCHAR(255),
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('Planning', 'Active', 'Overspent', 'Completed', 'On Hold') NOT NULL DEFAULT 'Planning',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);

-- Expenses
CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submitted_by_user_id` INT NOT NULL,
  `project_id` INT,
  `client_id` INT,
  `budget_id` INT,
  `date` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `tax_amount` DECIMAL(10, 2) DEFAULT 0.00,
  `currency` VARCHAR(3) NOT NULL,
  `category` VARCHAR(255),
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `approved_by_user_id` INT,
  `approved_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`),
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`)
);

-- Invoices
CREATE TABLE `invoices` (
  `id` VARCHAR(255) PRIMARY KEY,
  `client_id` INT NOT NULL,
  `project_id` INT,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  `tax_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Void') NOT NULL DEFAULT 'Draft',
  `currency` VARCHAR(3) NOT NULL,
  `payment_method` VARCHAR(255),
  `payment_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
);

-- Line items for invoices
CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `total_price` DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
);

-- Applied taxes for both invoice items and expenses (polymorphic-style)
CREATE TABLE `applied_taxes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `tax_rate_id` INT NOT NULL,
    `related_entity_type` ENUM('invoice_item', 'expense') NOT NULL,
    `related_entity_id` INT NOT NULL,
    `applied_amount` DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates`(`id`)
);


--
-- General Application & System Tables
--

-- Attachments (Polymorphic: can be linked to projects, expenses, etc.)
CREATE TABLE `attachments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(100),
  `file_size` INT, -- in bytes
  `storage_path` VARCHAR(255) NOT NULL UNIQUE, -- URL or S3 key
  `related_entity_type` ENUM('project', 'expense', 'client') NOT NULL,
  `related_entity_id` INT NOT NULL,
  `uploaded_by_user_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Communication logs with clients
CREATE TABLE `communication_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `user_id` INT,
  `date` TIMESTAMP NOT NULL,
  `type` ENUM('Email', 'Call', 'Meeting', 'Note') NOT NULL,
  `summary` TEXT,
  `participants` TEXT, -- For simplicity; could be a JSON or separate table
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Calendar events
CREATE TABLE `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `start_time` TIMESTAMP NOT NULL,
    `end_time` TIMESTAMP,
    `is_all_day` BOOLEAN DEFAULT FALSE,
    `description` TEXT,
    `type` VARCHAR(255), -- Corresponds to CalendarEventType from types.ts
    `created_by_user_id` INT,
    `project_id` INT,
    `client_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Audit logs for important system activities
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT, -- Nullable for system-generated events
  `action` VARCHAR(255) NOT NULL,
  `module` VARCHAR(255),
  `details` TEXT,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Storing results from AI features
CREATE TABLE `risk_analyses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `request_payload` JSON,
  `risk_score` INT,
  `risk_factors_summary` TEXT,
  `analyzed_by_user_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`analyzed_by_user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `business_insights` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `context_query` TEXT,
  `insight_response` JSON,
  `generated_by_user_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`generated_by_user_id`) REFERENCES `users`(`id`)
);
