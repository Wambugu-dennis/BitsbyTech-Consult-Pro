# Database Schema

This directory contains the SQL schema for the Consult Vista application.

## `schema.sql`

This file contains the `CREATE TABLE` statements for all the tables in the database. It is designed for a MySQL database.

### How to Use

1.  Make sure you have a MySQL server running.
2.  Create a new database, ideally named `ConsultVista`.
3.  Run the `schema.sql` script against your new new database to create all the necessary tables and relationships.

Example command:
```sh
mysql -u your_user -p ConsultVista < schema.sql
```

This will set up the empty relational structure required for the application's backend.

## File & Document Storage Strategy

This application follows a modern architecture for file storage to ensure scalability and performance.

**DO NOT store files (e.g., PDFs, images, documents) directly in the database.**

Instead, the system is designed to use a dedicated **Cloud Object Storage service** (such as Google Cloud Storage, AWS S3, or similar).

### Workflow:

1.  **Upload via Backend:** When a user uploads a file (e.g., an expense receipt, a project document), the application's backend handles the secure upload process directly to the configured cloud storage bucket.
2.  **Store Reference in Database:** The cloud storage service returns a unique URL or path for the uploaded object.
3.  **`attachments` Table:** This URL/path is then stored in the `attachments` table in our database, along with relevant metadata like `file_name`, `file_type`, `file_size`, `uploaded_by_user_id`, and `created_at`.
4.  **Polymorphic Association:** The `attachments` table uses a polymorphic design with `related_entity_type` (e.g., 'project', 'expense') and `related_entity_id` columns. This allows a single `attachments` table to serve the entire application, linking files to any other table as needed.
5.  **Retrieval:** When a user needs to access a file, the application retrieves the URL from the database and provides it to the user for download, typically as a secure, time-limited link.
