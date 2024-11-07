/*
  Warnings:

  - A unique constraint covering the columns `[logicId]` on the table `Calculation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fieldId]` on the table `CalculationValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[logicId]` on the table `CalculationValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sectionId]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sectionId]` on the table `LogicField` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[calculationId]` on the table `Operation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fieldId]` on the table `Option` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calculation_logicId_key" ON "Calculation"("logicId");

-- CreateIndex
CREATE UNIQUE INDEX "CalculationValue_fieldId_key" ON "CalculationValue"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "CalculationValue_logicId_key" ON "CalculationValue"("logicId");

-- CreateIndex
CREATE UNIQUE INDEX "Field_sectionId_key" ON "Field"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "LogicField_sectionId_key" ON "LogicField"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_calculationId_key" ON "Operation"("calculationId");

-- CreateIndex
CREATE UNIQUE INDEX "Option_fieldId_key" ON "Option"("fieldId");
