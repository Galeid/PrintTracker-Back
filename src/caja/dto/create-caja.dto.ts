export class CreateCajaDto {
  principal: number;
  secundaria: number;
  pendiente: number;
  ingresos: number;
  salidas: number;
  pendienteHoy: number;
  pasadosPagados: number;
  idSucursal: string;
  estado?: boolean;
}
