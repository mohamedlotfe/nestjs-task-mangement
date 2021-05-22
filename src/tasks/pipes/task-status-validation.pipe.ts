import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValidStatus(value.toUpperCase())) {
      throw new BadRequestException(`${value} is not a valid status`);
    }
    return value;
  }
  private isValidStatus(status: any) {
    return this.allowedStatus.indexOf(status) !== -1;
  }
}
