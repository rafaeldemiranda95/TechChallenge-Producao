import { Usuario } from '../../core/domain/models/Usuario';
import { UsuarioUseCase } from '../../core/domain/useCases/Usuario/UsuarioUseCase';
export class UsuarioController {
  async autenticaAdminstrador(email: string, senha: string, res: any) {
    try {
      let usuario = new Usuario('', email, '', '', senha);
      await new UsuarioUseCase().autenticaAdministrador(usuario, res);
    } catch (error: any) {
      console.log(error);
    }
  }
  async autenticaCliente(cpf: string, res: any) {
    try {
      let usuario = new Usuario('', '', cpf, '');
      await new UsuarioUseCase().autenticaCliente(usuario, res);
    } catch (error: any) {
      console.log(error);
    }
  }
}
