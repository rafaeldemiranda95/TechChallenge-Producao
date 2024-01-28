import { Response } from 'express';
import { Usuario } from '../../core/domain/models/Usuario';
import { UsuarioUseCase } from '../../core/domain/useCases/Usuario/UsuarioUseCase';
import { UsuarioRepository } from '../driven/infra/UsuarioRepository';

export class UsuarioController {
  private usuarioRepository: UsuarioRepository;
  private usuarioUseCase: UsuarioUseCase;
  constructor(usuarioRepository: UsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
    this.usuarioUseCase = new UsuarioUseCase(this.usuarioRepository);
  }

  async autenticaAdminstrador(email: string, senha: string, res: Response) {
    try {
      let usuario = new Usuario('', email, '', '', senha);
      await this.usuarioUseCase.autenticaAdministrador(usuario, res);
    } catch (error) {
      throw 'Erro de autenticação do administrador';
      // throw new Error('Erro de autenticação do administrador');
    }
  }

  async autenticaCliente(cpf: string, res: Response) {
    try {
      const usuario = new Usuario('', '', cpf, '');
      await this.usuarioUseCase.autenticaCliente(usuario, res);
    } catch (error) {
      throw 'Ocorreu um erro durante a autenticação do cliente.';
      // throw new Error('Ocorreu um erro durante a autenticação do cliente.');
    }
  }
}
