-- Consult Vista Database Schema
-- Version: 1.2
-- Description: A comprehensive schema for the Consult Vista application,
-- designed for MySQL. This version assumes a fresh installation 

-- =================================================================
-- Module: User & Access Control
-- =================================================================

-- System-level roles for users (e.g., Administrator, Project Manager).
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Core user accounts table.
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY, -- Using UUIDs for users
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255),
  `role_id` INT,
  `reports_to_user_id` VARCHAR(36), -- Self-referencing FK for hierarchy
  `status` ENUM('Active', 'Inactive', 'Invited', 'Suspended') NOT NULL DEFAULT 'Invited',
  `two_factor_secret` VARCHAR(255),
  `last_login` TIMESTAMP NULL,
  `password_last_changed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
  FOREIGN KEY (`reports_to_user_id`) REFERENCES `users`(`id`)
);

-- User sessions for tracking active logins.
CREATE TABLE `sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `last_active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Secure password reset tokens.
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Granular permissions that can be assigned.
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE, -- e.g., 'projects.create', 'invoices.delete'
  `description` TEXT,
  `category` VARCHAR(100) -- e.g., 'Projects', 'Finances'
);

-- Join table for roles and permissions (Many-to-Many).
CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- Allows overriding role permissions for specific users.
CREATE TABLE `user_permission_overrides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `permission_id` INT NOT NULL,
  `has_permission` BOOLEAN NOT NULL, -- true for grant, false for deny
  UNIQUE (`user_id`, `permission_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- Comprehensive audit trail for critical system events.
CREATE TABLE `audit_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(36), -- Can be NULL for system events
  `action` VARCHAR(255) NOT NULL,
  `target_entity_type` VARCHAR(100), -- e.g., 'Project', 'User'
  `target_entity_id` VARCHAR(255),
  `details` JSON, -- Store before/after states
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);


-- =================================================================
-- Module: Financial Configuration (Taxes)
-- =================================================================

-- Defines tax jurisdictions (countries, states, etc.).
CREATE TABLE `tax_jurisdictions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `country_code` VARCHAR(10),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Defines types of taxes (e.g., VAT, Sales Tax).
CREATE TABLE `tax_types` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `abbreviation` VARCHAR(20),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Defines specific tax rates for a jurisdiction and type.
CREATE TABLE `tax_rates` (
  `id` VARCHAR(50) PRIMARY KEY,
  `jurisdiction_id` VARCHAR(50) NOT NULL,
  `tax_type_id` VARCHAR(50) NOT NULL,
  `rate` DECIMAL(10, 4) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  `is_compound` BOOLEAN DEFAULT FALSE,
  `applicable_to` JSON, -- Store array of strings like ['InvoiceLineItem', 'ServiceSales']
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`jurisdiction_id`) REFERENCES `tax_jurisdictions`(`id`),
  FOREIGN KEY (`tax_type_id`) REFERENCES `tax_types`(`id`)
);

-- Defines rules for when revenue should be recognized.
CREATE TABLE `revenue_recognition_rules` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `method` ENUM('OnInvoicePaid', 'PercentageOfCompletion', 'MilestoneBased', 'SubscriptionBased', 'Manual') NOT NULL,
  `description` TEXT,
  `criteria_description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- =================================================================
-- Module: Core Business (Clients & Projects)
-- =================================================================

-- Main table for client companies.
CREATE TABLE `clients` (
  `id` VARCHAR(36) PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(255),
  `website` VARCHAR(255),
  `logo_url` VARCHAR(255),
  `address_street` VARCHAR(255),
  `address_city` VARCHAR(100),
  `address_state` VARCHAR(100),
  `address_zip` VARCHAR(20),
  `address_country` VARCHAR(100),
  `client_tier` ENUM('Strategic', 'Key', 'Standard', 'Other'),
  `status` ENUM('Active', 'Inactive', 'Prospect') NOT NULL,
  `satisfaction_score` INT,
  `credit_rating` ENUM('Excellent', 'Good', 'Fair', 'Poor'),
  `notes` TEXT,
  `jurisdiction_id` VARCHAR(50), -- FK to tax_jurisdictions for default taxes
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`jurisdiction_id`) REFERENCES `tax_jurisdictions`(`id`)
);

