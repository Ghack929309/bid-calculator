/*
  Warnings:

  - You are about to drop the `Condition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `elseCalcId` on the `Calculation` table. All the data in the column will be lost.
  - You are about to drop the column `thenCalcId` on the `Calculation` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `isRequired` on the `LogicField` table. All the data in the column will be lost.
  - You are about to drop the column `relatedField` on the `LogicField` table. All the data in the column will be lost.
  - You are about to drop the column `relationType` on the `LogicField` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LogicField` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `LogicField` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `LogicField` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Condition";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logicId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Calculation_logicId_fkey" FOREIGN KEY ("logicId") REFERENCES "LogicField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Calculation" ("createdAt", "id", "logicId", "type", "updatedAt") SELECT "createdAt", "id", "logicId", "type", "updatedAt" FROM "Calculation";
DROP TABLE "Calculation";
ALTER TABLE "new_Calculation" RENAME TO "Calculation";
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Field_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("createdAt", "enabled", "id", "name", "required", "type", "updatedAt") SELECT "createdAt", "enabled", "id", "name", "required", "type", "updatedAt" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE TABLE "new_LogicField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LogicField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LogicField" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "LogicField";
DROP TABLE "LogicField";
ALTER TABLE "new_LogicField" RENAME TO "LogicField";
CREATE TABLE "new_Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator" TEXT NOT NULL,
    "calculationId" TEXT NOT NULL,
    "value1Id" TEXT NOT NULL,
    "value2Id" TEXT,
    CONSTRAINT "Operation_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "Calculation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operation_value1Id_fkey" FOREIGN KEY ("value1Id") REFERENCES "CalculationValue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operation_value2Id_fkey" FOREIGN KEY ("value2Id") REFERENCES "CalculationValue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Operation" ("calculationId", "id", "operator", "value1Id", "value2Id") SELECT "calculationId", "id", "operator", "value1Id", "value2Id" FROM "Operation";
DROP TABLE "Operation";
ALTER TABLE "new_Operation" RENAME TO "Operation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
