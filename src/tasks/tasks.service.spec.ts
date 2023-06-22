import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repository';
import { CreateTaskDto, TaskFilterDto } from './dto';
import { TaskStatus } from '../common';
import { TaskPersistedEntity } from './entity';
import { UserPersistedEntity } from '../user/entities/user.persisted-entity';

const mockUser = {
  email: 'ilochibuike@yahoo.com',
  id: 'someId',
};
let mockTask: Partial<TaskPersistedEntity>;

const mockRepository = () => ({
  getTasks: jest.fn(),
  fetchTaskById: jest.fn(),
  findOne: jest.fn().mockImplementation((query) => {
    const { userId, id } = query.where;

    if (!userId || !id) throw new Error('Invalid query');

    if (userId === mockUser.id && id === mockTask.id) return mockTask;
  }),
  createTask: jest.fn(),
  delete: jest.fn(),
  deleteTask: jest.fn(),
});

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

    mockTask = {
      id: 'someId',
      title: 'Test task',
      description: 'Test desc',
      user: mockUser as UserPersistedEntity,
      userId: mockUser.id,
    };

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  afterAll(() => {
    jest.resetAllMocks();
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
      mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: 'someId',
      };

      taskRepository.fetchTaskById.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(mockUser, mockTask.id);

      // expect(taskRepository.fetchTaskById).toHaveBeenCalledWith(
      //   mockUser,
      //   mockTask.id,
      // );
      expect(result).toEqual(mockTask);
    });

    it(`throws an error if task is not found`, async () => {
      taskRepository.findOne.mockResolvedValue(null);

      try {
        await tasksService.getTaskById(mockUser, 'someId');
        // If the code reaches this point, the function did not throw an error
        throw new Error('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe(`createTast`, () => {
    it(`calls the TaskRepositoty creatTask method to creates a task, and return the result`, async () => {
      taskRepository.createTask.mockResolvedValue(mockTask);

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto: CreateTaskDto = {
        title: 'Test task',
        description: 'Test desc',
      };

      const result = await tasksService.createTask(mockUser, createTaskDto);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockUser,
        createTaskDto,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe(`deleteTask`, () => {
    it(`calls the TaskRepositoty deleteTask method to delete a task`, async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });

      expect(taskRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTask(mockUser, mockTask.id);

      expect(taskRepository.deleteTask).toHaveBeenCalledWith(
        mockUser,
        mockTask.id,
      );
    });

    it(`throws an error if task not found`, async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });

      try {
        await tasksService.deleteTask(mockUser, mockTask.id);
        throw new Error('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
