# TalkToon

Escreve uma frase, escolhe uma personagem e vê-a a dizê-la em voz alta, com
a boca sincronizada com a fala e a palavra atual destacada no balão.

## Ideia

- Web Speech API (`SpeechSynthesisUtterance`) para converter a frase em voz,
  com seletor de voz, velocidade e tom.
- A boca da personagem anima-se enquanto fala (loop de abertura/fecho) e o
  evento `onboundary` destaca a palavra que está a ser dita no balão de fala.
- Quatro personagens em SVG (robô, gata, alien, fantasma), cada uma com a
  sua própria cara, cores e pequenas animações idle (piscar de olhos, bob).
- 100% client-side: a frase nunca sai do browser, não há backend nem chaves
  de API — tudo corre com APIs nativas do browser.
- Interface traduzida em PT/EN/DE, incluindo os nomes das personagens e a
  frase de exemplo pré-preenchida.

## Executar

```bash
npm install
npm run dev
```

Abrir <http://127.0.0.1:5183>.

## Validar

```bash
npm run check
npm run build
```

## Ideias para evoluir

- Mais personagens e/ou permitir escolher a cor.
- Gravar/exportar a animação como vídeo ou GIF.
- Visemas mais realistas (mapear fonemas a formas de boca em vez de um
  loop aleatório).
