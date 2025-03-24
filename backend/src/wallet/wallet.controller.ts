import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }

  @Post('add-balance')
  // @UseGuards(JwtAuthGuard)
  async addBalance(@Body() body: { id: string; amount: number }) {
    const wallet = await this.walletService.addBalance(body.id, body.amount);
    return wallet;
  }

  @Post('withdraw')
  // @UseGuards(JwtAuthGuard)
  async withdraw(@Body() body: { id: string; amount: number }) {
    const wallet = await this.walletService.withdraw(body.id, body.amount);
    return wallet;
  }
}
