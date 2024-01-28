import { UsuarioRepository } from '../../../../adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../../../domain/models/Usuario';
import { UsuarioUseCase } from './UsuarioUseCase';

jest.mock('../../../../adapter/driven/infra/UsuarioRepository');

describe('UsuarioUseCase', () => {
  let usuarioUseCase: UsuarioUseCase;
  let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;
  let mockResponse: any;

  beforeEach(() => {
    usuarioRepositoryMock =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    usuarioUseCase = new UsuarioUseCase(usuarioRepositoryMock);
    mockResponse = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
  });

  test('deve autenticar um administrador existente', async () => {
    const usuarioMock = new Usuario(
      'Nome1',
      'email1@example.com',
      '123.456.789-00',
      'admin',
      'senha1',
      'token1',
      1
    );
    const retornoEsperado = 'algumaStringRepresentandoUsuario'; // Ajuste conforme a lógica de autenticação

    usuarioRepositoryMock.autenticaAdministrador.mockResolvedValue(
      retornoEsperado
    );

    await usuarioUseCase.autenticaAdministrador(usuarioMock, mockResponse);

    expect(mockResponse.send).toHaveBeenCalledWith('Usuário Autenticado');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  test('deve lançar erro quando o administrador não for encontrado', async () => {
    const usuarioMock = new Usuario(
      'Nome1',
      'email1@example.com',
      '123.456.789-00',
      'admin',
      'senha1',
      'token1',
      1
    );
    usuarioRepositoryMock.autenticaAdministrador.mockResolvedValue(undefined);

    await expect(
      usuarioUseCase.autenticaAdministrador(usuarioMock, mockResponse)
    ).rejects.toThrow('Usuário não encontrado');
  });

  test('deve propagar erros do repositório', async () => {
    const usuarioMock = new Usuario(
      'Nome1',
      'email1@example.com',
      '123.456.789-00',
      'admin',
      'senha1',
      'token1',
      1
    );
    const errorMock = new Error('Erro de teste');
    usuarioRepositoryMock.autenticaAdministrador.mockRejectedValue(errorMock);

    await expect(
      usuarioUseCase.autenticaAdministrador(usuarioMock, mockResponse)
    ).rejects.toThrow('Erro de teste');
  });
});

describe('UsuarioUseCase - autenticaCliente', () => {
  let usuarioUseCase: UsuarioUseCase;
  let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;
  let mockResponse: any;

  beforeEach(() => {
    usuarioRepositoryMock =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    usuarioUseCase = new UsuarioUseCase(usuarioRepositoryMock);
    mockResponse = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
  });

  test('deve autenticar um cliente existente', async () => {
    const usuarioMock = new Usuario(
      'Nome',
      'email@example.com',
      '123.456.789-00'
    );
    const retornoEsperado = 'tokem-mock';
    usuarioRepositoryMock.autenticaCliente.mockResolvedValue(retornoEsperado);

    await usuarioUseCase.autenticaCliente(usuarioMock, mockResponse);

    expect(mockResponse.send).toHaveBeenCalledWith(retornoEsperado);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  test('deve lançar erro quando o cliente não for encontrado', async () => {
    const usuarioMock = new Usuario(
      'Nome',
      'email@example.com',
      '123.456.789-00'
    );
    usuarioRepositoryMock.autenticaCliente.mockResolvedValue(undefined);

    await expect(
      usuarioUseCase.autenticaCliente(usuarioMock, mockResponse)
    ).rejects.toThrow('Usuário não encontrado');
  });

  test('deve propagar erros do repositório', async () => {
    const usuarioMock = new Usuario(
      'Nome',
      'email@example.com',
      '123.456.789-00'
    );
    const errorMock = new Error('Erro de teste');
    usuarioRepositoryMock.autenticaCliente.mockRejectedValue(errorMock);

    await expect(
      usuarioUseCase.autenticaCliente(usuarioMock, mockResponse)
    ).rejects.toThrow('Erro de teste');
  });
});

describe('UsuarioUseCase - validarToken', () => {
  let usuarioUseCase: UsuarioUseCase;
  let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepositoryMock =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    usuarioUseCase = new UsuarioUseCase(usuarioRepositoryMock);
  });

  test('deve retornar verdadeiro para um token válido', async () => {
    const tokenMock = 'tokenValido';
    usuarioRepositoryMock.validarToken.mockResolvedValue(true);

    const resultado = await usuarioUseCase.validarToken(tokenMock);

    expect(resultado).toBe(true);
  });

  test('deve retornar falso para um token inválido', async () => {
    const tokenMock = 'tokenInvalido';
    usuarioRepositoryMock.validarToken.mockResolvedValue(false);

    const resultado = await usuarioUseCase.validarToken(tokenMock);

    expect(resultado).toBe(false);
  });

  test('deve propagar erros do repositório', async () => {
    const tokenMock = 'tokenComErro';
    const errorMock = new Error('Erro de teste');
    usuarioRepositoryMock.validarToken.mockRejectedValue(errorMock);

    await expect(usuarioUseCase.validarToken(tokenMock)).rejects.toThrow(
      'Erro de teste'
    );
  });
});
