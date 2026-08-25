import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto'
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from './dto/work-experience.dto'
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto'
import { ProfileVisibility, EnrollmentStatus } from '@prisma/client'

@Injectable()
export class LearnerProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(learnerId: string) {
    const profile = await this.prisma.learnerProfile.findUnique({
      where: { learnerId },
      include: {
        workExperiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
      },
    })

    if (!profile) {
      // Create empty profile if not exists
      return this.prisma.learnerProfile.create({
        data: {
          learnerId,
          visibility: ProfileVisibility.private,
        },
        include: {
          workExperiences: { orderBy: { startDate: 'desc' } },
          educations: { orderBy: { startDate: 'desc' } },
        },
      })
    }

    return profile
  }

  async updateProfile(learnerId: string, data: UpdateLearnerProfileDto) {
    const { workExperiences, educations, ...profileData } = data

    const profile = await this.prisma.learnerProfile.upsert({
      where: { learnerId },
      create: {
        learnerId,
        ...profileData,
      },
      update: profileData,
      include: {
        workExperiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
      },
    })

    // Handle work experiences if provided
    if (workExperiences) {
      await this.prisma.workExperience.deleteMany({
        where: { learnerProfileId: profile.id },
      })

      if (workExperiences.length > 0) {
        await this.prisma.workExperience.createMany({
          data: workExperiences.map((we) => ({
            companyName: we.companyName || 'Công ty',
            position: we.position || 'Vị trí',
            location: we.location,
            startDate: we.startDate ? new Date(we.startDate) : new Date(),
            endDate: we.endDate ? new Date(we.endDate) : null,
            isCurrent: we.isCurrent || false,
            description: we.description,
            skills: we.skills || [],
            learnerProfileId: profile.id,
            learnerId,
          })),
        })
      }
    }

    // Handle educations if provided
    if (educations) {
      await this.prisma.education.deleteMany({
        where: { learnerProfileId: profile.id },
      })

      if (educations.length > 0) {
        await this.prisma.education.createMany({
          data: educations.map((ed) => ({
            institution: ed.institution || 'Trường',
            degree: ed.degree || 'Bằng cấp',
            fieldOfStudy: ed.fieldOfStudy,
            location: ed.location,
            startDate: ed.startDate ? new Date(ed.startDate) : new Date(),
            endDate: ed.endDate ? new Date(ed.endDate) : null,
            isCurrent: ed.isCurrent || false,
            gpa: ed.gpa,
            description: ed.description,
            achievements: ed.achievements || [],
            learnerProfileId: profile.id,
            learnerId,
          })),
        })
      }
    }

    return this.getProfile(learnerId)
  }

  async getPublicProfile(learnerId: string) {
    const profile = await this.prisma.learnerProfile.findUnique({
      where: { learnerId },
      include: {
        workExperiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        learner: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarUrl: true, email: true },
            },
            school: { select: { name: true, code: true } },
            enrollments: {
              include: {
                program: { select: { name: true, field: true } },
              },
              where: { status: EnrollmentStatus.completed },
            },
          },
        },
      },
    })

    if (!profile || profile.visibility === ProfileVisibility.private) {
      return null
    }

    return profile
  }

  // Work Experience methods
  async addWorkExperience(learnerId: string, data: CreateWorkExperienceDto) {
    const profile = await this.getOrCreateProfile(learnerId)

    return this.prisma.workExperience.create({
      data: {
        companyName: data.companyName || 'Công ty',
        position: data.position || 'Vị trí',
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent || false,
        description: data.description,
        skills: data.skills || [],
        learnerProfileId: profile.id,
        learnerId,
      },
    })
  }

  async updateWorkExperience(learnerId: string, experienceId: string, data: UpdateWorkExperienceDto) {
    const profile = await this.getProfile(learnerId)
    const experience = await this.prisma.workExperience.findUnique({
      where: { id: experienceId },
    })

    if (!experience || experience.learnerProfileId !== profile.id) {
      throw new NotFoundException('Work experience not found')
    }

    return this.prisma.workExperience.update({
      where: { id: experienceId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    })
  }

  async deleteWorkExperience(learnerId: string, experienceId: string) {
    const profile = await this.getProfile(learnerId)
    const experience = await this.prisma.workExperience.findUnique({
      where: { id: experienceId },
    })

    if (!experience || experience.learnerProfileId !== profile.id) {
      throw new NotFoundException('Work experience not found')
    }

    return this.prisma.workExperience.delete({
      where: { id: experienceId },
    })
  }

  // Education methods
  async addEducation(learnerId: string, data: CreateEducationDto) {
    const profile = await this.getOrCreateProfile(learnerId)

    return this.prisma.education.create({
      data: {
        institution: data.institution || 'Trường',
        degree: data.degree || 'Bằng cấp',
        fieldOfStudy: data.fieldOfStudy,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent || false,
        gpa: data.gpa,
        description: data.description,
        achievements: data.achievements || [],
        learnerProfileId: profile.id,
        learnerId,
      },
    })
  }

  async updateEducation(learnerId: string, educationId: string, data: UpdateEducationDto) {
    const profile = await this.getProfile(learnerId)
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
    })

    if (!education || education.learnerProfileId !== profile.id) {
      throw new NotFoundException('Education not found')
    }

    return this.prisma.education.update({
      where: { id: educationId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    })
  }

  async deleteEducation(learnerId: string, educationId: string) {
    const profile = await this.getProfile(learnerId)
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
    })

    if (!education || education.learnerProfileId !== profile.id) {
      throw new NotFoundException('Education not found')
    }

    return this.prisma.education.delete({
      where: { id: educationId },
    })
  }

  private async getOrCreateProfile(learnerId: string) {
    let profile = await this.prisma.learnerProfile.findUnique({
      where: { learnerId },
    })

    if (!profile) {
      profile = await this.prisma.learnerProfile.create({
        data: { learnerId, visibility: ProfileVisibility.private },
      })
    }

    return profile
  }
}