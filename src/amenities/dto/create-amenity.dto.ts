import { IsString, Length, Matches } from 'class-validator';

export class CreateAmenityDto {
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters, numbers, and single hyphens only',
  })
  slug: string;

  @IsString()
  @Length(1, 150)
  name: string;
}