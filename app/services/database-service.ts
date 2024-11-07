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
  async createField(field: InputFieldType, sectionId: string) {
    const { options, ...fieldData } = field;
    return this.prisma.field.create({
      data: {
        ...fieldData,
        section: {
          connect: { id: sectionId },
        },
        options: {
          create: options?.map((opt: string) => ({ value: opt })) || [],
        },
      },
      include: {
        options: true,
      },
    });
  }

  async createSection(section: string) {
    return this.prisma.section.create({
      data: { name: section },
    });
  }

  async updateField(field: InputFieldType) {
    const { options, section, ...fieldData } = field;
    return this.prisma.field.update({
      where: { id: field.id },
      data: {
        ...fieldData,
        section: {
          connect: { id: section },
        },
        options: {
          create: options?.map((opt: string) => ({ value: opt })) || [],
        },
      },
    });
  }

  async getFields(sectionId?: string) {
    if (!sectionId) return null;
    return this.prisma.field.findMany({
      where: {
        sectionId,
      },
      include: {
        options: true,
      },
    });
  }

  // Logic Field Methods
  async createLogicField(field: LogicFieldType) {
    return this.prisma.logicField.create({
      data: {
        ...field,
        section: {
          connect: { id: field.section },
        },
      },
    });
  }

  async updateLogicField(field: LogicFieldType) {
    return this.prisma.logicField.update({
      where: { id: field.id },
      data: {
        ...field,
        section: {
          connect: { id: field.section },
        },
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
        operations: {
          create: calculation.operations.map((op) => this.mapOperation(op)),
        },
      },
      include: {
        operations: {
          include: {
            value1: true,
            value2: true,
          },
        },
      },
    });
  }

  async getCalculationByLogicId(logicId: string) {
    return this.prisma.calculation.findFirst({
      where: { logicId },
      include: {
        operations: {
          include: {
            value1: true,
            value2: true,
          },
        },
      },
    });
  }

  async updateCalculation(calculation: SimpleCalculationType) {
    return this.prisma.calculation.update({
      where: { id: calculation.id },
      data: this.mapCalculation(calculation),
    });
  }

  async getCalculations() {
    return this.prisma.calculation.findMany({
      include: {
        operations: {
          include: {
            value1: true,
            value2: true,
          },
        },
      },
    });
  }

  async getSections() {
    return this.prisma.section.findMany({});
  }

  // Helper methods
  private mapOperation(operation: CalculationOperation) {
    return {
      operator: operation.operator,
      value1: {
        create: this.mapCalculationValue(operation.value1),
      },
      value2: operation.value2
        ? {
            create: this.mapCalculationValue(operation.value2),
          }
        : undefined,
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
      operations: {
        create: calculation.operations.map((op) => this.mapOperation(op)),
      },
    };
  }
}

export const db = DatabaseService.getInstance();
