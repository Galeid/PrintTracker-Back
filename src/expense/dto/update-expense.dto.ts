import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateGastoDto extends PartialType(CreateExpenseDto) {}
