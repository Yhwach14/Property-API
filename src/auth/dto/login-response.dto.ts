import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

class LoggedInUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty({ enum: Role }) role: Role;
}

export class LoginResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ type: LoggedInUserDto }) user: LoggedInUserDto;
}