import { Response } from 'express';
import { PedidoController } from '../src/adapter/driver/PedidoController';
import { PedidoUseCase } from '../src/core/domain/useCases/Pedido/PedidoUseCase';

jest.mock('../src/core/domain/useCases/Pedido/PedidoUseCase');

describe('PedidoController', () => {
  let pedidoController: PedidoController;
  let mockPedidoUseCase: jest.Mocked<PedidoUseCase>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockPedidoUseCase = new PedidoUseCase() as jest.Mocked<PedidoUseCase>;
    pedidoController = new PedidoController(mockPedidoUseCase);
    mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  });

  describe('listaPedidos', () => {
    it('deve listar pedidos e enviar resposta correta', async () => {
      const mockPedidos = [{ id: 1, nome: 'Pedido 1' }];
      mockPedidoUseCase.listarPedidos.mockResolvedValue(mockPedidos);

      await pedidoController.listaPedidos(mockRes as Response);

      expect(mockPedidoUseCase.listarPedidos).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockPedidos);
    });
  });
  it('deve lançar um erro se listarPedidos falhar', async () => {
    const mockError = new Error('Erro ao listar pedidos');
    mockPedidoUseCase.listarPedidos.mockRejectedValue(mockError);

    await expect(
      pedidoController.listaPedidos(mockRes as Response)
    ).rejects.toThrow(mockError);

    expect(mockPedidoUseCase.listarPedidos).toHaveBeenCalled();
    // Você pode também verificar se o `res.status` e `res.send` NÃO foram chamados, já que espera-se que a função lance um erro
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });

  describe('listaFilas', () => {
    it('deve listar filas e enviar resposta correta', async () => {
      const mockFilas = [{ id: 1, nome: 'Fila 1' }];
      mockPedidoUseCase.listaFilas.mockResolvedValue(mockFilas);

      await pedidoController.listaFilas(mockRes as Response);

      expect(mockPedidoUseCase.listaFilas).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockFilas);
    });

    it('deve lançar um erro se listaFilas falhar', async () => {
      const mockError = new Error('Erro ao listar filas');
      mockPedidoUseCase.listaFilas.mockRejectedValue(mockError);

      await expect(
        pedidoController.listaFilas(mockRes as Response)
      ).rejects.toThrow(mockError);

      expect(mockPedidoUseCase.listaFilas).toHaveBeenCalled();
      // Verifica se o `res.status` e `res.send` NÃO foram chamados, já que espera-se que a função lance um erro
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
    });
  });

  describe('trocarStatusFila', () => {
    it('deve trocar status da fila e enviar resposta correta', async () => {
      const id = 1;
      const status = 'novo status';

      await pedidoController.trocarStatusFila(id, status, mockRes as Response);

      expect(mockPedidoUseCase.trocarStatusFila).toHaveBeenCalledWith(
        id,
        status
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(
        'Status da fila trocado com sucesso!'
      );
    });
  });

  it('deve lançar um erro se trocarStatusFila falhar', async () => {
    const mockError = new Error('Erro ao trocar status da fila');
    const id = 1;
    const status = 'novo status';
    mockPedidoUseCase.trocarStatusFila.mockRejectedValue(mockError);

    await expect(
      pedidoController.trocarStatusFila(id, status, mockRes as Response)
    ).rejects.toThrow(mockError);

    expect(mockPedidoUseCase.trocarStatusFila).toHaveBeenCalledWith(id, status);
    // Verifica se o `res.status` e `res.send` NÃO foram chamados, já que espera-se que a função lance um erro
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });

  // Testes adicionais para verificar casos de erro...
});
