/*
  Warnings:

  - You are about to drop the `CalculationValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FieldOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `value1Id` on the `Operation` table. All the data in the column will be lost.
  - You are about to drop the column `value2Id` on the `Operation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN "logicValues" TEXT;
ALTER TABLE "Field" ADD COLUMN "options" TEXT;

-- AlterTable
ALTER TABLE "LogicField" ADD COLUMN "logicValues" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CalculationValue";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FieldOption";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator" TEXT NOT NULL,
    "calculationId" TEXT NOT NULL,
    "value1" TEXT NOT NULL DEFAULT '{}',
    "value2" TEXT DEFAULT '{}',
    CONSTRAINT "Operation_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "Calculation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Operation" ("calculationId", "id", "operator") SELECT "calculationId", "id", "operator" FROM "Operation";
DROP TABLE "Operation";
ALTER TABLE "new_Operation" RENAME TO "Operation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
