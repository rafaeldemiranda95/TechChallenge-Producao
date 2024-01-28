import { runQuery } from '../../../config/database';
import { Usuario } from '../../../core/domain/models/Usuario';
import { IUsuarioUseCase } from '../../../core/domain/useCases/Usuario/IUsuarioUseCase';
import { VerificaSenha } from '../../../core/domain/valueObjects/VerificaSenha';
var jwt = require('jsonwebtoken');

export class UsuarioRepository implements IUsuarioUseCase {
  async validarToken(token: string): Promise<boolean | undefined> {
    let query = `select * from public.usuario where token = '${token}'`;
    let _getUsuarioDb = await runQuery(query);
    // let getUsuarioDb = await prisma.usuario.findUnique({
    //   where: {
    //     token: token,
    //   },
    // });
    if (_getUsuarioDb.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  // Manter
  async autenticaAdministrador(usuario: Usuario): Promise<string | undefined> {
    // let getUsuarioDb = await prisma.usuario.findUnique({
    //   where: {
    //     email: usuario.email,
    //   },
    // });

    let query = `select * from public.usuario where email = '${usuario.email}'`;
    let _getUsuarioDb = await runQuery(query);
    // console.log(_getUsuarioDb);

    if (_getUsuarioDb.length > 0) {
      let getUsuarioDb = _getUsuarioDb[0];
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
          // await prisma.usuario.update({
          //   where: { id: getUsuarioDb.id },
          //   data: { token: token },
          // });

          let saveQuery = `UPDATE public.usuario SET token = '${token}' where id = ${getUsuarioDb.id};`;
          await runQuery(saveQuery);
          return token;
        }
      } else {
        return undefined;
      }
    }

    return undefined;
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
      throw new Error(error);
    }
  }
}
