/*
  Warnings:

  - Added the required column `address` to the `Party` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Party` ADD COLUMN `address` VARCHAR(191) NOT NULL;
