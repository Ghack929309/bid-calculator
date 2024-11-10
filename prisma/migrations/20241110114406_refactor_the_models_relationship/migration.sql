-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "options" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "logicValues" TEXT,
    CONSTRAINT "Field_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("createdAt", "enabled", "id", "logicValues", "name", "options", "required", "sectionId", "type", "updatedAt") SELECT "createdAt", "enabled", "id", "logicValues", "name", "options", "required", "sectionId", "type", "updatedAt" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE TABLE "new_LogicField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "logicValues" TEXT,
    CONSTRAINT "LogicField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LogicField" ("createdAt", "id", "logicValues", "name", "sectionId", "updatedAt") SELECT "createdAt", "id", "logicValues", "name", "sectionId", "updatedAt" FROM "LogicField";
DROP TABLE "LogicField";
ALTER TABLE "new_LogicField" RENAME TO "LogicField";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
