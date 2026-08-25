import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { LearnerProfileService } from './learner-profile.service'
import { UpdateLearnerProfileDto } from './dto/create-learner-profile.dto'
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from './dto/work-experience.dto'
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto'

@Controller('learners')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LearnerProfileController {
  constructor(private readonly service: LearnerProfileService) {}

  // Profile endpoints
  @Get(':id/profile')
  async getProfile(@Param('id') learnerId: string) {
    return this.service.getProfile(learnerId)
  }

  @Put(':id/profile')
  async updateProfile(@Param('id') learnerId: string, @Body() dto: UpdateLearnerProfileDto) {
    return this.service.updateProfile(learnerId, dto)
  }

  @Get(':id/profile/public')
  async getPublicProfile(@Param('id') learnerId: string) {
    return this.service.getPublicProfile(learnerId)
  }

  // Work Experience endpoints
  @Post(':id/work-experiences')
  async addWorkExperience(@Param('id') learnerId: string, @Body() dto: CreateWorkExperienceDto) {
    return this.service.addWorkExperience(learnerId, dto)
  }

  @Put(':id/work-experiences/:experienceId')
  async updateWorkExperience(
    @Param('id') learnerId: string,
    @Param('experienceId') experienceId: string,
    @Body() dto: UpdateWorkExperienceDto
  ) {
    return this.service.updateWorkExperience(learnerId, experienceId, dto)
  }

  @Delete(':id/work-experiences/:experienceId')
  async deleteWorkExperience(
    @Param('id') learnerId: string,
    @Param('experienceId') experienceId: string
  ) {
    return this.service.deleteWorkExperience(learnerId, experienceId)
  }

  // Education endpoints
  @Post(':id/educations')
  async addEducation(@Param('id') learnerId: string, @Body() dto: CreateEducationDto) {
    return this.service.addEducation(learnerId, dto)
  }

  @Put(':id/educations/:educationId')
  async updateEducation(
    @Param('id') learnerId: string,
    @Param('educationId') educationId: string,
    @Body() dto: UpdateEducationDto
  ) {
    return this.service.updateEducation(learnerId, educationId, dto)
  }

  @Delete(':id/educations/:educationId')
  async deleteEducation(
    @Param('id') learnerId: string,
    @Param('educationId') educationId: string
  ) {
    return this.service.deleteEducation(learnerId, educationId)
  }
}