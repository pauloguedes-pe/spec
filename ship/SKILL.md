---
name: ship
description: Use when the user wants to build and review autonomously until the spec is fully satisfied. Triggers on "ship", "entregar", "construir e revisar", or any request to run the build→review loop without manual intervention.
---

# Ship — Loop autônomo build → review até aprovação

## Overview

Execute /build, depois /review, corrija as falhas e repita — sem interromper — até que a revisão aprove 100% dos requisitos. Só pare quando a build estiver aprovada ou ao atingir o limite de iterações.

## Processo

```dot
digraph ship_flow {
    "Usuário executa /ship <nome>" [shape=doublecircle];
    "Leia specs/<nome>.md" [shape=box];
    "Iteração <= 5?" [shape=diamond];
    "ERRO: limite atingido — reporte estado atual" [shape=box];
    "Execute /build com a spec" [shape=box];
    "Execute /review contra a spec" [shape=box];
    "Review APROVADO?" [shape=diamond];
    "CONCLUÍDO — build aprovada" [shape=doublecircle];
    "Aplique as correções do review" [shape=box];

    "Usuário executa /ship <nome>" -> "Leia specs/<nome>.md";
    "Leia specs/<nome>.md" -> "Iteração <= 5?";
    "Iteração <= 5?" -> "ERRO: limite atingido — reporte estado atual" [label="não"];
    "Iteração <= 5?" -> "Execute /build com a spec" [label="sim"];
    "Execute /build com a spec" -> "Execute /review contra a spec";
    "Execute /review contra a spec" -> "Review APROVADO?";
    "Review APROVADO?" -> "CONCLUÍDO — build aprovada" [label="sim"];
    "Review APROVADO?" -> "Aplique as correções do review" [label="não"];
    "Aplique as correções do review" -> "Iteração <= 5?";
}
```

## Invocação obrigatória das skills

A cada etapa do loop, **use o Skill tool** para invocar as skills correspondentes — não execute a lógica inline:

- **Build:** invoque a skill `build` via Skill tool com o nome da spec
- **Review:** invoque a skill `review` via Skill tool com o nome da spec

Isso garante que cada etapa siga rigorosamente as regras da skill correspondente.

## Regras do loop

- **Não interrompa para perguntar.** Qualquer ambiguidade deve ser resolvida lendo a spec. Só interrompa se a spec for genuinamente contraditória.
- **Cada iteração começa com o /review anterior.** As correções listadas no review são o único input para a próxima rodada de build.
- **Não adicione nada além das correções.** A build de correção implementa exatamente o que o review listou, nada mais.
- **Limite: 5 iterações.** Se não aprovado após 5 rodadas, pare, reporte o estado atual e as falhas restantes, e aguarde orientação do usuário.

## Como aplicar correções entre iterações

Após um review REPROVADO:

1. Liste as falhas em ordem de dependência (resolva dependências primeiro)
2. Implemente cada correção conforme descrita no review — sem interpretação livre
3. Não altere código não mencionado nas correções
4. Invoque a skill `review` novamente via Skill tool

## Saída ao concluir

```
## Ship: CONCLUÍDO ✓

Spec: specs/<nome>.md
Iterações necessárias: <N>

### Resultado do review final
- [x] <Requisito 1>
- [x] <Requisito 2>
- ...

### Definição de concluído
- [x] <Critério 1>
- [x] <Critério 2>
- ...

Build aprovada após <N> iteração(ões).
```

## Saída ao atingir o limite

```
## Ship: LIMITE ATINGIDO ✗

Spec: specs/<nome>.md
Iterações realizadas: 5

### Falhas ainda abertas
- [ ] <Requisito que não foi resolvido> — <motivo>
- ...

### Itens aprovados
- [x] <Requisito aprovado>
- ...

Intervenção necessária. Revise a spec ou as falhas acima antes de continuar.
```

## Rastreamento por iteração

A cada iteração, registre internamente:

| Iteração | Status | Falhas restantes |
|---|---|---|
| 1 | REPROVADO | N falhas |
| 2 | REPROVADO | M falhas |
| ... | ... | ... |
| N | APROVADO | 0 |

Inclua esse histórico na saída final para que o usuário entenda quantas rodadas foram necessárias.
