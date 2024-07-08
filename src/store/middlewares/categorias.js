import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  adicionarTodasAsCategorias,
  adicionarUmaCategoria,
  carregarCategorias,
  carregarUmaCategoria,
} from "store/reducers/categorias";
import criarTarefa from "./utils/criarTarefa";
import categoriasService from "services/categorias";

export const categoriasListener = createListenerMiddleware();

categoriasListener.startListening({
  actionCreator: carregarCategorias,
  effect: async (action, { dispatch, fork, unsubscribe }) => {
    const resposta = await criarTarefa({
      fork,
      dispatch,
      action: adicionarTodasAsCategorias,
      busca: categoriasService.buscar,
      textoCarregando: "Carregando categorias",
      textoSucesso: "Categorias carregadas com sucesso",
      textoErro: "Falha ao carregar categorias",
    });
    if (resposta.status === "ok") unsubscribe();
  },
});

categoriasListener.startListening({
  actionCreator: carregarUmaCategoria,
  effect: async (action, { dispatch, fork, getState, unsubscribe }) => {
    const { categorias } = getState();
    const nomeCategoria = action.payload;
    const categoriaCarregada = categorias.some(
      (categoria) => categoria.id === nomeCategoria
    );
    if (categoriaCarregada) return;
    if (categorias.length === 5) return unsubscribe();
    await criarTarefa({
      fork,
      dispatch,
      action: adicionarUmaCategoria,
      busca: () => categoriasService.buscarUmaCategoria(nomeCategoria),
      textoCarregando: `Carregando categoria ${nomeCategoria}`,
      textoSucesso: `Categoria ${nomeCategoria} carregada com sucesso`,
      textoErro: `Falha ao carregar ${nomeCategoria}`,
    });
  },
});
