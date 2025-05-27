import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Scooter } from './entities/scooter.entity';
import { ScooterStatus } from './enums/scooter-status.enum';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { Geolocation, TrackingScooter } from './dto/scooter.dto';
import { ScooterTrackingGateway } from './gateways/scooter-tracking.gateway';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class ScooterService {
  readonly UPDATE_SCOOTER_TOPIC = process.env.KAFKA_TOPIC || 'update-scooter';
  readonly TRACK_SCOOTER_TOPIC = 'track-scooter';

  constructor(
    @InjectRepository(Scooter)
    private scooterRepository: Repository<Scooter>,
    private producerService: ProducerService,
    private scooterTrackingGateway: ScooterTrackingGateway,
    private walletService: WalletService,
  ) {}

  create(createScooterDto: CreateScooterDto) {
    const scooter = this.scooterRepository.create(createScooterDto);
    return this.scooterRepository.save(scooter);
  }

  async findAll(): Promise<Scooter[]> {
    const scooters = await this.scooterRepository.find();
    // console.log('scooters', scooters);

    if (!scooters || !scooters.length) {
      throw new NotFoundException(
        'Nenhum patinete encontrado. Solicite para o administrador adicionar ao menos um.',
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

  async unlock(scooterId: string, userId: string): Promise<Scooter> {
    const scooter = await this.findOne(scooterId);

    if (!scooter) {
      throw new NotFoundException('Patinete não encontrado');
    }

    if (scooter.status !== ScooterStatus.AVAILABLE) {
      throw new BadRequestException('Patinete não disponível para locação.');
    }

    const MIN_BATTERY_LEVEL = 20;
    if (scooter.batteryLevel < MIN_BATTERY_LEVEL) {
      throw new BadRequestException(
        `Bateria insuficiente. O mínimo para uso é ${MIN_BATTERY_LEVEL}%.`,
      );
    }

    scooter.status = ScooterStatus.IN_USE;
    scooter.locked = true;
    scooter.userId = userId;
    scooter.startTime = new Date();

    const updatedScooter = await this.scooterRepository.save(scooter);

    await this.produceKafkaMessage(this.UPDATE_SCOOTER_TOPIC, updatedScooter);

    return updatedScooter;
  }

  async produceKafkaMessage(topic: string, scooter: Scooter) {
    try {
      await this.producerService.produce({
        topic: topic,
        messages: [{ key: scooter.id, value: JSON.stringify(scooter) }],
      });
    } catch (error) {
      console.error(`erro ao enviar para o tópico ${topic}`, error);
    }
  }

  async finish(scooterId: string, userId: string): Promise<Scooter> {
    const scooter = await this.findOne(scooterId);

    if (scooter.status !== ScooterStatus.IN_USE) {
      throw new BadRequestException(
        'Patinete deve estar em uso para finalizar.',
      );
    }

    if (scooter.userId !== userId) {
      throw new UnauthorizedException('Usuário sem autorização para finalizar');
    }

    // await this.reduceBalance(scooter);

    scooter.status = ScooterStatus.AVAILABLE;
    scooter.userId = null;
    scooter.startTime = null;
    scooter.locked = false;

    const updatedScooter = await this.scooterRepository.save(scooter);

    await this.produceKafkaMessage(this.UPDATE_SCOOTER_TOPIC, updatedScooter);

    return updatedScooter;
  }

  async reduceBalance(scooter: Scooter) {
    if (!scooter) {
      throw new BadRequestException(
        'Impossível fazer o desconto do saldo sem um patinete',
      );
    }

    if (!scooter.userId) {
      throw new BadRequestException(
        'Impossível fazer o desconto sem um usuário',
      );
    }

    if (!scooter?.startTime) {
      throw new UnauthorizedException(
        'Impossível finalizar sem data de início',
      );
    }

    const wallet = await this.walletService.findByUserId(scooter.userId);
    if (wallet.balance <= wallet.minimumBalance) return;

    const now = new Date().getTime();
    const diffInSeconds = Math.floor(
      Math.abs(now - scooter.startTime.getTime()) / 1000,
    );

    const factor = 1 / 60; // 1 moeda a cada 1 minuto
    const amount = Math.ceil(diffInSeconds * factor) * -1;

    await this.walletService.updateBalance(wallet.id, amount);
  }

  async updatePosition(
    id: string,
    geolocation: Geolocation,
    batteryLevel: number,
  ) {
    const scooter = await this.findOne(id);

    if (!scooter) {
      throw new NotFoundException(`Scooter #${id} not found`);
    }

    scooter.geolocation = geolocation;
    scooter.batteryLevel = batteryLevel;

    return this.scooterRepository.save(scooter);
  }

  async updateScooterData(scooter: TrackingScooter) {
    const existingScooter = await this.findOne(scooter.id);
    if (!existingScooter) {
      throw new NotFoundException(
        `Scooter com o ID ${scooter.id} não encontrada`,
      );
    }

    Object.assign(existingScooter, scooter);
    return this.scooterRepository.save(existingScooter);
  }

  async emitScooterPosition(receivedScooter: TrackingScooter) {
    try {
      const updatedScooter = await this.updateScooterData(receivedScooter);

      this.scooterTrackingGateway.emitToScooter(
        'scooter-position',
        updatedScooter,
      );
    } catch (error: unknown) {
      console.error('Error emitting scooter position:', error);
    }
  }

  async findActiveRideByUserId(userId: string) {
    return this.scooterRepository.findOne({
      where: {
        userId,
        status: ScooterStatus.IN_USE,
      },
    });
  }
}
