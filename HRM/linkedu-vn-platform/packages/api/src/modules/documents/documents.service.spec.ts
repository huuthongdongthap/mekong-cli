import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { R2StorageService } from '../../common/r2-storage/r2-storage.service';
import { NotFoundException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: jest.Mocked<PrismaService>;
  let r2: jest.Mocked<R2StorageService>;

  const mockDocument = {
    id: 'doc-1',
    entityType: 'learner',
    entityId: 'learner-1',
    documentType: DocumentType.mou,
    filename: 'id-card.pdf',
    originalFilename: 'my-id.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    r2Bucket: 'linkededu-dev',
    r2Key: 'documents/learner/learner-1/id-card.pdf',
    r2Url: 'https://r2.example.com/id-card.pdf',
    uploadedById: 'user-1',
    sha256Hash: 'abc123',
    metadata: null,
  };

  const mockPrisma = {
    document: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  const mockR2 = {
    upload: jest.fn(),
    getSignedUrl: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<R2StorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: R2StorageService, useValue: mockR2 },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    r2 = module.get(R2StorageService) as jest.Mocked<R2StorageService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('uploads to R2 and creates document record', async () => {
      r2.upload.mockResolvedValue('https://r2.example.com/file.pdf');
      (prisma.document as any).create.mockResolvedValue(mockDocument);

      const buffer = Buffer.from('test');
      const result = await service.create(
        {
          entityType: 'learner',
          entityId: 'learner-1',
          documentType: DocumentType.mou,
          filename: 'id-card.pdf',
          originalFilename: 'my-id.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          uploadedById: 'user-1',
          sha256Hash: 'abc123',
        },
        buffer,
      );

      expect(r2.upload).toHaveBeenCalledWith(
        'documents/learner/learner-1/id-card.pdf',
        buffer,
        'application/pdf',
      );
      expect((prisma.document as any).create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entityType: 'learner',
          entityId: 'learner-1',
        }),
      });
      expect(result.id).toBe('doc-1');
    });
  });

  describe('findById', () => {
    it('returns document by id', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(mockDocument);
      const result = await service.findById('doc-1');
      expect(result?.id).toBe('doc-1');
    });

    it('returns null when not found', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(null);
      const result = await service.findById('missing');
      expect(result).toBeNull();
    });
  });

  describe('findByEntity', () => {
    it('returns documents for an entity', async () => {
      (prisma.document as any).findMany.mockResolvedValue([mockDocument]);
      const result = await service.findByEntity('learner', 'learner-1');
      expect(result).toHaveLength(1);
      expect((prisma.document as any).findMany).toHaveBeenCalledWith({
        where: { entityType: 'learner', entityId: 'learner-1' },
        orderBy: { uploadedAt: 'desc' },
      });
    });
  });

  describe('findByType', () => {
    it('filters by document type', async () => {
      (prisma.document as any).findMany.mockResolvedValue([mockDocument]);
      const result = await service.findByType('learner', 'learner-1', DocumentType.mou);
      expect(result).toHaveLength(1);
    });
  });

  describe('getSignedUrl', () => {
    it('returns signed URL for existing document', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(mockDocument);
      r2.getSignedUrl.mockResolvedValue('https://signed.example.com/file');
      const url = await service.getSignedUrl('doc-1');
      expect(url).toBe('https://signed.example.com/file');
      expect(r2.getSignedUrl).toHaveBeenCalledWith(mockDocument.r2Key, 3600);
    });

    it('throws NotFoundException for missing document', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(null);
      await expect(service.getSignedUrl('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deletes from R2 and database', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(mockDocument);
      r2.delete.mockResolvedValue(undefined);
      (prisma.document as any).delete.mockResolvedValue(undefined);
      await service.delete('doc-1');
      expect(r2.delete).toHaveBeenCalledWith(mockDocument.r2Key);
      expect((prisma.document as any).delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } });
    });

    it('throws NotFoundException for missing document', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(null);
      await expect(service.delete('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyHash', () => {
    it('returns true when hash matches', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(mockDocument);
      const crypto = require('crypto');
      const buffer = Buffer.from('test data');
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      const doc = { ...mockDocument, sha256Hash: hash };
      (prisma.document as any).findUnique.mockResolvedValue(doc);
      const result = await service.verifyHash('doc-1', buffer);
      expect(result).toBe(true);
    });

    it('returns false when hash does not match', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(mockDocument);
      const result = await service.verifyHash('doc-1', Buffer.from('wrong data'));
      expect(result).toBe(false);
    });

    it('throws NotFoundException for missing document', async () => {
      (prisma.document as any).findUnique.mockResolvedValue(null);
      await expect(service.verifyHash('missing', Buffer.from('test'))).rejects.toThrow(NotFoundException);
    });
  });
});
