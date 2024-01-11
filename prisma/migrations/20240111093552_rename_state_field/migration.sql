/*
  Warnings:

  - You are about to drop the column `confirmEmail` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `confirmEmail`,
    ADD COLUMN `state` ENUM('active', 'pending') NOT NULL DEFAULT 'pending';
