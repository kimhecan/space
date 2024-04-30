import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleType } from 'src/space/type';

export class CreateSpaceRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RoleType)
  type: RoleType;
}
