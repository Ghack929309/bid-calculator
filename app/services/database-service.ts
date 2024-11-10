import { PrismaClient } from "@prisma/client";
import {
  SimpleCalculationType,
  CalculationOperation,
  CalculationValue,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$connect();

    process.on("beforeExit", () => {
      this.prisma.$disconnect();
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Field Methods
  async createField(field: InputFieldType) {
    const { options, ...fieldData } = field;
    return this.prisma.field.create({
      data: {
        ...fieldData,
        options: options ? JSON.stringify(options) : undefined,
      },
    });
  }

  async createSection(section: string) {
    return this.prisma.section.create({
      data: { name: section },
    });
  }

  async updateField(field: InputFieldType) {
    const { options, ...fieldData } = field;
    return this.prisma.field.update({
      where: { id: field.id },
      data: {
        ...fieldData,
        options: options ? JSON.stringify(options) : undefined,
      },
    });
  }

  async getFields() {
    const fields = await this.prisma.field.findMany({});
    return fields.map((field) => ({
      ...field,
      options: field.options ? JSON.parse(field.options) : [],
    }));
  }

  async getFieldBySectionId(sectionId: string) {
    const fields = await this.prisma.field.findMany({
      where: { sectionId },
    });
    return fields.map((field) => ({
      ...field,
      options: field.options ? JSON.parse(field.options) : [],
    }));
  }

  async deleteField(id: string) {
    return this.prisma.field.delete({
      where: { id },
    });
  }

  // Logic Field Methods
  async createLogicField(field: LogicFieldType) {
    return this.prisma.logicField.create({
      data: {
        ...field,
      },
    });
  }

  async updateLogicField(field: LogicFieldType) {
    return this.prisma.logicField.update({
      where: { id: field.id },
      data: {
        ...field,
      },
    });
  }

  async getLogicFields(sectionId?: string) {
    if (!sectionId) return null;
    return this.prisma.logicField.findMany({
      where: {
        sectionId,
      },
    });
  }

  // Calculation Methods
  async createCalculation(calculation: SimpleCalculationType) {
    return this.prisma.calculation.create({
      data: {
        type: calculation.type,
        logicId: calculation.logicId,
        operations: JSON.stringify(
          calculation.operations.map((op) => this.mapOperation(op))
        ),
      },
    });
  }

  async getCalculationByLogicId(logicId: string) {
    const calculation = await this.prisma.calculation.findFirst({
      where: { logicId },
    });
    return {
      ...calculation,
      operations: JSON.parse(calculation?.operations || "[]").map((op: any) => {
        return {
          ...op,
          value1: op.value1,
          value2: op?.value2,
        };
      }),
    };
  }

  async updateCalculation(calculation: SimpleCalculationType) {
    return this.prisma.calculation.update({
      where: { id: calculation.id },
      data: this.mapCalculation(calculation),
    });
  }

  async deleteCalculation(id: string) {
    return this.prisma.calculation.delete({
      where: { id },
    });
  }

  async getCalculations() {
    const calculations = await this.prisma.calculation.findMany({});
    return calculations.map((calc) => ({
      ...calc,
      operations: JSON.parse(calc?.operations || "[]").map((op: any) => {
        return {
          ...op,
          value1: op.value1,
          value2: op?.value2,
        };
      }),
    }));
  }

  async getSections() {
    return this.prisma.section.findMany({});
  }

  // Helper methods
  private mapOperation(operation: CalculationOperation) {
    return {
      id: operation.id,
      operator: operation.operator,
      value1: operation.value1,
      value2: operation.value2,
    };
  }

  private mapCalculationValue(value: CalculationValue) {
    return {
      type: value.type,
      value: value.value,
      fieldId: value.type === "field" ? value.fieldId : undefined,
      logicId: value.type === "logic" ? value.fieldId : undefined,
    };
  }

  private mapCalculation(calculation: SimpleCalculationType) {
    return {
      type: calculation.type,
      logicId: calculation.logicId,
      operations: JSON.stringify(
        calculation.operations.map((op) => this.mapOperation(op))
      ),
    };
  }
}

export const db = DatabaseService.getInstance();
