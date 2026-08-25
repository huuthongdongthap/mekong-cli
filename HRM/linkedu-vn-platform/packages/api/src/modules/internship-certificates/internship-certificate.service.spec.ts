import { Test, TestingModule } from '@nestjs/testing';
import { InternshipCertificateService } from './internship-certificate.service';
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CertificateStatus } from '@prisma/client';
import { QrCodeService } from '@linkedu/api/common/qr-code/qr-code.service';
import { PdfGenerationService } from '@linkedu/api/common/pdf/pdf-generation.service';
import { R2StorageService } from '@linkedu/api/common/r2-storage/r2-storage.service';

describe('InternshipCertificateService', () => {
  let service: InternshipCertificateService;
  let prisma: jest.Mocked<PrismaService>;

  const certId = 'cert1';
  const mockLearnerId = '550e8400-e29b-41d4-a716-446655440000';

  const mockQrService = { generate: jest.fn() };
  const mockPdfService = { generateCertificate: jest.fn() };
  const mockR2Service = { upload: jest.fn() };

  const mockPrisma = {
    internshipCertificate: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  const freshDraftCert = () => ({ id: certId, status: CertificateStatus.draft, certificateNumber: 'CERT/2026/00001' } as any);
  const _freshIssuedCert = () => ({ ...freshDraftCert(), status: CertificateStatus.issued } as any);

  beforeEach(async () => {
    jest.resetAllMocks();
    mockQrService.generate.mockResolvedValue(Buffer.from('qr') as any);
    mockPdfService.generateCertificate.mockResolvedValue(Buffer.from('pdf') as any);
    mockR2Service.upload.mockResolvedValue('https://r2.dev/file.png');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternshipCertificateService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: QrCodeService, useValue: mockQrService },
        { provide: PdfGenerationService, useValue: mockPdfService },
        { provide: R2StorageService, useValue: mockR2Service },
      ],
    }).compile();
    service = module.get<InternshipCertificateService>(InternshipCertificateService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCertificate', () => {
    it('creates a draft certificate', async () => {
      prisma.internshipCertificate.create.mockResolvedValue({
        id: certId, learnerId: mockLearnerId, status: CertificateStatus.draft,
      } as any);
      const result = await service.createCertificate({
        learnerId: mockLearnerId, programId: 'p1', issuedById: 'admin1',
        issueDate: '2026-01-01', startDate: '2026-01-01', endDate: '2026-06-01',
      });
      expect(prisma.internshipCertificate.create).toHaveBeenCalled();
      expect(result.status).toBe(CertificateStatus.draft);
    });
  });

  describe('issueCertificate', () => {
    it('issues certificate with QR and PDF', async () => {
      const cert = {
        id: certId, status: CertificateStatus.draft, certificateNumber: 'CERT/2026/00001',
        learner: { fullName: 'Nguyen Van A' },
        enterprise: { name: 'TechCorp', taxCode: '0123456789' },
        program: { name: 'Java Internship', field: 'IT', qualificationLevel: 'Intermediate' },
      };
      prisma.internshipCertificate.findUnique.mockResolvedValue(cert as any);
      prisma.internshipCertificate.update.mockResolvedValue({ ...cert, status: CertificateStatus.issued } as any);

      const result = await service.issueCertificate(certId, { issuedById: 'admin1' });

      expect(prisma.internshipCertificate.findUnique).toHaveBeenCalledWith({
        where: { id: certId },
        include: expect.any(Object),
      });
      expect(mockQrService.generate).toHaveBeenCalled();
      expect(mockR2Service.upload).toHaveBeenCalledTimes(2);
      expect(mockPdfService.generateCertificate).toHaveBeenCalled();
      expect(prisma.internshipCertificate.update).toHaveBeenCalledWith({
        where: { id: certId },
        data: expect.objectContaining({ status: CertificateStatus.issued }),
      });
      expect(result.status).toBe(CertificateStatus.issued);
    });

    it('throws NotFoundException for nonexistent cert', async () => {
      prisma.internshipCertificate.findUnique.mockResolvedValue(null);
      await expect(service.issueCertificate('nonexistent', { issuedById: 'admin1' }))
        .rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for already issued cert', async () => {
      prisma.internshipCertificate.findUnique.mockResolvedValue({
        ...certId, status: CertificateStatus.issued,
      } as any);
      await expect(service.issueCertificate(certId, { issuedById: 'admin1' }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('revokeCertificate', () => {
    it('revokes issued certificate', async () => {
      const cert = { id: certId, status: CertificateStatus.issued };
      prisma.internshipCertificate.findUnique.mockResolvedValue(cert as any);
      prisma.internshipCertificate.update.mockResolvedValue({ ...cert, status: CertificateStatus.revoked } as any);
      const result = await service.revokeCertificate(certId, 'admin1', 'Fraud');
      expect(result.status).toBe(CertificateStatus.revoked);
      expect(prisma.internshipCertificate.update).toHaveBeenCalledWith({
        where: { id: certId },
        data: expect.objectContaining({ status: CertificateStatus.revoked, revokedById: 'admin1' }),
      });
    });

  it('rejects revoking already revoked certificate', async () => {
    prisma.internshipCertificate.findUnique.mockResolvedValue({
      id: certId, status: CertificateStatus.revoked,
    } as any);
    await expect(service.revokeCertificate(certId, 'admin1')).rejects.toThrow(BadRequestException);
  });
  });

  describe('verifyCertificate', () => {
    it('returns valid cert info', async () => {
      const cert = {
        certificateNumber: 'CERT/2026/00001', status: CertificateStatus.issued,
        learner: { fullName: 'Nguyen Van A', id: mockLearnerId },
        enterprise: { name: 'TechCorp', taxCode: '0123456789' },
        program: { name: 'Java Internship', field: 'IT', qualificationLevel: 'Intermediate' },
      };
      prisma.internshipCertificate.findUnique.mockResolvedValue(cert as any);
      const result = await service.verifyCertificate('CERT/2026/00001');
      expect(result.valid).toBe(true);
      expect(result.certificate.learnerName).toBe('Nguyen Van A');
    });

    it('returns invalid for nonexistent cert', async () => {
      prisma.internshipCertificate.findUnique.mockResolvedValue(null);
      const result = await service.verifyCertificate('BAD');
      expect(result.valid).toBe(false);
    });
  });

  describe('getCertificatesByLearner', () => {
    it('lists certificates with includes', async () => {
      prisma.internshipCertificate.findMany.mockResolvedValue([
        { id: 'c1', learnerId: mockLearnerId, certificateNumber: 'CERT/2026/00001' },
      ] as any);
      const result = await service.getCertificatesByLearner(mockLearnerId);
      expect(prisma.internshipCertificate.findMany).toHaveBeenCalledWith({
        where: { learnerId: mockLearnerId },
        include: expect.any(Object),
        orderBy: { issueDate: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getCertificateById', () => {
    it('returns cert with full includes', async () => {
      const cert = { id: certId, certificateNumber: 'CERT/2026/00001' } as any;
      prisma.internshipCertificate.findUnique.mockResolvedValue(cert);
      const result = await service.getCertificateById(certId);
      expect(prisma.internshipCertificate.findUnique).toHaveBeenCalledWith({
        where: { id: certId },
        include: expect.any(Object),
      });
      expect(result).toEqual(cert);
    });

    it('throws NotFoundException for missing cert', async () => {
      prisma.internshipCertificate.findUnique.mockResolvedValue(null);
      await expect(service.getCertificateById('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
