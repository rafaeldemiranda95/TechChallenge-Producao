import { Response } from 'express';
import { UsuarioRepository } from '../driven/infra/UsuarioRepository';
import { UsuarioController } from './UsuarioController';

// Create Jest test suite
describe('UsuarioController', () => {
  // Create mock objects or use real instances for dependencies as needed
  const mockUsuarioRepository = new UsuarioRepository();
  const mockResponse = {} as Response;
  // Crie uma instância de UsuarioController para teste
  const usuarioController = new UsuarioController(mockUsuarioRepository);
  // Crie um spy ou mock para usuarioUseCase.autenticaAdministrador
  //   const autenticaAdministradorMock = jest.fn();
  //   usuarioController['usuarioUseCase'].autenticaAdministrador =
  //     autenticaAdministradorMock;
  test('autenticaAdminstrador should call usuarioUseCase.autenticaAdministrador with valid parameters', async () => {
    // Arrange
    const email = 'test@example.com';
    const senha = 'password';

    // Create a spy or mock for usuarioUseCase.autenticaAdministrador
    const autenticaAdministradorMock = jest.fn();
    usuarioController['usuarioUseCase']['autenticaAdministrador'] =
      autenticaAdministradorMock;

    // Act
    await usuarioController.autenticaAdminstrador(email, senha, mockResponse);

    // Assert
    expect(autenticaAdministradorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        // Validate the Usuario object being passed to the use case
        email: email,
        senha: senha,
      }),
      mockResponse
    );
  });
  it('should handle error in autenticaAdminstrador', async () => {
    // Mocking dependencies
    const mockUsuarioRepository = new UsuarioRepository();
    const mockResponse = {} as Response;

    // Create an instance of UsuarioController
    const usuarioController = new UsuarioController(mockUsuarioRepository);

    // Create a spy for usuarioUseCase.autenticaAdministrador that throws an error
    const errorMock = 'Erro de autenticação do administrador';
    const autenticaAdministradorSpy = jest
      .spyOn(usuarioController['usuarioUseCase'], 'autenticaAdministrador')
      .mockRejectedValueOnce(errorMock);

    // Call the method that should throw an error
    try {
      await usuarioController.autenticaAdminstrador(
        'test@example.com',
        'password',
        mockResponse
      );
      // If no error is thrown, fail the test
      fail('Expected an error to be thrown');
    } catch (error) {
      // Verify that the error message matches the expected error message
      expect(error).toBe(errorMock);
    }

    // Verify that autenticaAdministradorSpy was called with the correct parameters
    expect(autenticaAdministradorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        senha: 'password',
      }),
      mockResponse
    );

    // Restore the original implementation of autenticaAdministrador
    autenticaAdministradorSpy.mockRestore();
  });

  describe('autenticaCliente', () => {
    it('should authenticate a client successfully', async () => {
      // Arrange
      const cpf = '1234567890';

      // Create a spy or mock for usuarioUseCase.autenticaAdministrador
      const autenticaClienteMock = jest.fn();
      usuarioController['usuarioUseCase']['autenticaCliente'] =
        autenticaClienteMock;

      // Act
      await usuarioController.autenticaCliente(cpf, mockResponse);

      // Assert
      expect(autenticaClienteMock).toHaveBeenCalledWith(
        expect.objectContaining({
          // Validate the Usuario object being passed to the use case
          cpf: cpf,
        }),
        mockResponse
      );
    });

    it('should handle error in autenticaCliente', async () => {
      // Mocking dependencies
      const mockUsuarioRepository = new UsuarioRepository();
      const mockResponse = {
        status: jest.fn().mockReturnThis(), // Mock the Response object methods
        send: jest.fn(),
      } as unknown as Response;

      // Create an instance of UsuarioController with the mocked dependencies
      const usuarioController = new UsuarioController(mockUsuarioRepository);

      // Create a spy for usuarioUseCase.autenticaCliente that throws an error
      const errorMock = 'Ocorreu um erro durante a autenticação do cliente.';
      const usuarioUseCaseMock = {
        autenticaCliente: jest.fn().mockRejectedValueOnce(errorMock),
      };

      // Replace the usuarioUseCase in the controller with the spy
      usuarioController['usuarioUseCase'] = usuarioUseCaseMock as any;

      // Call the method to authenticate the client
      try {
        await usuarioController.autenticaCliente('1234567890', mockResponse);
        // If no error is thrown, fail the test
        fail('Expected an error to be thrown');
      } catch (error) {
        // Verify that the error message matches the expected error message
        expect(error).toBe(errorMock);
      }

      // Verify that the autenticaCliente method was called with the correct parameters
      expect(usuarioUseCaseMock.autenticaCliente).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: '1234567890',
        }),
        mockResponse
      );

      // Verify that the response was not sent (due to the error)
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });
});

