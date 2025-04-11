import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Scooter } from './entities/scooter.entity';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRepository: Repository<Scooter>,
  ) {}

  create(createScooterDto: CreateScooterDto) {
    const scooter = this.scooterRepository.create(createScooterDto);
    return this.scooterRepository.save(scooter);
  }

  async findAll(): Promise<Scooter[]> {
    const scooters = await this.scooterRepository.find();
    console.log('scooters', scooters);

    if (!scooters || !scooters.length) {
      throw new NotFoundException(
        'Nenhuma scooter encontrada. Solicite para o administrador adicionar uma.',
      );
    }

    return scooters;
  }

  async findOne(id: string): Promise<Scooter> {
    const scooter = await this.scooterRepository.findOne({ where: { id } });
    if (!scooter) {
      throw new NotFoundException(`Scooter with ID ${id} not found`);
    }
    return scooter;
  }

  async update(
    id: string,
    updateScooterDto: UpdateScooterDto,
  ): Promise<Scooter> {
    const scooter = await this.findOne(id);
    Object.assign(scooter, updateScooterDto);
    return await this.scooterRepository.save(scooter);
  }

  async remove(id: string): Promise<void> {
    const result = await this.scooterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Scooter with ID ${id} not found`);
    }
  }
}
