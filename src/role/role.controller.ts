import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { RoleDto } from './dtos/role.dto';

@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService){}

    @Get('')
    async findAllRoles(){
        return await this.roleService.findAllRoles();
    }

    @Get(':id')
    async getInfoRole(@Param('id') id: string){
        return await this.roleService.getInfoRole(+id)
    }

    @Post('')
    @UseGuards(AdminGuard)
    async addRole(@Body() body:RoleDto){
        return await this.roleService.createRole(body.name);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async updateRole(@Param('id') id: string, @Body() body:RoleDto){
        return await this.roleService.updateRole(+id, body.name)
    }
    @Delete(':id')
    @UseGuards(AdminGuard)
    async deleteRole(@Param('id') id: string){
        return await this.roleService.deleteRole(+id)
    }
}
