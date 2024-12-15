import { PrismaClient } from "@prisma/client";
import { userRequestSchema } from "~/lib/schema";
import {
  SimpleCalculationType,
  CalculationOperation,
  InputFieldType,
  LogicFieldType,
  ConditionalCalculationType,
  CalculationType,
} from "~/lib/types";
import { z } from "zod";

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

  async toggleSectionVisibility({
    sectionId,
    isPublished,
  }: {
    sectionId: string;
    isPublished: boolean;
  }) {
    return this.prisma.section.update({
      where: { id: sectionId },
      data: { isPublished: !isPublished },
    });
  }

  // Field Methods
  async createField(field: InputFieldType) {
    const { options, entries, ...fieldData } = field;
    return this.prisma.field.create({
      data: {
        ...fieldData,
        entries: entries ? JSON.stringify(entries) : undefined,
        options: options ? JSON.stringify(options) : undefined,
      },
    });
  }

  async getFieldsAndSections() {
    return await this.prisma.section.findMany({
      where: { isPublished: true },
      include: {
        fields: {
          where: { enabled: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async createSection(section: string) {
    return this.prisma.section.create({
      data: { name: section },
    });
  }
  async deleteSection(sectionId: string) {
    return this.prisma.section.delete({
      where: { id: sectionId },
    });
  }

  async updateField(field: InputFieldType) {
    const { options, entries, ...fieldData } = field;
    return this.prisma.field.update({
      where: { id: field.id },
      data: {
        ...fieldData,
        options: options ? JSON.stringify(options) : undefined,
        entries: entries ? JSON.stringify(entries) : undefined,
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

  async createMilesVariableField(field: InputFieldType) {
    const { entries, options, ...fieldData } = field;
    return this.prisma.field.create({
      data: {
        ...fieldData,
        isHidden: true,
        options: options ? JSON.stringify(options) : undefined,
        entries: JSON.stringify(entries),
      },
    });
  }

  async updateMilesVariableField(field: InputFieldType) {
    console.log("field from db service", field);
    const { entries, options, ...fieldData } = field;
    return this.prisma.field.update({
      where: { id: field.id },
      data: {
        ...fieldData,
        options: options ? JSON.stringify(options) : undefined,
        entries: JSON.stringify(entries),
      },
    });
  }

  async deleteMilesVariableField(id: string) {
    console.log("delete miles variable field", id);
    return this.prisma.field.delete({
      where: { id },
    });
  }

  async createPriceRangeVariableField(field: InputFieldType) {
    console.log("price range field from db service", field);
    const { entries, options, ...fieldData } = field;
    return this.prisma.field.create({
      data: {
        ...fieldData,
        isHidden: true,
        options: options ? JSON.stringify(options) : undefined,
        entries: JSON.stringify(entries),
      },
    });
  }

  async updatePriceRangeVariableField(field: InputFieldType) {
    const { entries, options, ...fieldData } = field;
    return this.prisma.field.update({
      where: { id: field.id },
      data: {
        ...fieldData,
        options: options ? JSON.stringify(options) : undefined,
        entries: JSON.stringify(entries),
      },
    });
  }

  async deletePriceRangeVariableField(id: string) {
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
  async createCalculation(
    calculation: SimpleCalculationType | ConditionalCalculationType
  ) {
    const logicField = await this.prisma.logicField.findUnique({
      where: { id: calculation.logicId },
    });
    console.log("logic field", logicField);
    if (!logicField) {
      throw new Error(`LogicField with id ${calculation.logicId} not found`);
    }
    return this.prisma.calculation.create({
      data:
        calculation.type === CalculationType.SIMPLE
          ? this.mapSimpleCalculation(calculation)
          : this.mapConditionalCalculation(calculation),
    });
  }

  async getCalculationByLogicId(logicId: string) {
    const calculation = await this.prisma.calculation.findFirst({
      where: { logicId },
    });

    if (!calculation) return null;

    const parsedOperations = JSON.parse(calculation?.operations || "[]");

    if (calculation.type === CalculationType.CONDITIONAL) {
      return {
        ...calculation,
        operations: {
          then: parsedOperations.then?.map((op: CalculationOperation) => ({
            ...op,
            value1: op.value1,
            value2: op?.value2,
          })),
          else: parsedOperations.else?.map((op: CalculationOperation) => ({
            ...op,
            value1: op.value1,
            value2: op?.value2,
          })),
        },
      };
    }

    return {
      ...calculation,
      operations: parsedOperations.map((op: CalculationOperation) => ({
        ...op,
        value1: op.value1,
        value2: op?.value2,
      })),
    };
  }

  async updateCalculation(
    calculation: SimpleCalculationType | ConditionalCalculationType
  ) {
    return this.prisma.calculation.update({
      where: { id: calculation.id },
      data:
        calculation.type === CalculationType.SIMPLE
          ? this.mapSimpleCalculation(calculation)
          : this.mapConditionalCalculation(calculation),
    });
  }

  async deleteCalculation(id: string) {
    return this.prisma.calculation.delete({
      where: { id },
    });
  }

  async getCalculations() {
    const calculations = await this.prisma.calculation.findMany({});
    return calculations.map((calc) => {
      const parsedOperations = JSON.parse(calc?.operations || "[]");

      if (calc.type === CalculationType.CONDITIONAL) {
        return {
          ...calc,
          comparedValues: JSON.parse(calc?.comparedValues || "{}"),
          operations: {
            then: parsedOperations.then?.map((op: CalculationOperation) => ({
              ...op,
              value1: op.value1,
              value2: op?.value2,
            })),
            else: parsedOperations.else?.map((op: CalculationOperation) => ({
              ...op,
              value1: op.value1,
              value2: op?.value2,
            })),
          },
        };
      }

      return {
        ...calc,
        operations: parsedOperations.map((op: CalculationOperation) => ({
          ...op,
          value1: op.value1,
          value2: op?.value2,
        })),
      };
    });
  }

  async getSections() {
    return this.prisma.section.findMany({});
  }

  async getSectionById(sectionId: string) {
    return this.prisma.section.findFirst({
      where: { id: sectionId },
    });
  }

  async deleteLogicField(id: string) {
    return this.prisma.logicField.delete({
      where: { id },
    });
  }

  // Helper methods

  private mapConditionalCalculation(calculation: ConditionalCalculationType) {
    const mapped = {
      type: calculation.type,
      logicId: calculation.logicId,
      comparator: calculation.comparator,
      comparedValues: JSON.stringify(calculation.comparedValues),
      operations: JSON.stringify(calculation.operations),
    };
    console.log("mapped", mapped);
    return mapped;
  }

  private mapSimpleCalculation(calculation: SimpleCalculationType) {
    return {
      type: calculation.type,
      logicId: calculation.logicId,
      operations: JSON.stringify(calculation.operations),
    };
  }

  async createUserRequest(userRequest: z.infer<typeof userRequestSchema>) {
    try {
      const validatedUserRequest = userRequestSchema.parse(userRequest);
      const response = await this.prisma.userRequest.create({
        data: {
          ...validatedUserRequest,
          fields: JSON.stringify(validatedUserRequest.fields),
        },
      });
      console.log("response", response);
      return { error: false };
    } catch (error) {
      console.error("Error creating user request", error);
      return { error: true, message: "Error creating user request" };
    }
  }

  async getUserRequests() {
    return this.prisma.userRequest.findMany({});
  }
}

export const db = DatabaseService.getInstance();
