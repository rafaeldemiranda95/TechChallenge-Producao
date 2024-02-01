import express from 'express';
import { PedidoController } from '../adapter/driver/PedidoController';
import { UsuarioController } from '../adapter/driver/UsuarioController';
import { autenticacaoMiddleware } from '../adapter/middleware/autenticacao.middleware';
import { UsuarioUseCase } from '../core/domain/useCases/Usuario/UsuarioUseCase';
const router = express.Router();
const usuarioUseCase = new UsuarioUseCase();
router.get('/', (req, res) => {
  res.status(200).send('OK');
});

router.post('/autenticaUsuarioAdministrador', async (req, res) => {
  let email = req.body.email;
  let senha = req.body.senha;

  let usuarioController = new UsuarioController();
  await usuarioController.autenticaAdminstrador(email, senha, res);
});

router.post('/autenticaCliente', async (req, res) => {
  let cpf = req.body.cpf;
  let usuarioController = new UsuarioController();
  await usuarioController.autenticaCliente(cpf, res);
});

router.get(
  '/listarPedidos',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let pedidoController = new PedidoController();
    await pedidoController.listaPedidos(res);
  }
);

router.get(
  '/listarFilas',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let pedidoController = new PedidoController();
    await pedidoController.listaFilas(res);
  }
);

router.post(
  '/trocarStatusFila',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let id = req.body.id;
    let status = req.body.status;
    let pedidoController = new PedidoController();
    await pedidoController.trocarStatusFila(id, status, res);
  }
);
