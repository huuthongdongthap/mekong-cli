import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service';

// Mock OpenAI constructor
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

const createMockPrisma = () => ({
  chatMessage: {
    createMany: jest.fn().mockResolvedValue({ count: 2 }),
    count: jest.fn().mockResolvedValue(0),
    findMany: jest.fn().mockResolvedValue([]),
  },
});

describe('ChatService', () => {
  let service: ChatService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.OPENAI_BASE_URL = 'https://test.api.com';
    mockPrisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_BASE_URL;
    delete process.env.CHATBOT_MODEL;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('returns AI reply on successful completion', async () => {
      const { OpenAI } = require('openai');
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Hello from AI' } }],
        model: 'gpt-4o-mini',
      });
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockCreate } },
      }));

      // Re-create service so it picks up the mock
      service = new ChatService(mockPrisma as unknown as PrismaService);
      const result = await service.sendMessage('Hi there', {
        userId: '11111111-1111-1111-1111-111111111111',
      });

      expect(result.reply).toBe('Hello from AI');
      expect(result.model).toBe('gpt-4o-mini');
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          max_tokens: 500,
        }),
      );
    });

    it('persists both user and assistant messages', async () => {
      const { OpenAI } = require('openai');
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'Chào bạn' } }],
              model: 'gpt-4o-mini',
            }),
          },
        },
      }));

      service = new ChatService(mockPrisma as unknown as PrismaService);
      const userId = '22222222-2222-2222-2222-222222222222';
      const result = await service.sendMessage('Xin chào', { userId });

      expect(mockPrisma.chatMessage.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({ userId, role: 'user', content: 'Xin chào' }),
          expect.objectContaining({ userId, role: 'assistant', content: 'Chào bạn' }),
        ],
      });
      expect(result.conversationId).toBeDefined();
    });

    it('reuses the provided conversationId', async () => {
      const { OpenAI } = require('openai');
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'OK' } }],
              model: 'gpt-4o-mini',
            }),
          },
        },
      }));

      service = new ChatService(mockPrisma as unknown as PrismaService);
      const conversationId = '33333333-3333-3333-3333-333333333333';
      const result = await service.sendMessage('Test', {
        userId: '22222222-2222-2222-2222-222222222222',
        conversationId,
      });

      expect(result.conversationId).toBe(conversationId);
      expect(mockPrisma.chatMessage.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ conversationId }),
        ]),
      });
    });

    it('still returns the reply when persistence fails', async () => {
      const { OpenAI } = require('openai');
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'Reply' } }],
              model: 'gpt-4o-mini',
            }),
          },
        },
      }));
      mockPrisma.chatMessage.createMany.mockRejectedValue(new Error('DB down'));

      service = new ChatService(mockPrisma as unknown as PrismaService);
      const result = await service.sendMessage('Test', {
        userId: '22222222-2222-2222-2222-222222222222',
      });

      expect(result.reply).toBe('Reply');
    });

    it('returns fallback reply when API returns empty content', async () => {
      const { OpenAI } = require('openai');
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: null } }],
        model: 'gpt-4o-mini',
      });
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockCreate } },
      }));

      service = new ChatService(mockPrisma as unknown as PrismaService);
      const result = await service.sendMessage('Test', {
        userId: '22222222-2222-2222-2222-222222222222',
      });

      expect(result.reply).toBe('Xin lỗi, tôi không thể trả lời câu hỏi này.');
    });

    it('returns error fallback on API failure', async () => {
      const { OpenAI } = require('openai');
      const mockCreate = jest.fn().mockRejectedValue(new Error('API down'));
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockCreate } },
      }));
      process.env.CHATBOT_MODEL = 'gpt-4';

      service = new ChatService(mockPrisma as unknown as PrismaService);
      const result = await service.sendMessage('Test', {
        userId: '22222222-2222-2222-2222-222222222222',
      });

      expect(result.reply).toBe(
        'Dịch vụ AI đang bận. Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.',
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gpt-4' }),
      );
    });
  });

  describe('getHistory', () => {
    const userId = '44444444-4444-4444-4444-444444444444';

    it('returns paginated messages for the user', async () => {
      const rows = [
        { id: 'b', role: 'assistant', content: 'Hi', createdAt: new Date('2026-08-24T10:01:00Z') },
        { id: 'a', role: 'user', content: 'Hello', createdAt: new Date('2026-08-24T10:00:00Z') },
      ];
      mockPrisma.chatMessage.count.mockResolvedValue(2);
      mockPrisma.chatMessage.findMany.mockResolvedValue(rows);

      const result = await service.getHistory(userId, { page: 1, limit: 20 });

      expect(mockPrisma.chatMessage.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockPrisma.chatMessage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 20,
        }),
      );
      // Reversed to chronological order for rendering
      expect(result.messages[0].id).toBe('a');
      expect(result.messages[1].id).toBe('b');
      expect(result.pagination).toEqual({ page: 1, limit: 20, total: 2 });
    });

    it('filters by conversationId and applies pagination offsets', async () => {
      mockPrisma.chatMessage.count.mockResolvedValue(0);
      mockPrisma.chatMessage.findMany.mockResolvedValue([]);
      const conversationId = '55555555-5555-5555-5555-555555555555';

      const result = await service.getHistory(userId, {
        page: 2,
        limit: 10,
        conversationId,
      });

      expect(mockPrisma.chatMessage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, conversationId },
          skip: 10,
          take: 10,
        }),
      );
      expect(result.messages).toEqual([]);
      expect(result.pagination).toEqual({ page: 2, limit: 10, total: 0 });
    });
  });
});