//
//
//
// import { Response } from 'express';
// import { Usuario } from '../../core/domain/models/Usuario';
// import { UsuarioUseCase } from '../../core/domain/useCases/Usuario/UsuarioUseCase';
// import { UsuarioRepository } from '../driven/infra/UsuarioRepository';
// import { UsuarioController } from './UsuarioController';

// jest.mock('../../core/domain/models/Usuario');
// // Mock do módulo UsuarioUseCase
// jest.mock('../../core/domain/useCases/Usuario/UsuarioUseCase');
// describe('UsuarioController - autenticaAdminstrador', () => {
//   let usuarioController: UsuarioController;
//   let mockUsuarioUseCase: jest.Mocked<UsuarioUseCase>;
//   let mockRes: Partial<Response>;
//   let mockUsuarioRepository: any; // Mock apropriado para UsuarioRepository

//   beforeEach(() => {
//     mockUsuarioRepository = {}; // Configuração do mock de UsuarioRepository
//     mockUsuarioUseCase = new UsuarioUseCase(
//       mockUsuarioRepository
//     ) as jest.Mocked<UsuarioUseCase>;
//     usuarioController = new UsuarioController(mockUsuarioRepository);
//     mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
//   });

//   // Limpeza após os testes
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('deve autenticar um administrador', async () => {
//     const email = 'admin@example.com';
//     const senha = 'senha123';

//     await usuarioController.autenticaAdminstrador(
//       email,
//       senha,
//       mockRes as Response
//     );

//     expect(Usuario).toHaveBeenCalledWith('', email, '', '', senha);
//     expect(mockUsuarioUseCase.autenticaAdministrador).toHaveBeenCalledWith(
//       expect.any(Usuario),
//       mockRes
//     );
//   });

//   it('deve tratar erros durante a autenticação', async () => {
//     const mockError = new Error('Erro de autenticação');
//     mockUsuarioUseCase.autenticaAdministrador.mockRejectedValue(mockError);
//     const consoleSpy = jest.spyOn(console, 'log');

//     await usuarioController.autenticaAdminstrador(
//       'email@example.com',
//       'senha',
//       mockRes as Response
//     );

//     expect(consoleSpy).toHaveBeenCalledWith(mockError);
//   });

//   it('deve enviar uma resposta de erro quando a autenticação falhar', async () => {
//     // Configuração do mock e chamada do método do controller...

//     expect(mockRes.status).toHaveBeenCalledWith(500); // ou qualquer código de status esperado
//     expect(mockRes.send).toHaveBeenCalled();
//   });

//   // Testes adicionais...
// });

// describe('UsuarioController - autenticaCliente', () => {
//   it('deve autenticar um cliente com sucesso', async () => {
//     const mockUsuarioRepository = new UsuarioRepository();
//     const usuarioController = new UsuarioController(mockUsuarioRepository);
//     const mockRes = {}; // Mock apropriado para o objeto de resposta

//     await usuarioController.autenticaCliente('123.456.789-00', mockRes);

//     // Verificações semelhantes ao teste anterior
//     // ...
//   });

//   // Testes adicionais...
// });
