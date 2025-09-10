f-- Remove description column from categories table
-- This migration removes the description field from categories to avoid confusion with transaction descriptions

-- DropColumn
ALTER TABLE "categories" DROP COLUMN "description";
