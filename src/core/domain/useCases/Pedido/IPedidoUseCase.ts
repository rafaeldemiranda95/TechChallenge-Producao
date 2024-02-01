import { Pedido } from '../../models/Pedido';
export interface IPedidoUseCase {
  listar(): any;
  enviarParaFila(pedido: Pedido): Promise<void>;
  trocarStatusFila(id: number, status: string): Promise<void>;
  listagemFilas(): Promise<any>;
}
