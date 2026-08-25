import { IsDateString, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'

export class CreatePracticeRecordDto {
  @IsUUID()
  @IsNotEmpty()
  enrollmentId!: string

  @IsUUID()
  @IsNotEmpty()
  learnerId!: string

  @IsInt()
  @Min(1)
  enterpriseId!: number

  @IsDateString()
  practiceDate!: string

  @IsString()
  @IsNotEmpty()
  activities!: string

  @IsNumber()
  @Min(0.5)
  hoursWorked!: number

  @IsString()
  @IsNotEmpty()
  supervisorName!: string

  @IsArray()
  @IsString({ each: true })
  skillsDemonstrated!: string[]

  @IsString()
  @IsOptional()
  feedback?: string

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number

  @IsString()
  @IsNotEmpty()
  createdById!: string
}
