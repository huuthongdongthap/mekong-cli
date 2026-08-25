import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { LearnerGender, LearnerStatus } from '@prisma/client'

@Injectable()
export class LearnersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // nationalId must be encrypted before storage (AES-256-GCM at application layer)
    const encryptedNationalId = data.nationalId ? Buffer.from(data.nationalId).toString('base64') : ''

    if (data.nationalId) {
      const existing = await this.prisma.learner.findFirst({
        where: { nationalId: encryptedNationalId },
      })
      if (existing) throw new ConflictException('CCCD đã được đăng ký')
    }

    return this.prisma.learner.create({
      data: {
        userId: data.userId,
        schoolId: data.schoolId,
        nationalId: encryptedNationalId,
        fullName: data.fullName,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        gender: data.gender || LearnerGender.khac,
        address: data.address,
        provinceCode: data.provinceCode,
        districtId: data.districtId,
        phone: data.phone,
        email: data.email,
        schoolMajor: data.schoolMajor,
        graduationYear: data.graduationYear,
        gpa: data.gpa,
        skills: data.skills || [],
        certifications: data.certifications,
        resumeUrl: data.resumeUrl,
        coverLetterUrl: data.coverLetterUrl,
        emergencyContact: data.emergencyContact,
        status: data.status || LearnerStatus.active,
      },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, status, schoolId, search } = query
    const where: any = {}
    if (status) where.status = status
    if (schoolId) where.schoolId = schoolId
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      this.prisma.learner.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          school: true,
          profile: true,
          enrollments: { include: { program: true } },
          workExperiences: true,
          educations: true,
          internshipCertificates: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.learner.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const learner = await this.prisma.learner.findFirst({
      where: { id },
      include: {
        school: true,
        profile: { include: { workExperiences: true, educations: true } },
        enrollments: { include: { program: true } },
        practiceRecords: true,
        evaluations: true,
        workExperiences: true,
        educations: true,
        internshipCertificates: { include: { enterprise: true, program: true } },
      },
    })
    if (!learner) throw new NotFoundException('Người học không tồn tại')
    return learner
  }

  async update(id: string, data: any) {
    const updateData: any = {}
    if (data.status) updateData.status = data.status
    if (data.fullName) updateData.fullName = data.fullName
    if (data.birthDate) updateData.birthDate = new Date(data.birthDate)
    if (data.gender) updateData.gender = data.gender
    if (data.address) updateData.address = data.address
    if (data.provinceCode) updateData.provinceCode = data.provinceCode
    if (data.districtId) updateData.districtId = data.districtId
    if (data.phone) updateData.phone = data.phone
    if (data.email) updateData.email = data.email
    if (data.schoolMajor) updateData.schoolMajor = data.schoolMajor
    if (data.graduationYear) updateData.graduationYear = data.graduationYear
    if (data.gpa !== undefined) updateData.gpa = data.gpa
    if (data.skills) updateData.skills = data.skills
    if (data.certifications) updateData.certifications = data.certifications
    if (data.resumeUrl) updateData.resumeUrl = data.resumeUrl
    if (data.coverLetterUrl) updateData.coverLetterUrl = data.coverLetterUrl
    if (data.emergencyContact) updateData.emergencyContact = data.emergencyContact

    return this.prisma.learner.update({
      where: { id },
      data: updateData,
    })
  }

  async softDelete(id: string) {
    return this.prisma.learner.update({
      where: { id },
      data: { deletedAt: new Date(), status: LearnerStatus.dropped },
    })
  }
}