import { Response } from 'express';
import { PedidoUseCase } from '../../core/domain/useCases/Pedido/PedidoUseCase';

export class PedidoController {
  private pedidoUseCase: PedidoUseCase;

  constructor(pedidoUseCase: PedidoUseCase) {
    this.pedidoUseCase = pedidoUseCase;
  }

  async listaPedidos(res: Response) {
    try {
      let pedidos = await this.pedidoUseCase.listarPedidos();
      res.status(200).send(pedidos);
    } catch (error) {
      throw error;
    }
  }

  async listaFilas(res: Response) {
    try {
      let filas = await this.pedidoUseCase.listaFilas();
      res.status(200).send(filas);
    } catch (error) {
      throw error;
    }
  }

  async trocarStatusFila(id: number, status: string, res: Response) {
    try {
      await this.pedidoUseCase.trocarStatusFila(id, status);
      res.status(200).send('Status da fila trocado com sucesso!');
    } catch (error) {
      throw error;
    }
  }
}
