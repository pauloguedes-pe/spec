# claude-skills

Skills pessoais para o Claude Code que implementam um ciclo completo de desenvolvimento orientado por especificação.

## Skills disponíveis

| Comando | O que faz |
|---|---|
| `/spec` | Entrevista sobre o que construir e salva a especificação em `specs/<nome>.md` |
| `/build` | Lê `specs/<nome>.md` e constrói exatamente o que está descrito |
| `/review` | Compara a build com a spec requisito por requisito e lista falhas com correções |
| `/ship` | Executa `/build` → `/review` em loop autônomo até aprovação total (máx. 5 iterações) |

## Fluxo de uso

```
/spec    →   /build   →   /review   →   /build (se necessário)   →   /review ...
              \_______________________________/
                     (ou use /ship para automatizar)
```

## Instalação

Copie as pastas para o diretório de skills do Claude Code:

```bash
cp -r spec build review ship ~/.claude/skills/
```

## Princípios

- **Sem surpresas:** o que está na spec é o que é construído, nada mais
- **Revisão objetiva:** cada falha cita o requisito exato e a correção necessária
- **Loop autônomo:** `/ship` não interrompe para perguntar — só para se a spec for contraditória ou após 5 iterações sem aprovação
