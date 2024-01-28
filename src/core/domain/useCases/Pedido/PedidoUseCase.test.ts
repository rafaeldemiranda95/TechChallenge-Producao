import { PedidoRepository } from '../../../../adapter/driven/infra/PedidoRepository';
import { ListagemPedidos } from '../../../domain/models/ListagemPedidos';
import { Pedido } from '../../models/Pedido';
import { PedidoUseCase } from './PedidoUseCase';

jest.mock('../../../../adapter/driven/infra/PedidoRepository');

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;
  let mockPedidoRepository: jest.Mocked<PedidoRepository>;

  beforeEach(() => {
    // Assegure-se de que o mock está sendo configurado corretamente
    mockPedidoRepository =
      new PedidoRepository() as jest.Mocked<PedidoRepository>;
    mockPedidoRepository.listar.mockResolvedValue([]);
    pedidoUseCase = new PedidoUseCase(mockPedidoRepository);
  });

  describe('listarPedidos', () => {
    it('deve chamar listar de PedidoRepository e retornar o resultado', async () => {
      // Configurar o retorno esperado de listar
      const pedidosMock: ListagemPedidos[] = [
        {
          id: 1,
          usuarioId: 1,
          produtos: [],
          status: 'recebido',
          tempoEspera: 30,
          total: 100,
        },
        // ...outros pedidos se necessário
      ];
      mockPedidoRepository.listar.mockResolvedValue(pedidosMock);

      // Chamar o método listarPedidos e armazenar o resultado
      const resultado = await pedidoUseCase.listarPedidos();

      // Verificar se listar foi chamado
      expect(mockPedidoRepository.listar).toHaveBeenCalled();
      // Verificar se o resultado é o esperado
      expect(resultado).toEqual(pedidosMock);
    });
  });

  describe('listaFilas', () => {
    it('deve chamar listagemFilas de PedidoRepository e retornar o resultado', async () => {
      // Configurar o retorno esperado de listagemFilas
      const filasMock = [
        {
          status: 'mock-status',
          usuarioId: 10,
          pedidoId: 190,
          id: 20,
        },
      ];
      mockPedidoRepository.listagemFilas.mockResolvedValue(filasMock);

      // Chamar o método listaFilas e armazenar o resultado
      const resultado = await pedidoUseCase.listaFilas();

      // Verificar se listagemFilas foi chamado
      expect(mockPedidoRepository.listagemFilas).toHaveBeenCalled();
      // Verificar se o resultado é o esperado
      expect(resultado).toEqual(filasMock);
    });
  });

  describe('trocarStatusFila', () => {
    it('deve chamar trocarStatusFila de PedidoRepository com os argumentos corretos', async () => {
      const id = 1;
      const status = 'novo status';

      mockPedidoRepository.trocarStatusFila.mockResolvedValue();

      await pedidoUseCase.trocarStatusFila(id, status);

      expect(mockPedidoRepository.trocarStatusFila).toHaveBeenCalledWith(
        id,
        status
      );
    });

    it('deve lidar com erros ao chamar trocarStatusFila de PedidoRepository', async () => {
      const id = 1;
      const status = 'novo status';
      const errorMock = new Error('Erro ao trocar status');
      mockPedidoRepository.trocarStatusFila.mockRejectedValue(errorMock);

      await expect(pedidoUseCase.trocarStatusFila(id, status)).rejects.toThrow(
        errorMock
      );

      expect(mockPedidoRepository.trocarStatusFila).toHaveBeenCalledWith(
        id,
        status
      );
    });
  });
  describe('listaPedidosPorStatus', () => {
    it('deve chamar listarPorStatus de PedidoRepository com os argumentos corretos', async () => {
      const statusArray = ['recebido', 'em preparação'];
      const pedidosMock: Pedido[] = [
        {
          id: 1,
          status: 'recebido',
          usuario: {
            id: 1,
            nome: 'Usuario 1',
            email: 'email@example.com',
            cpf: '123.456.789-00',
          },
          produto: [
            {
              id: 14,
              quantidade: 3,
              produtoId: 5,
            },
          ],
        },
        // ...outros pedidos se necessário
      ];
      mockPedidoRepository.listarPorStatus.mockResolvedValue(pedidosMock);

      const resultado = await pedidoUseCase.listaPedidosPorStatus(statusArray);

      expect(mockPedidoRepository.listarPorStatus).toHaveBeenCalledWith(
        statusArray
      );
      expect(resultado).toEqual(pedidosMock);
    });

    it('deve lidar com erros ao chamar listarPorStatus de PedidoRepository', async () => {
      const statusArray = ['recebido', 'em preparação'];
      const errorMock = new Error('Erro ao listar pedidos');
      mockPedidoRepository.listarPorStatus.mockRejectedValue(errorMock);

      await expect(
        pedidoUseCase.listaPedidosPorStatus(statusArray)
      ).rejects.toThrow(errorMock);

      expect(mockPedidoRepository.listarPorStatus).toHaveBeenCalledWith(
        statusArray
      );
    });
  });
});
