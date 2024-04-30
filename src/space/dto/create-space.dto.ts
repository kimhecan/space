import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateSpaceRoleDto } from 'src/space/dto/space-role-dto';

export class CreateSpaceDto {
  @IsString()
  name: string;
  @IsString()
  logo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  roles: CreateSpaceRoleDto[];

  myRole: CreateSpaceRoleDto;
}
