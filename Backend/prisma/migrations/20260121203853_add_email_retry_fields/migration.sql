-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;
