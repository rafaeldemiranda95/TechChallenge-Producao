import { PedidoRepository } from '../src/adapter/driven/infra/PedidoRepository';
import { runQuery } from '../src/config/database';

jest.mock('../src/config/database', () => ({
  runQuery: jest.fn(),
}));

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;

  beforeEach(() => {
    pedidoRepository = new PedidoRepository();
    jest.clearAllMocks();
  });

  describe('listagemFilas', () => {
    it('deve retornar uma lista vazia quando não há filas', async () => {
      require('../src/config/database').runQuery.mockResolvedValue([]);
      const resultado = await pedidoRepository.listagemFilas();
      expect(resultado).toEqual([]);
      expect(runQuery).toHaveBeenCalledWith(
        'SELECT * FROM public.fila ORDER BY id ASC'
      );
    });

    // Mais testes para listagemFilas...
  });

  describe('trocarStatusFila', () => {
    it('deve atualizar o status da fila e do pedido corretamente', async () => {
      require('../src/config/database').runQuery.mockResolvedValueOnce([
        { id: 1, status: 'novo status' },
      ]);
      require('../src/config/database').runQuery.mockResolvedValueOnce([
        { id: 1, status: 'novo status' },
      ]);

      await pedidoRepository.trocarStatusFila(1, 'novo status');

      expect(runQuery).toHaveBeenCalledWith(
        "UPDATE public.fila SET status = 'novo status' WHERE id = 1 RETURNING *"
      );
      expect(runQuery).toHaveBeenCalledWith(
        "UPDATE public.pedido SET status = 'novo status' WHERE id = 1 RETURNING *"
      );
    });

    it('deve lançar um erro quando a consulta ao banco de dados falhar', async () => {
      const errorMock = new Error('Erro de consulta ao banco de dados');
      require('../src/config/database').runQuery.mockRejectedValue(errorMock);

      await expect(pedidoRepository.listagemFilas()).rejects.toThrow(errorMock);

      expect(runQuery).toHaveBeenCalledWith(
        'SELECT * FROM public.fila ORDER BY id ASC'
      );
    });

    it('deve lançar um erro quando a atualização da fila falhar', async () => {
      const id = 1;
      const status = 'novo status';
      const errorMock = new Error('Erro de atualização da fila');
      require('../src/config/database').runQuery.mockRejectedValueOnce(
        errorMock
      );

      await expect(
        pedidoRepository.trocarStatusFila(id, status)
      ).rejects.toThrow(errorMock);

      expect(runQuery).toHaveBeenCalledWith(
        `UPDATE public.fila SET status = '${status}' WHERE id = ${id} RETURNING *`
      );
    });

    it('deve lançar um erro quando a atualização do pedido falhar', async () => {
      const fila = { id: 1, status: 'novo status' };
      require('../src/config/database').runQuery.mockResolvedValueOnce([fila]);
      const errorMock = new Error('Erro de atualização do pedido');
      require('../src/config/database').runQuery.mockRejectedValueOnce(
        errorMock
      );

      await expect(
        pedidoRepository.trocarStatusFila(fila.id, fila.status)
      ).rejects.toThrow(errorMock);

      expect(runQuery).toHaveBeenNthCalledWith(
        1,
        `UPDATE public.fila SET status = '${fila.status}' WHERE id = ${fila.id} RETURNING *`
      );
      expect(runQuery).toHaveBeenNthCalledWith(
        2,
        `UPDATE public.pedido SET status = '${fila.status}' WHERE id = ${fila.id} RETURNING *`
      );
    });

    // Mais testes para trocarStatusFila...
  });

  it('deve chamar runQuery com a query correta para inserir o pedido na fila', async () => {
    const mockPedido = {
      id: 1,
      status: 'pronto',
      usuario: {
        id: 2,
        nome: 'Nome do Usuário',
        email: 'email@example.com',
        cpf: '123.456.789-00',
      },
      produto: [], // Ajuste conforme necessário
    };
    require('../src/config/database').runQuery.mockResolvedValue();

    await pedidoRepository.enviarParaFila(mockPedido);

    expect(runQuery).toHaveBeenCalledWith(
      `INSERT INTO public.fila(pedidoId, status, usuarioId) VALUES (${mockPedido.id}, ${mockPedido.status}, ${mockPedido.usuario.id})`
    );
  });

  it('deve lançar um erro se a inserção falhar', async () => {
    const mockPedido = {
      id: 1,
      status: 'pronto',
      usuario: {
        id: 2,
        nome: 'Nome do Usuário',
        email: 'email@example.com',
        cpf: '123.456.789-00',
      },
      produto: [], // Ajuste conforme necessário
    };
    const errorMock = new Error('Erro de inserção no banco de dados');
    require('../src/config/database').runQuery.mockRejectedValue(errorMock);

    await expect(pedidoRepository.enviarParaFila(mockPedido)).rejects.toThrow(
      errorMock
    );
  });
  //

  it('deve chamar runQuery com a query correta', async () => {
    const statusArray = ['recebido'];
    require('../src/config/database').runQuery.mockResolvedValue([]);

    await pedidoRepository.listarPorStatus(statusArray);

    expect(runQuery).toHaveBeenCalledWith(
      "SELECT * FROM public.pedido where status = 'recebido' order by updatedAt desc"
    );
  });

  it('deve lançar um erro se a consulta ao banco de dados falhar', async () => {
    const statusArray = ['recebido', 'pronto'];
    const errorMock = new Error('Erro de consulta ao banco de dados');
    require('../src/config/database').runQuery.mockRejectedValue(errorMock);

    await expect(pedidoRepository.listarPorStatus(statusArray)).rejects.toThrow(
      errorMock
    );
  });

  //

  it('deve buscar e listar pedidos corretamente', async () => {
    const mockPedidos = [
      { id: 1, status: 'RECEBIDO', usuarioId: 1, tempoEspera: 30, total: 100 },
    ];
    const mockPedidoProduto = [{ pedidoid: 1, produtoid: 1 }];
    const mockProduto = [{ id: 1, nome: 'Produto 1' }];

    require('../src/config/database').runQuery.mockResolvedValueOnce(
      mockPedidos
    ); // Para query de pedidos
    require('../src/config/database').runQuery.mockResolvedValueOnce(
      mockPedidoProduto
    ); // Para query de pedidoProduto
    require('../src/config/database').runQuery.mockResolvedValueOnce(
      mockProduto
    ); // Para query de produto

    const resultado = await pedidoRepository.listar();

    expect(runQuery).toHaveBeenCalledWith(
      `SELECT * FROM public.pedido where (status <> 'finalizado' and status <> 'Finalizado')`
    );
    expect(runQuery).toHaveBeenCalledWith(
      `SELECT * FROM public.pedidoproduto ORDER BY id ASC`
    );
    expect(runQuery).toHaveBeenCalledWith(
      `SELECT * FROM public.produto where id = 1`
    );
    expect(resultado).toEqual([
      {
        id: 1,
        status: 'RECEBIDO',
        usuarioId: 1,
        produtos: [mockProduto],
        tempoEspera: 30,
        total: 100,
      },
    ]);
  });

  it('deve lançar um erro se a consulta ao banco de dados falhar', async () => {
    const errorMock = new Error('Erro de consulta ao banco de dados');
    require('../src/config/database').runQuery.mockRejectedValue(errorMock);

    await expect(pedidoRepository.listar()).rejects.toThrow(errorMock);
  });

  // Testes para outros métodos...
});