-- Key contact persons for each client.
CREATE TABLE `key_contacts` (
  `id` VARCHAR(36) PRIMARY KEY,
  `client_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE,
  `phone` VARCHAR(50),
  `is_primary` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Logs of interactions with clients.
CREATE TABLE `communication_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `client_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36),
  `date` TIMESTAMP NOT NULL,
  `type` ENUM('Email', 'Call', 'Meeting', 'Note') NOT NULL,
  `summary` TEXT NOT NULL,
  `participants` JSON, -- Store array of names
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Main table for projects.
CREATE TABLE `projects` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `client_id` VARCHAR(36) NOT NULL,
  `project_manager_id` VARCHAR(36),
  `status` ENUM('To Do', 'In Progress', 'Done', 'On Hold', 'Cancelled') NOT NULL,
  `priority` ENUM('High', 'Medium', 'Low') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `actual_end_date` DATE,
  `budget` DECIMAL(15, 2),
  `currency` VARCHAR(3) DEFAULT 'USD',
  `billing_type` ENUM('Fixed Price', 'Time & Materials', 'Retainer'),
  `hourly_rate` DECIMAL(10, 2),
  `completion_percent` INT DEFAULT 0,
  `revenue_recognition_rule_id` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_manager_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`revenue_recognition_rule_id`) REFERENCES `revenue_recognition_rules`(`id`)
);

-- Join table for project team members (Many-to-Many).
CREATE TABLE `project_team_members` (
  `project_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Key milestones for each project.
CREATE TABLE `project_milestones` (
  `id` VARCHAR(36) PRIMARY KEY,
  `project_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `due_date` DATE NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Delayed', 'At Risk') NOT NULL,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);

-- Individual tasks within a project.
CREATE TABLE `project_tasks` (
  `id` VARCHAR(36) PRIMARY KEY,
  `project_id` VARCHAR(36) NOT NULL,
  `assignee_user_id` VARCHAR(36),
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('To Do', 'In Progress', 'Done') NOT NULL,
  `priority` ENUM('High', 'Medium', 'Low'),
  `due_date` DATE,
  `completed_at` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assignee_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);


-- =================================================================
-- Module: Financial Transactions
-- =================================================================

-- Main table for invoices.
CREATE TABLE `invoices` (
  `id` VARCHAR(50) PRIMARY KEY,
  `client_id` VARCHAR(36) NOT NULL,
  `project_id` VARCHAR(36),
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Void') NOT NULL,
  `currency` VARCHAR(3) NOT NULL,
  `notes` TEXT,
  `payment_details` TEXT,
  `payment_method` VARCHAR(50),
  `payment_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
);

-- Individual line items for each invoice.
CREATE TABLE `invoice_items` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `total_price` DECIMAL(15, 2) NOT NULL,
  `tax_amount_for_item` DECIMAL(15, 2),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
);

-- Tracks expenses related to projects or general operations.
CREATE TABLE `expenses` (
  `id` VARCHAR(36) PRIMARY KEY,
  `submitted_by_user_id` VARCHAR(36),
  `project_id` VARCHAR(36),
  `client_id` VARCHAR(36),
  `date` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2),
  `total_amount_including_tax` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL,
  `category` VARCHAR(100),
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
  `approved_by_user_id` VARCHAR(36),
  `approved_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`)
);

-- Table to log recognized revenue transactions.
CREATE TABLE `recognized_revenue_entries` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(36),
  `invoice_id` VARCHAR(50),
  `date_recognized` DATE NOT NULL,
  `amount_recognized` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL,
  `recognition_rule_id` VARCHAR(50),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`),
  FOREIGN KEY (`recognition_rule_id`) REFERENCES `revenue_recognition_rules`(`id`)
);


-- =================================================================
-- Module: Generic & Supporting Tables
-- =================================================================

-- Centralized table for file attachments.
CREATE TABLE `attachments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(100),
  `file_size_bytes` INT,
  `storage_url` TEXT NOT NULL,
  `uploaded_by_user_id` VARCHAR(36),
  `related_entity_type` VARCHAR(50) NOT NULL, -- e.g., 'project', 'expense', 'client'
  `related_entity_id` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_attachments_related_entity` (`related_entity_type`, `related_entity_id`),
  FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users`(`id`)
);

-- Table for tags (used for projects, clients, etc.).
CREATE TABLE `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE
);

-- Join table for projects and tags (Many-to-Many).
CREATE TABLE `project_tags` (
  `project_id` VARCHAR(36) NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `tag_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
);

-- Main table for calendar events.
CREATE TABLE `events` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `start_time` TIMESTAMP NOT NULL,
  `end_time` TIMESTAMP,
  `is_all_day` BOOLEAN DEFAULT FALSE,
  `type` ENUM('Project Milestone', 'Project Deadline', 'Client Meeting', 'Consultant Assignment', 'General Task', 'Holiday', 'Other') NOT NULL,
  `created_by_user_id` VARCHAR(36),
  `client_id` VARCHAR(36),
  `project_id` VARCHAR(36),
  `location` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
);

-- Join table for event attendees (users).
CREATE TABLE `event_attendees` (
    `event_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`event_id`, `user_id`),
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
