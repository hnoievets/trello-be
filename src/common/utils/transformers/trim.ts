import { Transform } from 'class-transformer';

export function Trim(): PropertyDecorator {
  return Transform(({ value }) => {
    let result = value;

    if (typeof value === 'string') {
      result = value.trim();
    }

    if (Array.isArray(value)) {
      result = value.map(
        (item) => typeof value === 'string' ? item.trim() : value
      );
    }

    return result;
  });
}
