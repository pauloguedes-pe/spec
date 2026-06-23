---
name: ship
description: Use when the user wants to build and review autonomously until the spec is fully satisfied. Triggers on "ship", "entregar", "construir e revisar", or any request to run the build→review loop without manual intervention.
---

# Ship — Loop autônomo build → review até aprovação

## Overview

Invoca o workflow programático `ship.js` que executa o loop build→review deterministicamente via Workflow tool. Não interpreta — orquestra.

## Como invocar

Quando o usuário executa `/ship <nome>`:

1. Extraia o nome da spec do argumento (ex: `autenticacao-google` de `/ship autenticacao-google`)
2. Se o nome não for informado, liste os arquivos em `specs/` e pergunte qual usar
3. Invoque o workflow via Workflow tool:

```js
Workflow({
  scriptPath: '/Users/<usuario>/.claude/workflows/ship.js',
  args: '<nome-da-spec>'
})
```

Use o path absoluto correto para o usuário atual (`~` não é expandido pelo Workflow tool — use o path real).

4. Aguarde o resultado. O workflow é autônomo — não interrompa durante a execução.

## Pré-requisito

A spec deve existir em `specs/<nome>.md` no diretório de trabalho atual (criada com `/spec`).

## Resultado

O workflow retorna:

```js
{
  approved: true | false,
  iterations: number,       // rodadas realizadas
  spec: 'specs/<nome>.md',
  history: [{ iteration, approved, failures }]
}
```

- `approved: true` → build concluída, todos os requisitos atendidos
- `approved: false` após 5 iterações → reporte ao usuário as falhas restantes e aguarde orientação
