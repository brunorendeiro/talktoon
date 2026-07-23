# AGENTS.md

## Objetivo

Este projeto contém exclusivamente a app TalkToon, personagens SVG que
falam frases escritas pelo utilizador via Web Speech API.

## Regras

- Manter a app 100% client-side: sem backend, sem base de dados, sem envio
  da frase do utilizador para lado nenhum.
- A animação da boca (`src/Face.tsx`) usa `ry`/`rx` de uma elipse com
  transição CSS, não morphing de paths — manter essa simplicidade ao
  adicionar personagens novas.
- `src/i18n.ts` cobre também os nomes das personagens (`kindLabel`) e a
  frase por omissão (`defaultText`); qualquer novo texto visível tem de
  entrar no dicionário PT/EN/DE, não pode ficar hardcoded.
- Não colocar aqui código do portfólio ou de outras aplicações.

## Validação

```bash
npm run check
npm run build
```
