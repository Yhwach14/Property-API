import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MaxPriceAfterMin(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxPriceAfterMin',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(maxPrice: number, args: ValidationArguments) {
          const obj = args.object as any;
          if (maxPrice === undefined || obj.minPrice === undefined) return true;
          return maxPrice >= obj.minPrice;
        },
        defaultMessage() {
          return 'maxPrice must be greater than or equal to minPrice';
        },
      },
    });
  };
}