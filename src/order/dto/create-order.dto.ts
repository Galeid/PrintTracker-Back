export class CreateOrderDto {
  description: string;
  amount: number;
  date: Date;
  serviceId: string;
  clientId: string;
}
