import { PedidoRepository } from '../../../../adapter/driven/infra/PedidoRepository';
import { ListagemPedidos } from '../../../domain/models/ListagemPedidos';
import { Pedido } from '../../../domain/models/Pedido';

export class PedidoUseCase {
  private pedidoRepository: PedidoRepository;

  constructor(pedidoRepository: PedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async listarPedidos(): Promise<ListagemPedidos[]> {
    return this.pedidoRepository.listar();
  }

  async listaFilas(): Promise<any> {
    // Aqui você pode especificar um tipo de retorno mais preciso se disponível
    return this.pedidoRepository.listagemFilas();
  }

  async trocarStatusFila(id: number, status: string): Promise<void> {
    await this.pedidoRepository.trocarStatusFila(id, status);
  }

  async listaPedidosPorStatus(status: string[]): Promise<Pedido[]> {
    return this.pedidoRepository.listarPorStatus(status);
  }
}
