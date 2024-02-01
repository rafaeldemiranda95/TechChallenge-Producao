import { UsuarioRepository } from '../../../../adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../../../domain/models/Usuario';

export class UsuarioUseCase {
  usuarioRepository: UsuarioRepository;

  constructor(usuarioRepository: UsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async autenticaAdministrador(usuario: Usuario, res: any) {
    try {
      let verificaUsuario = await this.usuarioRepository.autenticaAdministrador(
        usuario
      );
      if (verificaUsuario == undefined) {
        res.status(400).send('Usuário não encontrado');
      } else {
        res.status(200).send(verificaUsuario);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async autenticaCliente(usuario: Usuario, res: any) {
    try {
      let verificaUsuario = await this.usuarioRepository.autenticaCliente(
        usuario
      );
      if (verificaUsuario == undefined) {
        res.status(400).send('Usuário não encontrado');
      } else {
        res.status(200).send(verificaUsuario);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async validarToken(token: string) {
    try {
      let tokenValido = await this.usuarioRepository.validarToken(token);
      return tokenValido;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
