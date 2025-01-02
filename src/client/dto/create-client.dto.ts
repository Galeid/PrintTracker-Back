export class CreateClientDto {
  name: string;
  company: string;
  ruc?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: boolean;
}
