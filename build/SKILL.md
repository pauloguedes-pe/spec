---
name: build
description: Use when the user wants to implement something described in a spec file. Triggers on "build", "construir", "implementar", or any request to execute a spec from specs/<nome>.md.
---

# Build — Construir a partir da especificação

## Overview

Leia a spec, construa exatamente o que ela descreve, nada mais. Ao terminar, liste os requisitos atendidos para facilitar a revisão.

## Processo

```dot
digraph build_flow {
    "Usuário executa /build" [shape=doublecircle];
    "Nome da spec informado?" [shape=diamond];
    "Liste specs disponíveis e pergunte" [shape=box];
    "Leia specs/<nome>.md" [shape=box];
    "Spec existe e está completa?" [shape=diamond];
    "Informe o problema e pare" [shape=box];
    "Construa exatamente o que a spec descreve" [shape=box];
    "Liste requisitos atendidos" [shape=box];
    "Concluído" [shape=doublecircle];

    "Usuário executa /build" -> "Nome da spec informado?";
    "Nome da spec informado?" -> "Liste specs disponíveis e pergunte" [label="não"];
    "Liste specs disponíveis e pergunte" -> "Leia specs/<nome>.md";
    "Nome da spec informado?" -> "Leia specs/<nome>.md" [label="sim"];
    "Leia specs/<nome>.md" -> "Spec existe e está completa?" ;
    "Spec existe e está completa?" -> "Informe o problema e pare" [label="não"];
    "Spec existe e está completa?" -> "Construa exatamente o que a spec descreve" [label="sim"];
    "Construa exatamente o que a spec descreve" -> "Liste requisitos atendidos";
    "Liste requisitos atendidos" -> "Concluído";
}
```

## Regras durante a construção

- **Construa apenas o que está na spec.** Nenhum requisito implícito, nenhuma melhoria não solicitada.
- **Não refatore código irrelevante.** Se algo fora do escopo da spec parecer errado, ignore ou mencione ao final — nunca mude.
- **Não adicione funcionalidades extras.** "Enquanto estou aqui" não existe.
- **Não invente casos extremos não descritos.** Implemente apenas os listados na spec.
- **Se algo na spec for ambíguo**, pare e pergunte antes de interpretar livremente.

## Saída ao concluir

Ao terminar, exiba obrigatoriamente:

```
## Requisitos atendidos

- [x] <Requisito 1 exatamente como na spec>
- [x] <Requisito 2>
- ...

## Definição de concluído

- [x] <Critério verificável 1>
- [x] <Critério verificável 2>
- ...
```

Se algum item não foi atendido, marque com `[ ]` e explique o motivo em uma linha.

## Erros comuns

| Tentação | O que fazer |
|---|---|
| "Vou aproveitar e melhorar X" | Não. Foque na spec. |
| "A spec não menciona validação, mas faz sentido adicionar" | Só adicione se estiver na spec. |
| "Esse trecho parece errado, vou refatorar" | Mencione ao final, não toque. |
| "Vou interpretar esse requisito ambíguo da forma mais completa" | Pare e pergunte. |
