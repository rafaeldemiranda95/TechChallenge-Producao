import { UsuarioRepository } from '../../../../adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../../../domain/models/Usuario';

export class UsuarioUseCase {
  async autenticaAdministrador(usuario: Usuario, res: any) {
    try {
      let verificaUsuario =
        await new UsuarioRepository().autenticaAdministrador(usuario);
      if (verificaUsuario == undefined) {
        res.status(400).send('Usuário não encontrado');
      } else {
        res.status(200).send(verificaUsuario);
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  async autenticaCliente(usuario: Usuario, res: any) {
    try {
      let verificaUsuario = await new UsuarioRepository().autenticaCliente(
        usuario
      );
      if (verificaUsuario == undefined) {
        res.status(400).send('Usuário não encontrado');
      } else {
        res.status(200).send(verificaUsuario);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async validarToken(token: string) {
    try {
      let tokenValido = await new UsuarioRepository().validarToken(token);
      return tokenValido;
    } catch (error: any) {
      console.log(error);
    }
  }
}
