/*
  Warnings:

  - Added the required column `status` to the `WebWhatsapp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebWhatsapp" ADD COLUMN     "status" STRING NOT NULL;
