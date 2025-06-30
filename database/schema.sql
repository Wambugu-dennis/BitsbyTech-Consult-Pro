-- =================================================================
-- Consult Vista - MySQL Database Schema
-- Version: 1.2
-- Description: Comprehensive schema for a consultancy management system.
-- =================================================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ConsultVista;
USE ConsultVista;

-- Drop tables in reverse order of dependency for a clean reset
DROP TABLE IF EXISTS `user_permission_overrides`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `project_team_members`;
DROP TABLE IF EXISTS `communication_logs`;
DROP TABLE IF EXISTS `key_contacts`;
DROP TABLE IF EXISTS `project_tags`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `attachments`;
DROP TABLE IF EXISTS `project_milestones`;
DROP TABLE IF EXISTS `project_tasks`;
DROP TABLE IF EXISTS `applied_taxes`;
DROP TABLE IF EXISTS `invoice_items`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `expenses`;
DROP TABLE IF EXISTS `budgets`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `tax_rates`;
DROP TABLE IF EXISTS `tax_types`;
DROP TABLE IF EXISTS `tax_jurisdictions`;

-- =================================================================
-- Core User and Access Control Tables
-- =================================================================

CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g., Administrator, Project Manager, Consultant',
  `description` TEXT
) COMMENT='Defines user roles within the system.';

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(2048),
  `role_id` INT,
  `reports_to_user_id` INT NULL COMMENT 'Self-referencing foreign key for hierarchy',
  `status` ENUM('Active', 'Invited', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Invited',
  `two_factor_secret` VARCHAR(255),
  `last_login` TIMESTAMP NULL,
  `password_last_changed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
  FOREIGN KEY (`reports_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) COMMENT='Stores user account information.';

CREATE TABLE `sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `last_active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) COMMENT='Tracks active user sessions for security monitoring.';

CREATE TABLE `password_reset_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) COMMENT='Stores tokens for the password reset process.';

-- =================================================================
-- Granular Permission & Auditing Tables
-- =================================================================

CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE COMMENT 'e.g., projects.create, invoices.approve',
  `description` TEXT,
  `category` VARCHAR(50) COMMENT 'e.g., Projects, Finances, Users'
) COMMENT='Defines all possible discrete permissions in the system.';

CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) COMMENT='Links roles to their allowed permissions (Many-to-Many).';

CREATE TABLE `user_permission_overrides` (
  `user_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `has_permission` BOOLEAN NOT NULL COMMENT 'TRUE for grant, FALSE for deny',
  PRIMARY KEY (`user_id`, `permission_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) COMMENT='Grants or denies specific permissions to a user, overriding their role.';

CREATE TABLE `audit_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT COMMENT 'The user who performed the action, can be NULL for system actions',
  `event` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `ip_address` VARCHAR(45),
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) COMMENT='Records significant events for security and compliance.';


-- =================================================================
-- Client and Project Management Tables
-- =================================================================

CREATE TABLE `tax_jurisdictions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `country_code` VARCHAR(3)
) COMMENT 'Defines tax regions, e.g., Kenya, USA - California.';

CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(100),
  `website` VARCHAR(2048),
  `logo_url` VARCHAR(2048),
  `status` ENUM('Active', 'Inactive', 'Prospect') NOT NULL DEFAULT 'Prospect',
  `client_tier` ENUM('Strategic', 'Key', 'Standard', 'Other'),
  `credit_rating` ENUM('Excellent', 'Good', 'Fair', 'Poor'),
  `address_street` VARCHAR(255),
  `address_city` VARCHAR(100),
  `address_state` VARCHAR(100),
  `address_zip` VARCHAR(20),
  `address_country` VARCHAR(100),
  `tax_jurisdiction_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tax_jurisdiction_id`) REFERENCES `tax_jurisdictions`(`id`)
) COMMENT='Stores information about client companies.';

CREATE TABLE `key_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100),
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
) COMMENT='Contact persons for each client.';

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
  `completion_percent` INT DEFAULT 0,
  `budget` DECIMAL(15, 2),
  `currency` VARCHAR(3) DEFAULT 'USD',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_manager_id`) REFERENCES `users`(`id`)
) COMMENT='Core table for consultancy projects.';

CREATE TABLE `project_team_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) COMMENT='Links users (consultants) to projects (Many-to-Many).';

-- =================================================================
-- New Tables for Deeper Features
-- =================================================================

