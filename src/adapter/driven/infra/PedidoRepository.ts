import { ListagemPedidos } from '../../../core/domain/models/ListagemPedidos';
import { Pedido } from '../../../core/domain/models/Pedido';
import { IPedidoUseCase } from '../../../core/domain/useCases/Pedido/IPedidoUseCase';
import { runQuery } from './../../../config/database';
export class PedidoRepository implements IPedidoUseCase {
  async listagemFilas(): Promise<any> {
    try {
      let query = `SELECT * FROM public.fila ORDER BY id ASC`;
      let listaFila = await runQuery(query);
      // let listaFila = await prisma.fila.findMany();
      return listaFila;
    } catch (error: any) {
      console.log('error', error);
    }
  }
  async trocarStatusFila(id: number, status: string): Promise<void> {
    // recebido
    // em preparação
    // pronto
    // finalizado

    console.log('Troca Status Fila');
    try {
      let filaQuery = `UPDATE public.fila SET status = '${status}' WHERE id = ${id} RETURNING *`;
      let _fila = await runQuery(filaQuery);
      console.log('_fila  ==>>  ', _fila);
      if (_fila.length > 0) {
        let fila = _fila[0];
        let pedidoQuery = `UPDATE public.pedido SET status = '${status}' WHERE id = ${fila.id} RETURNING *`;
        let pedido = await runQuery(pedidoQuery);
        console.log('pedido  ==>>  ', pedido);
      }
    } catch (error: any) {
      console.log('error', error);
    }
  }
  async enviarParaFila(pedido: Pedido): Promise<void> {
    try {
      let query = `INSERT INTO public.fila(pedidoId, status, usuarioId) VALUES (${
        pedido.id ? pedido.id : 0
      }, ${pedido.status}, ${pedido.usuario.id})`;
      await runQuery(query);
    } catch (error: any) {
      console.log('error', error);
    }
  }
  async listarPorStatus(status: string[]): Promise<any> {
    try {
      let query = `SELECT * FROM public.pedido where status = '${status}' order by updatedAt desc`;
      let listaPedidos = await runQuery(query);
      // let listaPedidos = await prisma.pedido.findMany({
      //   orderBy: {
      //     updatedAt: 'desc',
      //   },
      //   where: {
      //     status: { in: status },
      //   },
      // });
      return listaPedidos;
    } catch (error: any) {
      console.log('error', error);
    }
  }
  async listar() {
    try {
      let query = `SELECT * FROM public.pedido where (status <> 'finalizado' and status <> 'Finalizado')`;
      let pedidos = await runQuery(query);
      let query2 = `SELECT * FROM public.pedidoproduto ORDER BY id ASC`;
      let pedidoProduto = await runQuery(query2);
      let pedidosObj: ListagemPedidos[] = [];
      let pedidosL = [...pedidos];
      console.log('pedidosL  ==>  ', pedidosL);
      for (let item of pedidosL) {
        if (item.status !== 'Finalizado') {
          let produtos: Array<any> = [];
          for (let item2 of pedidoProduto) {
            if (item.id == item2.pedidoid) {
              let query3 = `SELECT * FROM public.produto where id = ${item2.produtoid}`;
              let produto = await runQuery(query3);
              produtos.push(produto);
            }
          }
          pedidosObj.push({
            id: item.id,
            status: item.status,
            usuarioId: item.usuarioId ? item.usuarioId : 0,
            produtos: produtos,
            tempoEspera: item.tempoEspera ? item.tempoEspera : 0,
            total: item.total ? item.total : 0,
          });
        }
      }
      let pronto = pedidosObj.filter(
        (el) => el.status.toUpperCase() == 'PRONTO'
      );
      let recebido = pedidosObj.filter(
        (el) => el.status.toUpperCase() == 'RECEBIDO'
      );
      let emPreparação = pedidosObj.filter(
        (el) => el.status.toUpperCase() == 'EM PREPARAÇÃO'
      );
      let returnPedidosObj = pronto.concat(emPreparação, recebido);
      console.log('returnPedidosObj  ==>  ', returnPedidosObj);
      return returnPedidosObj;
      // return pedidosObj;
    } catch (error: any) {}
  }
}
