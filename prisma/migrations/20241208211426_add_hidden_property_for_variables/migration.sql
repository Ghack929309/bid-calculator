-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "baseFieldId" TEXT,
    "options" TEXT,
    "entries" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "logicValues" TEXT,
    CONSTRAINT "Field_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("baseFieldId", "createdAt", "enabled", "entries", "id", "logicValues", "name", "options", "required", "sectionId", "type", "updatedAt") SELECT "baseFieldId", "createdAt", "enabled", "entries", "id", "logicValues", "name", "options", "required", "sectionId", "type", "updatedAt" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
