import {
  Controller,
  Get,
  Body,
  Delete,
  Req,
  UseGuards,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from 'src/common/gaurds/roles.gaurd';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoggedInUser(@Req() req: any) {
    const email = req.user.email;

    return this.userService.findOne(email);
  }

  @Put()
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.email, updateUserDto);
  }

  @Put('role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUserRole(
    @Req() req: any,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    if (req.user.email === updateUserRoleDto.email) {
      throw new BadRequestException('You cannot change your own role');
    }

    return this.userService.updateUserRole(updateUserRoleDto);
  }

  // @Put('oidc-config')
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // updateOidcConfig(@Body() updateOidcConfigDto: UpdateOidcConfigDto) {
  //   return this.userService.updateOidcConfig(updateOidcConfigDto.email, updateOidcConfigDto);
  // }

  @Delete()
  remove(@Req() req: any) {
    return this.userService.remove(req.user.email);
  }
}
