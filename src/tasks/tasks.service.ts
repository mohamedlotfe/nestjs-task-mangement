import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private tasksRepository: TaskRepository,
  ) {}
  
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    let task = await this.tasksRepository.findOne(id);
    if (!task) throw new NotFoundException(`No Task found with this id ${id}`);

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    let task = await this.getTaskById(id);
    task.status = status;

    await task.save();
    return task;
  }

  async deleteTask(id: number) {
    let foundTask = await this.getTaskById(id);
    await this.tasksRepository.delete(id);
    return;
  }
}
