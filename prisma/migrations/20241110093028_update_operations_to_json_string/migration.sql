/*
  Warnings:

  - You are about to drop the `Operation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Operation";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logicId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "operations" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Calculation_logicId_fkey" FOREIGN KEY ("logicId") REFERENCES "LogicField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Calculation" ("createdAt", "id", "logicId", "type", "updatedAt") SELECT "createdAt", "id", "logicId", "type", "updatedAt" FROM "Calculation";
DROP TABLE "Calculation";
ALTER TABLE "new_Calculation" RENAME TO "Calculation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
