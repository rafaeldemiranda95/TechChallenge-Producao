import { UsuarioRepository } from '../../../../adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../../../domain/models/Usuario';

export class UsuarioUseCase {
  private usuarioRepository: UsuarioRepository;

  constructor(usuarioRepository: UsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  // Manter
  async autenticaAdministrador(usuario: Usuario, res: any) {
    try {
      const usuarioAutenticado =
        await this.usuarioRepository.autenticaAdministrador(usuario);
      if (usuarioAutenticado) {
        res.status(200).send('Usuário Autenticado');
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      // Aqui você pode tratar os erros conforme necessário
      throw error;
    }
  }
  async autenticaCliente(usuario: Usuario, res: any) {
    try {
      const verificaUsuario = await this.usuarioRepository.autenticaCliente(
        usuario
      );
      if (verificaUsuario) {
        res.status(200).send(verificaUsuario);
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async validarToken(token: string) {
    try {
      let tokenValido = await this.usuarioRepository.validarToken(token);
      return tokenValido;
    } catch (error: any) {
      throw error;
    }
  }
}
