# Glass Theme Guide

Guia rápido para aplicar e ajustar o visual glass do projeto com inspiração nos materiais da Apple.

## Objetivo

O tema glass deve transmitir:

- profundidade
- hierarquia visual
- leveza
- legibilidade em qualquer tema
- sensação de interface viva, sem poluir o conteúdo

## Stack visual do projeto

Hoje o projeto mistura três camadas principais:

- `shadcn/ui` + Radix para a maior parte da estrutura e dos controles
- Ant Design em pontos específicos onde o fluxo já é mais complexo, como `Modal` e `Upload`
- componentes glass próprios do projeto para reforçar a identidade visual

Componentes que existem em `src/shared/components` e valem como referência:

- `ui/dialog.tsx`
- `ui/alert-dialog.tsx`
- `ui/card.tsx`
- `ui/popover.tsx`
- `ui/button.tsx`
- `ui/input.tsx`
- `ui/glass-card.tsx`
- `ui/glass-button.tsx`
- `ConfirmationDialog.tsx`
- `ImageUpdateDialog.tsx`
- `ImageUpload.tsx`

Regra prática:

- use shadcn/Radix como padrão para componentes de estrutura
- use Ant Design quando o fluxo já pede um controle mais rico e o projeto já tiver o padrão ali
- use os componentes glass próprios para destacar ações ou superfícies de maior valor visual

## O que a Apple prioriza

Com base na documentação oficial da Apple sobre materiais e Liquid Glass:

- o material deve ser semântico, não apenas decorativo
- blur, vibrancy e blending devem ajudar na hierarquia, não virar efeito por estética
- o conteúdo por trás do vidro deve continuar percebido
- superfícies mais espessas ajudam na legibilidade
- superfícies mais finas preservam contexto
- cores vibrantes e contraste consistente são mais importantes do que “branco translúcido”

Links oficiais:

- [Apple HIG - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple - Applying Liquid Glass to custom views](https://developer.apple.com/documentation/SwiftUI/Applying-Liquid-Glass-to-custom-views)
- [Apple Design Resources](https://developer.apple.com/design/resources/)

## Regras práticas para o projeto

### 1. Evite borda branca pura no light mode

Uma borda branca muito forte funciona no dark mode, mas costuma ficar dura no tema claro.

Use preferencialmente:

- cinzas translúcidos
- bordas com baixa saturação
- opacidade moderada
- sombras suaves para separar da página

### 2. Centralize o vidro em tokens

O ideal é continuar usando variáveis globais para não espalhar valores pela UI.

Tokens que importam no projeto:

- `--background`
- `--card`
- `--popover`
- `--border`
- `--input`
- `--glass-surface`
- `--glass-border`
- `--glass-shadow`
- `--outline-button-*`

Se uma superfície parecer “muito branca”, ajuste primeiro o token, não o componente isolado.

### 3. Use materiais por intenção

Sugestão de uso:

- `glass-surface`: cards e blocos comuns
- `glass-surface-strong`: painéis que precisam de mais separação
- `liquid-glass`: superfícies principais com blur mais visível
- `liquid-glass-light`: botões e chips com aparência mais sutil

### 4. Contraste sempre vem antes do efeito

Glass bonito sem contraste vira ruído visual.

Checklist de legibilidade:

- texto principal deve ter contraste forte
- labels secundários podem ser mais suaves, mas ainda legíveis
- bordas não devem competir com o conteúdo
- botões precisam parecer clicáveis mesmo sem hover

### 5. Prefira profundidade sutil

O efeito Apple funciona melhor quando a interface parece composta por camadas reais:

- fundo com gradiente ou textura suave
- superfície glass com blur
- borda sutil
- sombra discreta
- um destaque leve no topo ou no canto

## Direção visual recomendada

Para este projeto, o melhor caminho é um glass mais próximo de “Apple-like” do que de “neon frosted”.

Características desejadas:

- superfícies claras, mas não opacas
- bordas finas e discretas
- sombras suaves
- blur controlado
- acentos coloridos usados com moderação
- sensação premium e limpa

## O que evitar

- borda branca forte em componentes claros
- blur exagerado que dificulta leitura
- muitos tons diferentes de glass no mesmo painel
- contraste baixo entre fundo, card e texto
- misturar vários estilos de vidro sem semântica clara
- introduzir um novo estilo de vidro sem antes verificar se o projeto já tem um equivalente em `ui/` ou AntD

## Checklist antes de aprovar uma nova tela

- o componente ainda lê bem no light mode?
- o componente continua bonito no dark mode?
- a borda está suave e coerente com o fundo?
- o blur melhora ou atrapalha a leitura?
- existe hierarquia entre título, conteúdo e ações?
- o componente usa tokens globais em vez de valores avulsos?
- o componente segue a biblioteca certa para o caso de uso, ou está criando um padrão novo sem necessidade?

## Ajustes comuns no código

Quando algo estiver “duro” demais no tema claro, normalmente vale revisar:

- `globals.css`
- `Card`
- `DialogContent`
- `PopoverContent`
- `Button` outline/ghost
- inputs com borda muito forte

Se a tela estiver muito “pesada” visualmente, vale observar também:

- se o efeito glass do componente custom está competitivo com o conteúdo
- se um componente AntD está brigando com os tokens globais do shadcn
- se há um uso repetido de `border-white/*` que deveria virar token

## Referências

- [Apple HIG - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple HIG - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Apple - Applying Liquid Glass to custom views](https://developer.apple.com/documentation/SwiftUI/Applying-Liquid-Glass-to-custom-views)
- [Apple Design Resources](https://developer.apple.com/design/resources/)

## Nota para manutenção

Se for preciso ajustar o visual glass no futuro, comece pelos tokens globais antes de mexer em componentes específicos. Isso mantém consistência e evita que cada tela “invente” uma versão própria de glass.

Quando houver dúvida entre shadcn e AntD, prefira manter a consistência da tela:

- se a seção já é majoritariamente shadcn, tente manter shadcn
- se o fluxo já usa AntD para uma interação específica, reaproveite o mesmo padrão
- se for um destaque visual, considere `glass-card` ou `glass-button` antes de inventar um novo estilo
