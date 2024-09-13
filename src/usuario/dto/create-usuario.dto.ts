import { UsuarioRol } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  usuario: string;
  contrasena: string;
  rol: UsuarioRol;
  nombre?: string;
  estado?: boolean;
}
