import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsBoolean()
  isCover?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}