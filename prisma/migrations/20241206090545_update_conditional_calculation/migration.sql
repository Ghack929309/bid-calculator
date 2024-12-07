/*
  Warnings:

  - You are about to drop the column `comparison` on the `Calculation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logicId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "comparator" TEXT,
    "comparedValues" TEXT,
    "operations" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Calculation_logicId_fkey" FOREIGN KEY ("logicId") REFERENCES "LogicField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Calculation" ("createdAt", "id", "logicId", "operations", "type", "updatedAt") SELECT "createdAt", "id", "logicId", "operations", "type", "updatedAt" FROM "Calculation";
DROP TABLE "Calculation";
ALTER TABLE "new_Calculation" RENAME TO "Calculation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
