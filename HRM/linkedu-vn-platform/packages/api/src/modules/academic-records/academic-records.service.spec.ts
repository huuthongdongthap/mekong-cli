import { Test, TestingModule } from '@nestjs/testing';
import { AcademicRecordsService } from './academic-records.service';
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service';
import { DocumentsService } from '@linkedu/api/modules/documents/documents.service';
import { R2StorageService } from '@linkedu/api/common/r2-storage/r2-storage.service';
import { PdfGenerationService } from '@linkedu/api/common/pdf/pdf-generation.service';
import { NotFoundException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';


describe('AcademicRecordsService', () => {
  let service: AcademicRecordsService;
  let _prisma: jest.Mocked<PrismaService>;
  const mockLearnerId = '550e8400-e29b-41d4-a716-446655440000';

  const mockDocumentsService = { create: jest.fn().mockResolvedValue({ id: 'doc1' } as any), getSignedUrl: jest.fn().mockResolvedValue('https://signed.url/doc.pdf') };
  const mockR2Service = { upload: jest.fn().mockResolvedValue('https://r2.dev/doc.pdf') };
  const mockPdfService = { generateTranscript: jest.fn().mockResolvedValue(Buffer.from('pdf')) };

  const mockPrisma = {
    learner: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    academicRecord: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    document: {
      findFirst: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.learner.findUnique.mockResolvedValue({ id: mockLearnerId, fullName: 'Test', schoolId: 'school1' } as any);
    mockPrisma.learner.update.mockResolvedValue({} as any);
    mockPrisma.document.findFirst.mockResolvedValue(null);
    mockPrisma.academicRecord.upsert.mockResolvedValue({ id: 'ar1' } as any);
    mockPrisma.academicRecord.findMany.mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicRecordsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: DocumentsService, useValue: mockDocumentsService },
        { provide: R2StorageService, useValue: mockR2Service },
        { provide: PdfGenerationService, useValue: mockPdfService },
      ],
    }).compile();
    service = module.get<AcademicRecordsService>(AcademicRecordsService);
    _prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncAcademicRecords', () => {
    it('syncs records and returns success', async () => {
      mockPrisma.document.findFirst.mockResolvedValue(null);
      mockDocumentsService.create.mockResolvedValue({ id: 'doc1', entityId: mockLearnerId } as any);
      const result = await service.syncAcademicRecords({
        learnerId: mockLearnerId,
        semester: '2026-1',
        schoolId: 'school1',
        transcript: {
          learnerCode: 'ST001',
          learnerName: 'Test',
          fieldOfStudy: 'IT',
          cohort: '2026',
          gpa: 3.5,
          totalCredits: 60,
          academicStatus: 'Good',
          subjects: [],
        },
      } as any);
      expect(mockPrisma.learner.findUnique).toHaveBeenCalled();
      expect(mockPdfService.generateTranscript).toHaveBeenCalled();
      expect(mockR2Service.upload).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('getTranscript', () => {
    it('returns transcript when document exists', async () => {
      mockPrisma.document.findFirst.mockResolvedValue({
        id: 'doc1', entityId: mockLearnerId, documentType: DocumentType.transcript,
      } as any);
      mockDocumentsService.getSignedUrl.mockResolvedValue('https://signed.url/doc.pdf');
      const result = await service.getTranscript(mockLearnerId);
      expect(mockPrisma.document.findFirst).toHaveBeenCalledWith({
        where: { entityType: 'Learner', entityId: mockLearnerId, documentType: DocumentType.transcript },
        orderBy: { uploadedAt: 'desc' },
      });
      expect(result.document.id).toBe('doc1');
      expect(result.downloadUrl).toBe('https://signed.url/doc.pdf');
    });

    it('throws NotFoundException when no transcript', async () => {
      mockPrisma.document.findFirst.mockResolvedValue(null);
      await expect(service.getTranscript(mockLearnerId)).rejects.toThrow(NotFoundException);
    });
  });
});
