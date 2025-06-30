-- Consult Vista - MySQL Database Schema
-- Version 2.0
-- This schema is designed for a relational database and includes tables
-- for core application features as well as advanced security and access control.

-- To setup:
-- 1. Create a database named `ConsultVista`
--    CREATE DATABASE ConsultVista;
-- 2. Use the database:
--    USE ConsultVista;
-- 3. Run this script to create all tables.

-- =================================================================
-- Module: User, Roles, and Access Control
-- =================================================================

-- `roles`: Defines the user roles within the system.
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- `users`: Stores user account information.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255),
  `role_id` INT,
  `reports_to_user_id` INT,
  `status` ENUM('Active', 'Invited', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Invited',
  `last_login_at` TIMESTAMP NULL,
  `password_last_changed_at` TIMESTAMP NULL,
  `is_two_factor_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `two_factor_secret` VARCHAR(255), -- Encrypted secret
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
  FOREIGN KEY (`reports_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- `permissions`: Defines granular actions that can be controlled.
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL, -- e.g., 'create', 'view', 'edit', 'delete'
  `subject` VARCHAR(100) NOT NULL, -- e.g., 'Project', 'Invoice', 'User'
  `description` TEXT,
  UNIQUE (`action`, `subject`)
);

-- `role_permissions`: Links roles to specific permissions (Many-to-Many).
CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- `user_permission_overrides`: Allows for user-specific permission adjustments.
CREATE TABLE `user_permission_overrides` (
  `user_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `is_allowed` BOOLEAN NOT NULL, -- true for grant, false for explicit deny
  PRIMARY KEY (`user_id`, `permission_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- `sessions`: Stores active user sessions for security monitoring.
CREATE TABLE `sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `last_active_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- `password_reset_tokens`: Securely stores tokens for password resets.
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`email`, `token_hash`)
);

-- `audit_logs`: Tracks significant events for compliance and security.
CREATE TABLE `audit_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(255) NOT NULL,
  `subject_type` VARCHAR(255),
  `subject_id` VARCHAR(255),
  `details` JSON,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);


-- =================================================================
-- Module: Client & Project Management
-- =================================================================

-- `clients`: Stores information about client companies.
CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(100),
  `website` VARCHAR(255),
  `status` ENUM('Active', 'Inactive', 'Prospect') NOT NULL DEFAULT 'Prospect',
  `client_tier` ENUM('Strategic', 'Key', 'Standard', 'Other') DEFAULT 'Standard',
  `credit_rating` ENUM('Excellent', 'Good', 'Fair', 'Poor') DEFAULT 'Good',
  `address_street` VARCHAR(255),
  `address_city` VARCHAR(100),
  `address_state` VARCHAR(100),
  `address_zip` VARCHAR(20),
  `address_country` VARCHAR(100),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- `key_contacts`: Stores contact persons for each client.
CREATE TABLE `key_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100),
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- `projects`: Core table for consultancy projects.
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
  `budget_amount` DECIMAL(15, 2),
  `currency` VARCHAR(3) DEFAULT 'USD',
  `completion_percent` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_manager_id`) REFERENCES `users`(`id`)
);

-- `project_team_members`: Links users (consultants) to projects (Many-to-Many).
CREATE TABLE `project_team_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


-- =================================================================
-- Module: Financials
-- =================================================================

-- `tax_rates`: Manages different tax rates for jurisdictions.
CREATE TABLE `tax_rates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `description` VARCHAR(255) NOT NULL,
  `rate` DECIMAL(5, 2) NOT NULL,
  `jurisdiction` VARCHAR(100) NOT NULL,
  `is_compound` BOOLEAN NOT NULL DEFAULT FALSE
);

-- `invoices`: Tracks billing to clients.
CREATE TABLE `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `client_id` INT NOT NULL,
  `project_id` INT,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Void') NOT NULL DEFAULT 'Draft',
  `currency` VARCHAR(3) DEFAULT 'USD',
  `payment_method` VARCHAR(50),
  `payment_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
);

-- `invoice_items`: Line items for each invoice.
CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `total_price` DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
);

-- `expenses`: Tracks all project and operational expenses.
CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submitted_by_user_id` INT NOT NULL,
  `project_id` INT,
  `date` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount_including_tax` DECIMAL(15, 2) NOT NULL,
  `category` VARCHAR(100),
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `receipt_url` VARCHAR(255),
  `approved_by_user_id` INT,
  `approved_at` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
);

-- `applied_taxes`: Join table for taxes on invoices and expenses.
CREATE TABLE `applied_taxes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tax_rate_id` INT NOT NULL,
  `invoice_item_id` INT,
  `expense_id` INT,
  `applied_amount` DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates`(`id`),
  FOREIGN KEY (`invoice_item_id`) REFERENCES `invoice_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE CASCADE,
  CONSTRAINT chk_applied_tax_target CHECK (`invoice_item_id` IS NOT NULL OR `expense_id` IS NOT NULL)
);

-- =================================================================
-- Sample Data (Optional - for initial setup)
-- =================================================================

-- Insert basic roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Administrator', 'Has full system access.'),
(2, 'Project Manager', 'Manages projects and teams.'),
(3, 'Consultant', 'Works on projects and logs expenses.'),
(4, 'Finance Manager', 'Manages billing and financial data.'),
(5, 'Client User', 'External user with limited project view.'),
(6, 'Viewer', 'Read-only access to most parts of the system.');

-- Note: Further sample data for users, projects etc. would be added here
-- or through application seeds for a full setup.

