import { UsuarioRepository } from '../src/adapter/driven/infra/UsuarioRepository';
import { UsuarioController } from '../src/adapter/driver/UsuarioController';
import { Usuario } from '../src/core/domain/models/Usuario';
import { UsuarioUseCase } from '../src/core/domain/useCases/Usuario/UsuarioUseCase';

jest.mock('../src/adapter/driven/infra/UsuarioRepository');
jest.mock('../src/core/domain/useCases/Usuario/UsuarioUseCase');
jest.mock('../src/core/domain/valueObjects/cpf', () => {
  return {
    CPF: jest.fn().mockImplementation(() => ({ value: true })),
  };
});

describe('UsuarioController - cadastrarCliente', () => {
  let usuarioController: UsuarioController;
  let mockUsuarioUseCase: jest.Mocked<UsuarioUseCase>;
  let cpfFactoryMock: jest.Mock;
  let mockRes: any;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    mockUsuarioRepository =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    mockUsuarioUseCase = new UsuarioUseCase(
      mockUsuarioRepository
    ) as jest.Mocked<UsuarioUseCase>;
    cpfFactoryMock = jest.fn();
    usuarioController = new UsuarioController(
      mockUsuarioUseCase,
      cpfFactoryMock
    );
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });
  describe('autenticaAdminstrador', () => {
    it('deve autenticar administrador com sucesso', async () => {
      mockUsuarioUseCase.autenticaAdministrador.mockImplementation(
        async (usuario, res) => {
          res.status(200).send('token-valido');
        }
      );

      await usuarioController.autenticaAdminstrador(
        'admin@example.com',
        'senha123',
        mockRes
      );

      expect(mockUsuarioUseCase.autenticaAdministrador).toHaveBeenCalledWith(
        expect.any(Usuario),
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('token-valido');
    });

    it('deve lançar um erro de autenticação do administrador', async () => {
      mockUsuarioUseCase.autenticaAdministrador.mockImplementation(async () => {
        throw new Error('Erro de autenticação do administrador');
      });

      await expect(
        usuarioController.autenticaAdminstrador(
          'admin@example.com',
          'senha123',
          mockRes
        )
      ).rejects.toThrow('Erro de autenticação do administrador');
    });
  });

  describe('autenticaCliente', () => {
    it('deve autenticar um cliente com sucesso', async () => {
      mockUsuarioUseCase.autenticaCliente.mockImplementation(
        async (usuario, res) => {
          res.status(200).send('token-valido');
        }
      );

      await usuarioController.autenticaCliente('149.292.720-17', mockRes);

      expect(mockUsuarioUseCase.autenticaCliente).toHaveBeenCalledWith(
        expect.any(Usuario),
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('token-valido');
    });

    it('deve lançar um erro se a autenticação do cliente falhar', async () => {
      mockUsuarioUseCase.autenticaCliente.mockRejectedValue(
        new Error('Erro de autenticação do cliente')
      );

      await expect(
        usuarioController.autenticaCliente('123456', mockRes)
      ).rejects.toThrow('Erro de autenticação do cliente');
    });
  });
});
