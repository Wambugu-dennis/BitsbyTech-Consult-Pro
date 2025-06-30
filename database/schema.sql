-- ConsultVista Database Schema for MySQL
-- Version 1.0

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ConsultVista;
USE ConsultVista;

--
-- Table structure for table `roles`
--
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., Administrator, Project Manager',
  `description` TEXT COMMENT 'Describes the purpose of the role'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255),
  `role_id` INT,
  `status` ENUM('Active', 'Invited', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Invited',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `clients`
--
CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(100),
  `website` VARCHAR(255),
  `status` ENUM('Active', 'Inactive', 'Prospect') NOT NULL,
  `client_tier` ENUM('Strategic', 'Key', 'Standard', 'Other'),
  `credit_rating` ENUM('Excellent', 'Good', 'Fair', 'Poor'),
  `address_street` VARCHAR(255),
  `address_city` VARCHAR(100),
  `address_state` VARCHAR(100),
  `address_zip` VARCHAR(20),
  `address_country` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `key_contacts`
--
CREATE TABLE `key_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100),
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `projects`
--
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `client_id` INT NOT NULL,
  `project_manager_id` INT,
  `status` ENUM('To Do', 'In Progress', 'Done') NOT NULL,
  `priority` ENUM('High', 'Medium', 'Low') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `completion_percent` INT DEFAULT 0,
  `budget` DECIMAL(15, 2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_manager_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `project_team_members` (Join Table)
--
CREATE TABLE `project_team_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `invoices`
--
CREATE TABLE `invoices` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT 'e.g., INV-2024-001',
  `client_id` INT NOT NULL,
  `project_id` INT,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Void') NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `payment_method` VARCHAR(50),
  `payment_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `invoice_items`
--
CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `total_price` DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `expenses`
--
CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submitted_by_user_id` INT,
  `project_id` INT,
  `date` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `total_amount_including_tax` DECIMAL(15, 2) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
  `receipt_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `tax_rates`
--
CREATE TABLE `tax_rates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jurisdiction` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `rate` DECIMAL(5, 2) NOT NULL,
  `is_compound` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `applied_taxes` (Join Table)
--
CREATE TABLE `applied_taxes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tax_rate_id` INT NOT NULL,
  `invoice_item_id` INT,
  `expense_id` INT,
  `applied_amount` DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`invoice_item_id`) REFERENCES `invoice_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `risk_analyses`
--
CREATE TABLE `risk_analyses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `request_payload` JSON NOT NULL,
  `risk_score` INT NOT NULL,
  `risk_factors_summary` TEXT NOT NULL,
  `analyzed_by_user_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`analyzed_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `business_insights`
--
CREATE TABLE `business_insights` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `context_query` TEXT NOT NULL,
  `insight_response` JSON NOT NULL,
  `generated_by_user_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`generated_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
