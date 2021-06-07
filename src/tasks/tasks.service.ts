import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private tasksRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    let task = await this.tasksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) throw new NotFoundException(`No Task found with this id ${id}`);

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    let task = await this.getTaskById(id, user);
    task.status = status;

    await task.save();
    return task;
  }

  async deleteTask(id: number, user: User) {
    let foundTask = await this.tasksRepository.delete({ id, userId: user.id });
    if (foundTask.affected === 0)
      throw new NotFoundException(`No Task found with this id ${id}`);
  }
}
