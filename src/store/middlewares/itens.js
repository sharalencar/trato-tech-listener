import { createListenerMiddleware } from "@reduxjs/toolkit";
import { carregarUmaCategoria } from "store/reducers/categorias";
import criarTarefa from "./utils/criarTarefa";
import itensService from "services/itens";
import { adicionarItens } from "store/reducers/itens";

export const itensListener = createListenerMiddleware();

itensListener.startListening({
  actionCreator: carregarUmaCategoria,
  effect: async (action, { fork, dispatch, getState, unsubscribe }) => {
    const nomeCategoria = action.payload;
    const { itens } = getState();
    if (itens.length === 25) return unsubscribe();
    const itensCarregados = itens.some(
      (item) => item.categoria === nomeCategoria
    );
    if (itensCarregados) return;

    await criarTarefa({
      fork,
      dispatch,
      action: adicionarItens,
      busca: () => itensService.buscarDeCategorias(nomeCategoria),
      textoCarregando: `Carregando itens de ${nomeCategoria}`,
      textoSucesso: "Itens carregados com sucesso",
      textoErro: "Falha ao carregar itens",
    });
  },
});
