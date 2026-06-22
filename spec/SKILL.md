---
name: spec
description: Use when the user wants to define what to build before building it — a feature, app, module, or integration. Triggers on "spec", "especificação", "o que construir", or any request to plan before coding.
---

# Spec — Especificação antes de construir

## Overview

Entreviste o usuário uma pergunta por vez. Antes de salvar, faça uma checagem obrigatória dos 5 pontos. Só grava o arquivo quando todos estiverem cobertos. Não comece a construir.

## Processo

```dot
digraph spec_flow {
    "Usuário pede /spec" [shape=doublecircle];
    "Todos os 5 pontos cobertos?" [shape=diamond];
    "Faça UMA pergunta sobre o ponto faltante" [shape=box];
    "Escreva rascunho da spec" [shape=box];
    "Checagem: algum ponto vago ou incompleto?" [shape=diamond];
    "Faça UMA pergunta de esclarecimento" [shape=box];
    "Salve em specs/<nome>.md" [shape=box];
    "Confirme com o usuário" [shape=box];
    "Concluído" [shape=doublecircle];

    "Usuário pede /spec" -> "Todos os 5 pontos cobertos?";
    "Todos os 5 pontos cobertos?" -> "Faça UMA pergunta sobre o ponto faltante" [label="não"];
    "Faça UMA pergunta sobre o ponto faltante" -> "Todos os 5 pontos cobertos?";
    "Todos os 5 pontos cobertos?" -> "Escreva rascunho da spec" [label="sim"];
    "Escreva rascunho da spec" -> "Checagem: algum ponto vago ou incompleto?";
    "Checagem: algum ponto vago ou incompleto?" -> "Faça UMA pergunta de esclarecimento" [label="sim"];
    "Faça UMA pergunta de esclarecimento" -> "Checagem: algum ponto vago ou incompleto?";
    "Checagem: algum ponto vago ou incompleto?" -> "Salve em specs/<nome>.md" [label="não"];
    "Salve em specs/<nome>.md" -> "Confirme com o usuário";
    "Confirme com o usuário" -> "Concluído";
}
```

## Os 5 pontos obrigatórios (um por vez, na ordem que fizer sentido)

1. **Objetivo** — O que isso faz e para quem? Qual problema resolve?
2. **Requisitos indispensáveis** — O que DEVE existir para considerar isso feito? (liste cada um)
3. **Restrições** — Stack, ambiente, integrações existentes, limites de tempo?
4. **Casos extremos** — O que pode dar errado? Dados inválidos, permissão negada, serviço fora do ar?
5. **Definição de concluído** — Como alguém verifica, sem ambiguidade, que está pronto?

**Checagem antes de salvar:** revise mentalmente cada um dos 5 pontos. Se qualquer um estiver vago, ausente ou não verificável, faça mais uma pergunta antes de salvar.

## Formato da spec (specs/<nome>.md)

```markdown
# <Nome do Recurso>

## Objetivo
<Uma ou duas frases: o que faz, para quem, qual problema resolve.>

## Requisitos
- <Requisito 1 — concreto e verificável>
- <Requisito 2>
- ...

## Restrições
- <Restrição 1>
- ...

## Casos extremos
- <Situação limite 1 e comportamento esperado>
- <Situação limite 2>
- ...

## Definição de concluído
- [ ] <Critério verificável 1>
- [ ] <Critério verificável 2>
- ...
```

## Regras

- **Uma pergunta por vez.** Nunca faça lista de perguntas.
- **Checagem obrigatória antes de salvar.** Não salve se qualquer ponto estiver vago.
- **Não comece a construir** até a spec estar salva e confirmada.
- **Não invente requisitos.** Se não foi dito, pergunte.
- **Salve em `specs/<nome>.md`** no diretório de trabalho atual. Crie a pasta `specs/` se não existir.
- O nome do arquivo deve ser kebab-case: `specs/autenticacao-google.md`, `specs/relatorio-mensal.md`.

## Erros comuns

| Erro | Consequência |
|---|---|
| Salvar sem cobrir todos os 5 pontos | A spec fica incompleta; /build vai inventar requisitos |
| Definição de concluído vaga | /review não consegue verificar se a build passou |
| Casos extremos ignorados | Bugs previsíveis chegam à revisão |
