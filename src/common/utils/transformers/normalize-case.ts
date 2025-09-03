import { Transform } from 'class-transformer';

export const CaseType = {
  UPPER: 'UPPER',
  LOWER: 'LOWER',
};

const normalizeCase = (value: string, caseType: keyof typeof CaseType) =>
  caseType === CaseType.LOWER ? value.toLowerCase() : value.toUpperCase();

export function NormalizeCase(
  caseType = CaseType.LOWER as keyof typeof CaseType,
): PropertyDecorator {
  return Transform(({ value }) => {
    let result = value;

    if (typeof value === 'string') {
      result = normalizeCase(value, caseType);
    }

    if (Array.isArray(value)) {
      result = value.map((item) =>
        typeof value === 'string' ? normalizeCase(item, caseType) : value,
      );
    }

    return result;
  });
}
