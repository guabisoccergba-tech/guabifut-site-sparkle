# Sorteio da costela entre os mensalistas

Um sorteio simples, com um único ganhador, feito por você em uma página protegida por login de administrador. Os participantes vêm da agenda: são os times que têm horário fixo mensal.

## Situação atual (verificada)

- O site hoje é institucional: as páginas de agenda, reservas, promoções e o painel de administração ainda **não existem** como telas.
- A base de dados das reservas já está criada (quadras, horários, bloqueios, promoções, reservas, clientes e administradores), mas **ainda não há nenhuma reserva nem nenhum cliente cadastrado** (0 registros).
- Não existe hoje nenhuma marcação de "mensalista" — a agenda ainda não distingue reserva avulsa de horário fixo mensal.

Ou seja: para o sorteio puxar da agenda, primeiro a agenda precisa saber quem é mensalista.

## O que será feito

### 1. Marcar mensalistas na agenda
Cada reserva passa a poder ser marcada como **horário mensal fixo** (time, telefone, quadra, dia da semana e horário). Quem tem essa marcação ativa entra automaticamente na lista de mensalistas.

Você poderá cadastrar e editar esses horários fixos direto no painel, sem depender de o cliente reservar pelo site — assim o sorteio já funciona com a sua lista real de times.

### 2. Página de sorteio (só para administrador)
Uma página protegida por login, com:
- Lista dos mensalistas ativos que vão participar, mostrando time, quadra e horário fixo;
- Possibilidade de desmarcar alguém que não deve participar daquele sorteio;
- Nome do prêmio (ex.: "Costela") e a data;
- Botão **Sortear**, com uma animação curta embaralhando os nomes até parar no ganhador;
- Resultado destacado na tela, com botão para copiar o texto do resultado e enviar no WhatsApp ou postar nas redes.

### 3. Registro dos sorteios
Cada sorteio realizado fica guardado (prêmio, data, quem participou e quem ganhou), para você consultar depois e comprovar o resultado. Nada disso aparece para o público.

## O que fica para depois

Esta entrega cobre a marcação de mensalistas, o sorteio e o histórico. As telas de agenda pública, promoções e reserva online seguem no plano anterior, ainda pendentes.

## Detalhes técnicos

- Migração: coluna `is_monthly boolean default false` + `monthly_active boolean default true` em `bookings`; nova tabela `raffles` (título/prêmio, data, ganhador, criado_por) e `raffle_entries` (sorteio, nome, telefone, quadra, horário, ganhador bool). GRANTs para `authenticated`/`service_role`; RLS liberando apenas `has_role(auth.uid(),'admin')`. Sem acesso `anon`.
- Servidor: novas funções em `src/lib/admin.functions.ts` — `adminListMonthly`, `adminSaveMonthly`, `adminRunRaffle` (sorteio feito **no servidor**, com `crypto.getRandomValues`, gravando participantes e ganhador de forma imutável), `adminListRaffles`. Todas com `requireSupabaseAuth` + checagem de papel admin.
- Rotas: `src/routes/_authenticated/admin/sorteio.tsx` e `src/routes/_authenticated/admin/mensalistas.tsx`, sob o layout protegido (criado junto com a primeira rota protegida, se ainda não existir), mais `src/routes/auth.tsx` pública para login por e-mail/senha do administrador.
- `src/start.ts`: registrar `attachSupabaseAuth` em `functionMiddleware`, necessário para as funções protegidas.
- Dados carregados com TanStack Query; nenhuma alteração nas páginas públicas existentes; sem links novos no menu público (acesso pelo endereço direto).
