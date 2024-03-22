import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, IsArray, IsObject } from 'class-validator';
import { ColumnOptions, Column as TypeORMColumn } from 'typeorm';
interface ExtendsColumnOptions {
  nullable?: boolean;
  isRequired?: boolean;
}
const validationMapping = {
  String: [IsString],
  Number: [IsNumber],
  Boolean: [IsBoolean],
  Array: [IsArray],
  Object: [IsObject],
};
export function Column(options?: ColumnOptions & ExtendsColumnOptions): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const { nullable = false, isRequired = false, ...rest } = options || {};
    const fieldType = Reflect.getMetadata('design:type', target, propertyKey);
    const validators = validationMapping[fieldType.name] || [IsOptional];
    TypeORMColumn({ nullable, ...rest })(target, propertyKey);
    validators.forEach((validator) => {
      validator()(target, propertyKey);
    });
    if (isRequired) {
      IsNotEmpty()(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }
  };
}
