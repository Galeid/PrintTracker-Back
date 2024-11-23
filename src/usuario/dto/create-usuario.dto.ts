import { UsuarioRol } from "../enums/UsuarioRol";

export class CreateUsuarioDto {
  usuario: string;
  contrasena: string;
  rol: UsuarioRol;
  nombre?: string;
  estado?: boolean;
}
