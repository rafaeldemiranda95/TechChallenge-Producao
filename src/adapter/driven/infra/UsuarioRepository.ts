import { runQuery } from '../../../config/database';
import { Usuario } from '../../../core/domain/models/Usuario';
import { IUsuarioUseCase } from '../../../core/domain/useCases/Usuario/IUsuarioUseCase';
import { VerificaSenha } from '../../../core/domain/valueObjects/VerificaSenha';
var jwt = require('jsonwebtoken');

export class UsuarioRepository implements IUsuarioUseCase {
  async validarToken(token: string): Promise<boolean | undefined> {
    let query = `select * from public.usuario where token = '${token}'`;
    let _getUsuarioDb = await runQuery(query);
    if (_getUsuarioDb.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async autenticaAdministrador(usuario: Usuario): Promise<string | undefined> {
    try {
      let query = `select * from public.usuario where email = '${usuario.email}'`;
      let _getUsuarioDb = await runQuery(query);
      if (_getUsuarioDb.length > 0) {
        let getUsuarioDb = _getUsuarioDb[0];
        console.log('getUsuarioDb   ===>>>  ', getUsuarioDb);
        console.log('usuario.senha   ===>>>  ', getUsuarioDb.senha);
        if (usuario.senha != undefined && getUsuarioDb.senha != undefined) {
          let validaSenha = new VerificaSenha();
          if (validaSenha) {
            let token = jwt.sign(
              {
                id: getUsuarioDb.id,
                nome: getUsuarioDb.nome,
                email: getUsuarioDb.email,
                tipo: getUsuarioDb.tipo,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: '365d',
              }
            );
            let saveQuery = `UPDATE public.usuario SET token = '${token}' where id = ${getUsuarioDb.id};`;
            await runQuery(saveQuery);
            return token;
          }
        }
        return undefined;
      }
    } catch (err: any) {
      throw err;
    }
  }

  async autenticaCliente(usuario: Usuario): Promise<string | undefined> {
    try {
      let query = `select * from public.usuario where cpf = '${usuario.cpf}'`;
      let _getUsuarioDb = await runQuery(query);
      if (_getUsuarioDb.length > 0) {
        let getUsuarioDb = _getUsuarioDb[0];
        let token = jwt.sign(
          {
            id: getUsuarioDb.id,
            nome: getUsuarioDb.nome,
            email: getUsuarioDb.email,
            tipo: getUsuarioDb.tipo,
            cpf: getUsuarioDb.cpf,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '365d',
          }
        );
        let saveQuery = `UPDATE public.usuario SET token = '${token}' where id = ${getUsuarioDb.id};`;
        await runQuery(saveQuery);
        return token;
      }
    } catch (error: any) {
      throw error;
    }
  }
}
