# Agenda de Reservas + Promoções com Desconto Automático

Hoje o GuabiSoccer é um site institucional e as reservas acontecem só por WhatsApp. Este plano constrói o sistema de reservas online completo, com painel de administração e uma aba de Promoções que mostra apenas os horários com desconto.

## O que será construído

### 1. Backend (Lovable Cloud)
Banco de dados, login e regras de segurança. Sem contas externas.

Cadastros:
- **Quadras** — nome, tipo (society, areia, poliesportiva), foto, descrição, **valor por hora**, duração do slot (60/90 min), ativa sim/não.
- **Horários de funcionamento** — por quadra e por dia da semana (abre/fecha), respeitando a regra atual: Seg–Sex 17:30–22:30, Sáb 08:00–10:30, Dom fechado.
- **Bloqueios** — datas/horários indisponíveis (manutenção, evento).
- **Promoções** — a flag pedida: quadra + dia da semana ou data específica + faixa de horário + **% de desconto** + período de validade + ativa sim/não.
- **Reservas** — quadra, data, horário, cliente (nome, telefone, e-mail), valor cheio, % de desconto aplicado, valor final, status (pendente/confirmada/cancelada).

### 2. Login
- Cliente: cadastro/login por e-mail e senha, para ver e gerenciar suas reservas.
- Admin: mesma conta, com papel de administrador guardado separadamente (tabela de papéis), liberando o painel.

### 3. Aba AGENDA (cliente)
- Seletor de data e lista de quadras.
- Grade de horários gerada a partir do funcionamento da quadra, marcando **Livre / Reservado / Bloqueado**.
- Horário com promoção ativa aparece com selo de desconto, preço antigo riscado e preço novo.
- Ao escolher um horário livre: resumo com valor cheio, desconto e total, confirmação da reserva e mensagem de sucesso. Opção de avisar a GuabiSoccer pelo WhatsApp com o resumo já preenchido.

### 4. Aba PROMOÇÕES (cliente)
Mesma estrutura visual da Agenda, porém filtrando **apenas** os horários livres que estão dentro de uma promoção ativa. Reserva feita direto dali, já com o valor reduzido.

### 5. Painel ADMIN
- **Quadras** — criar, editar, ativar/desativar, definir valor por hora.
- **Horários** — grade de funcionamento por quadra.
- **Promoções** — criar a flag: escolher quadra(s), dias/datas, faixa de horário, % de desconto, validade, ligar/desligar. Ao ligar, os horários livres correspondentes passam a aparecer em Promoções com o preço já descontado.
- **Reservas** — lista por data, confirmar, cancelar, ver contato do cliente.
- **Bloqueios** — bloquear horários manualmente.

### 6. Regras de preço
- Preço base = valor por hora da quadra (definido no cadastro).
- Se houver promoção ativa para aquela quadra/dia/horário, o desconto é aplicado automaticamente — sem digitar cupom.
- Havendo mais de uma promoção válida, vale o maior desconto.
- O valor final é sempre recalculado no servidor no momento da reserva (o preço enviado pelo navegador nunca é aceito).

## Detalhes técnicos

- Lovable Cloud (Postgres) com RLS: leitura pública apenas de quadras, horários, bloqueios e promoções ativas; reservas visíveis só ao dono e ao admin; escrita em cadastros e promoções restrita ao admin.
- Papel de admin em tabela `user_roles` separada + função `has_role` (security definer). Nunca no perfil do usuário.
- Rotas novas: `/agenda`, `/promocoes`, `/minhas-reservas`, `/auth`, e `/admin/*` sob layout protegido `_authenticated`.
- Server functions (`createServerFn`) para: listar disponibilidade com preço calculado, criar reserva (com verificação de conflito e recálculo de preço), e operações do admin com checagem de papel.
- Conflito de reserva evitado com restrição de unicidade no banco (quadra + data + horário para reservas não canceladas).
- TanStack Query nos loaders; cada rota nova com seu próprio `head()` para SEO.
- Header ganha os links Agenda e Promoções; o botão de WhatsApp continua no site.

## Ordem de execução

1. Ativar Lovable Cloud e criar o banco (tabelas, papéis, RLS, permissões).
2. Login/cadastro e layout protegido.
3. Painel admin: quadras, horários, bloqueios.
4. Aba Agenda com preço e reserva funcionando.
5. Promoções: cadastro no admin + cálculo de desconto + aba Promoções.
6. Minhas Reservas e gestão de reservas no admin.

## Fora deste escopo

- Pagamento online (o acerto continua no local/PIX).
- Cupom digitável — o desconto é automático pelo horário, conforme definido.
