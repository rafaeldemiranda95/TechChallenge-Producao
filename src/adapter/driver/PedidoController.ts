import { Response } from 'express';
import { PedidoUseCase } from '../../core/domain/useCases/Pedido/PedidoUseCase';
export class PedidoController {
  async listaPedidos(res: Response) {
    let pedidos = await new PedidoUseCase().listarPedidos();
    res.status(200).send(pedidos);
  }
  async listaFilas(res: Response) {
    let filas = await new PedidoUseCase().listaFilas();
    res.status(200).send(filas);
  }
  async trocarStatusFila(id: number, status: string, res: Response) {
    await new PedidoUseCase().trocarStatusFila(id, status);
    res.status(200).send('Status da fila trocado com sucesso!');
  }
}
