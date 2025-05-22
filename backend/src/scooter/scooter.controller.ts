import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';

@Controller('scooter')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Post()
  create(@Body() createScooterDto: CreateScooterDto) {
    return this.scooterService.create(createScooterDto);
  }

  @Get()
  findAll() {
    return this.scooterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scooterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScooterDto: UpdateScooterDto) {
    return this.scooterService.update(id, updateScooterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scooterService.remove(id);
  }

  @Post(':scooterId/unlock')
  unlock(
    @Param('scooterId') scooterId: string,
    @Body('userId') userId: string,
  ) {
    return this.scooterService.unlock(scooterId, userId);
  }

  @Post(':scooterId/finish')
  finish(
    @Param('scooterId') scooterId: string,
    @Body('userId') userId: string,
  ) {
    return this.scooterService.finish(scooterId, userId);
  }
}
