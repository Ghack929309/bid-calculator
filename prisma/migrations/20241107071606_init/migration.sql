-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    CONSTRAINT "Option_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogicField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" TEXT,
    "type" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "relatedField" TEXT,
    "relationType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logicId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "thenCalcId" TEXT,
    "elseCalcId" TEXT,
    CONSTRAINT "Calculation_logicId_fkey" FOREIGN KEY ("logicId") REFERENCES "LogicField" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Calculation_thenCalcId_fkey" FOREIGN KEY ("thenCalcId") REFERENCES "Calculation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Calculation_elseCalcId_fkey" FOREIGN KEY ("elseCalcId") REFERENCES "Calculation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator" TEXT NOT NULL,
    "calculationId" TEXT NOT NULL,
    "value1Id" TEXT NOT NULL,
    "value2Id" TEXT,
    CONSTRAINT "Operation_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "Calculation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operation_value1Id_fkey" FOREIGN KEY ("value1Id") REFERENCES "CalculationValue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operation_value2Id_fkey" FOREIGN KEY ("value2Id") REFERENCES "CalculationValue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalculationValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT,
    "fieldId" TEXT,
    "logicId" TEXT,
    CONSTRAINT "CalculationValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CalculationValue_logicId_fkey" FOREIGN KEY ("logicId") REFERENCES "LogicField" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "calculationId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "comparison" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "value2" TEXT,
    "logicalOperator" TEXT NOT NULL,
    CONSTRAINT "Condition_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "Calculation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Condition_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
