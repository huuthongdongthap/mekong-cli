import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'

export class SendMessageDto {
  @IsString()
  message: string

  @IsString()
  @Max(2000)
  @IsOptional()
  context?: string

  @IsUUID()
  @IsOptional()
  conversationId?: string
}

export class ChatQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20

  @IsUUID()
  @IsOptional()
  conversationId?: string
}
