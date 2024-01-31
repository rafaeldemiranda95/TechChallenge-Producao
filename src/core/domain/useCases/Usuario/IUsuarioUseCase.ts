import { Usuario } from '../../models/Usuario';
export interface IUsuarioUseCase {
  autenticaAdministrador(usuario: Usuario): Promise<string | undefined>;
  autenticaCliente(usuario: Usuario): Promise<string | undefined>;
  validarToken(token: string): Promise<boolean | undefined>;
}