CREATE TABLE `project_tasks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `assignee_user_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `status` ENUM('To Do', 'In Progress', 'Done') NOT NULL DEFAULT 'To Do',
    `priority` ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
    `due_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`assignee_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) COMMENT='Individual tasks within a project.';

CREATE TABLE `project_milestones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `due_date` DATE NOT NULL,
    `status` ENUM('Pending', 'In Progress', 'Completed', 'Delayed', 'At Risk') NOT NULL DEFAULT 'Pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) COMMENT='Key checkpoints and deliverables for a project.';

CREATE TABLE `communication_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT NOT NULL,
    `user_id` INT COMMENT 'The user who logged the communication',
    `type` ENUM('Email', 'Call', 'Meeting', 'Note') NOT NULL,
    `summary` TEXT NOT NULL,
    `communication_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) COMMENT='Records of interactions with clients.';

CREATE TABLE `tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='A list of all available tags.';

CREATE TABLE `project_tags` (
    `project_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    PRIMARY KEY (`project_id`, `tag_id`),
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) COMMENT='Links projects to tags (Many-to-Many).';

CREATE TABLE `attachments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `file_name` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(100),
    `file_size_bytes` BIGINT,
    `storage_path` VARCHAR(2048) NOT NULL COMMENT 'URL or path to the file in cloud storage',
    `uploaded_by_user_id` INT,
    `related_entity_type` ENUM('project', 'expense', 'client') NOT NULL,
    `related_entity_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_attachments_related_entity` (`related_entity_type`, `related_entity_id`),
    FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) COMMENT='Stores metadata for files uploaded to cloud storage.';

CREATE TABLE `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `start_time` TIMESTAMP NOT NULL,
    `end_time` TIMESTAMP NOT NULL,
    `is_all_day` BOOLEAN DEFAULT FALSE,
    `created_by_user_id` INT,
    `client_id` INT,
    `project_id` INT,
    `type` VARCHAR(50) COMMENT 'e.g., Client Meeting, Project Deadline',
    FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) COMMENT='Stores all calendar events.';

-- =================================================================
-- Financial Tables
-- =================================================================

CREATE TABLE `budgets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('Project', 'Departmental', 'General') NOT NULL,
    `project_id` INT,
    `department_name` VARCHAR(100),
    `total_amount` DECIMAL(15, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` ENUM('Planning', 'Active', 'Overspent', 'Completed', 'On Hold') NOT NULL,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) COMMENT 'Tracks budgets for projects or departments.';

CREATE TABLE `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `client_id` INT NOT NULL,
  `project_id` INT,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Void') NOT NULL DEFAULT 'Draft',
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `payment_method` VARCHAR(50),
  `payment_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) COMMENT='Stores all client invoices.';

CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `total_price` DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
) COMMENT='Line items for each invoice.';

CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submitted_by_user_id` INT NOT NULL,
  `project_id` INT,
  `budget_id` INT,
  `date` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount_including_tax` DECIMAL(15, 2) NOT NULL,
  `category` VARCHAR(100),
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `approved_by_user_id` INT,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`)
) COMMENT='Tracks all business and project-related expenses.';

-- =================================================================
-- Tax-Related Tables
-- =================================================================

CREATE TABLE `tax_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `abbreviation` VARCHAR(10),
  `description` TEXT
) COMMENT='Defines categories of taxes, e.g., VAT, Sales Tax.';

CREATE TABLE `tax_rates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jurisdiction_id` INT NOT NULL,
  `tax_type_id` INT NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `rate` DECIMAL(5, 2) NOT NULL COMMENT 'Percentage value, e.g., 16.00 for 16%',
  `is_compound` BOOLEAN DEFAULT FALSE,
  `start_date` DATE,
  `end_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`jurisdiction_id`) REFERENCES `tax_jurisdictions`(`id`),
  FOREIGN KEY (`tax_type_id`) REFERENCES `tax_types`(`id`)
) COMMENT='Specific tax rates for a jurisdiction and type.';

CREATE TABLE `applied_taxes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tax_rate_id` INT NOT NULL,
  `invoice_item_id` INT,
  `expense_id` INT,
  `applied_amount` DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates`(`id`),
  FOREIGN KEY (`invoice_item_id`) REFERENCES `invoice_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE CASCADE,
  CONSTRAINT chk_applied_tax_entity CHECK (`invoice_item_id` IS NOT NULL OR `expense_id` IS NOT NULL)
) COMMENT='Records which specific taxes were applied to line items or expenses.';
