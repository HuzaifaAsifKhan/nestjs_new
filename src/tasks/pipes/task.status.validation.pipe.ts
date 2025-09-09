import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly validStatuses = ['OPEN', 'IN_PROGRESS', 'DONE'];
  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();
    if (!this.validStatuses.includes(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }
}
