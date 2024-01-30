import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../src/adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../src/core/domain/models/Usuario';

jest.mock('../src/config/database');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('UsuarioRepository', () => {
  let usuarioRepository: UsuarioRepository;

  beforeEach(() => {
    usuarioRepository = new UsuarioRepository();
    (jwt.sign as jest.Mock).mockReturnValue('tokenJWT');
  });

  test('deve validar um token existente', async () => {
    const tokenMock = 'tokenValido';
    require('./../src/config/database').runQuery.mockResolvedValue([
      { id: 1, token: tokenMock },
    ]);
    const isValid = await usuarioRepository.validarToken(tokenMock);
    expect(isValid).toBe(true);
  });

  test('deve retornar false para um token inválido', async () => {
    const tokenMock = 'tokenInvalido';
    require('./../src/config/database').runQuery.mockResolvedValue([]);
    const isValid = await usuarioRepository.validarToken(tokenMock);
    expect(isValid).toBe(false);
  });

  test('deve autenticar um administrador e retornar um token', async () => {
    const usuarioMock: Usuario = {
      nome: 'Nome do Usuário',
      email: 'email@example.com',
      senha: 'senha123',
      cpf: '123.456.789-00',
    };
    require('./../src/config/database').runQuery.mockResolvedValueOnce([
      { id: 1, ...usuarioMock },
    ]);

    const token = await usuarioRepository.autenticaAdministrador(usuarioMock);
    expect(token).toBe('tokenJWT');
  });

  test('deve autenticar um cliente e retornar um token', async () => {
    const usuarioMock: Usuario = {
      nome: 'Nome do Usuário',
      email: 'email@example.com',
      senha: 'senha123',
      cpf: '123.456.789-00',
    };
    require('./../src/config/database').runQuery.mockResolvedValueOnce([
      { id: 1, ...usuarioMock },
    ]);

    const token = await usuarioRepository.autenticaCliente(usuarioMock);
    expect(token).toBe('tokenJWT');
  });
});
