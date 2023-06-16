import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repository';
import { TaskFilterDto } from './dto';
import { TaskStatus } from '../common';
import { TaskPersistedEntity } from './entity';
import { UserPersistedEntity } from '../user/entities/user.persisted-entity';
import exp from 'constants';
import { query } from 'express';

const mockRepository = () => ({
  getTasks: jest.fn(),
  fetchTaskById: jest.fn(),
  findOne: jest.fn().mockImplementation((query) => {
    const { userId, id } = query.where;

    if (!userId || !id) {
      throw new Error('Invalid query');
    } else if (userId === mockTask.id && id === mockTask.id) {
      return mockTask;
    } else return null;
  }),
});

const mockUser = {
  email: 'ilochibuike@yahoo.com',
  id: 'someId',
};
let mockTask: Partial<TaskPersistedEntity> = {
  id: 'someId',
  title: 'Test task',
  description: 'Test desc',
  user: mockUser as unknown as UserPersistedEntity,
} as unknown as Partial<TaskPersistedEntity>;

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockRepository },
      ],
    }).compile();

    mockTask = { id: 'someId', title: 'Test task', description: 'Test desc' };

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const taskFilterDto: TaskFilterDto = {
        status: TaskStatus.DONE,
        search: 'Some search query',
      };

      const result = await tasksService.getTasks(mockUser, taskFilterDto);
      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual('someValue');
    });
  });

  describe(`getTaskById`, () => {
    it(`gets a task by id from the repository`, async () => {
      taskRepository.fetchTaskById.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(mockUser, mockTask.id);

      expect(taskRepository.fetchTaskById).toHaveBeenCalledWith(
        mockUser,
        mockTask.id,
      );
      expect(result).toEqual(mockTask);
    });

    it(`throws an error as task is not found`, () => {
      taskRepository.fetchTaskById.mockResolvedValue(null);

      expect(tasksService.getTaskById(mockUser, 2)).rejects.toThrow();
    });
  });
});
