import { IsDateString, IsArray, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class UpdatePracticeRecordDto {
  @IsDateString()
  @IsOptional()
  practiceDate?: string

  @IsString()
  @IsOptional()
  activities?: string

  @IsNumber()
  @Min(0.5)
  @IsOptional()
  hoursWorked?: number

  @IsString()
  @IsOptional()
  supervisorName?: string

  @IsString()
  @IsOptional()
  supervisorSignatureUrl?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skillsDemonstrated?: string[]

  @IsString()
  @IsOptional()
  feedback?: string

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number
}
