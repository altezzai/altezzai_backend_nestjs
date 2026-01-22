/*
  Warnings:

  - You are about to drop the column `is_active` on the `team` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `client` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `is_active`,
    DROP COLUMN `is_public`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isPublic` BOOLEAN NOT NULL DEFAULT true;
