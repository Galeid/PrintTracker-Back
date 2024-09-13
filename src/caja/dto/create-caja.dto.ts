export class CreateCajaDto {
  cuenta: number;
  efectivo: number;
  pendiente: number;
  cuentaHoy: number;
  efectivoHoy: number;
  gastoCuentaHoy: number;
  gastoEfectivoHoy: number;
  pendienteHoy: number;
  pasadosPagadosHoy: number;
  estado?: boolean;
}
