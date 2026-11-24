# Tasks

## 1. Banco

- [x] 1.1 Migração com a tabela `charges` (convite, dono, origem `pix`/`cortesia`/`transicao`, valor em centavos, situação, id da order do Mercado Pago `unique`, QR code, copia e cola, vencimento, pago em), RLS de leitura só para o dono e sem escrita pelo cliente (verificar num banco de teste: outro cliente não lê, cliente não insere)
- [x] 1.2 Na mesma migração, `paid_at`, `expires_at` e o estado `archived` em `invitations`; revogar `update (status, html_template)` do cliente; gatilho de inserção que força rascunho, copia o HTML do modelo escolhido e zera validade (verificar: cliente que insere com `status = 'published'` ou HTML próprio fica com rascunho e HTML do modelo)
- [x] 1.3 Na mesma migração, cadastro aberto: políticas de criar e editar convites e de ler modelos sem `is_allowed` (editar só rascunho ou publicado, nunca arquivado) e `can_create_invitations` verdadeiro para qualquer conta (verificar: conta sem liberação cria rascunho e lê modelo "todos"; não lê modelo restrito; não edita arquivado)
- [x] 1.4 Na mesma migração, funções `security definer` só para a chave de serviço: publicar (cobrança paga ou cortesia), com validade = fim do dia em Brasília de `max(festa, pagamento) + 7 dias`; gatilho que recalcula ao mudar a data da festa, limitado a `paid_at + 90 dias` (verificar com os cenários da spec: 1/12 → 27/12; adiada para 27/12 → 3/1; adiada para 30/4 → 1/3)
- [x] 1.5 Na mesma migração, leitura pública e confirmação exigem convite publicado e dentro da validade; `pg_cron` diário arquiva os vencidos; convites já publicados recebem `expires_at` de transição (verificar: convite vencido não é lido por anônimo nem recebe confirmação; transição dá pelo menos 7 dias)

## 2. Regras em código, com testes antes

- [x] 2.1 `src/lib/pricing.ts` com preço em centavos e `expiryFor(eventDate, paidAt)` espelhando a regra do banco, com testes dos três cenários de validade (verificar com `npm run check`)
- [x] 2.2 Marca no `render.ts`: modo `draft` ("PRÉVIA", botões desativados com o aviso) e `archived` ("ENCERRADO"), injetada fora do HTML do modelo, com testes (verificar: prévia de rascunho contém a marca e não tem `rsvpUrl`; convite publicado não tem marca)
- [x] 2.3 `src/lib/mercado-pago.ts`: montar a order Pix, ler QR code e copia e cola da resposta e conferir se a order está paga com valor e referência certos, com testes sobre respostas de exemplo (verificar com `npm run check`)
- [x] 2.4 Validação da assinatura `x-signature` do webhook, com testes de assinatura válida, inválida e expirada (verificar com `npm run check`)

## 3. Cobrança e publicação no servidor

- [ ] 3.1 Cliente Supabase de serviço só no servidor, lendo `SUPABASE_SECRET_KEY`, e chamadas à API de Orders lendo `MERCADOPAGO_ACCESS_TOKEN`; `.env.example` atualizado (verificar: `npm run build` passa e nenhum desses nomes aparece no código do navegador)
- [x] 3.2 Server action "Gerar Pix": confere dono e dados completos, reaproveita cobrança em aberto, cria a order com `X-Idempotency-Key` e grava a cobrança (verificar no backend de teste: segundo pedido devolve a mesma cobrança)
- [x] 3.3 Rota `POST /api/pagamentos/webhook`: valida assinatura, busca a order no Mercado Pago, publica uma vez só (verificar: aviso sem assinatura é recusado; aviso repetido não muda a validade)
- [x] 3.4 Conferência ativa: a tela de pagamento consulta a cobrança e, se pendente, o servidor pergunta ao Mercado Pago (verificar: publicação acontece mesmo sem o webhook)
- [x] 3.5 Cortesia: action do admin que confere `is_admin` e publica pela função com origem `cortesia` (verificar: cliente comum recebe recusa)
- [ ] 3.6 `/c/[slug]` mostra "Este convite foi encerrado" para convite arquivado ou vencido, e `/api/rsvp` recusa (verificar abrindo um convite vencido no backend de teste)

## 4. Telas

- [ ] 4.1 Gestão do convite: no rascunho, "Publicar por R$ 5,00" com a validade calculada; painel do Pix com QR code, copiar código, espera e sucesso; publicado mostra "Ativo até dd/mm. Compartilhe o link quantas vezes quiser." (verificar em 390 px e 1280 px, temas claro e escuro)
- [ ] 4.2 Convite arquivado: prévia com "ENCERRADO", presenças só leitura, sem editar e compartilhar, botão "Reativar por R$ 5,00" (verificar visualmente)
- [ ] 4.3 Admin: botão "Publicar sem cobrar" na gestão do convite; "Clientes" sai do menu; `/novo` sem aviso de conta não autorizada (verificar com conta admin e conta comum)
- [ ] 4.4 Lista de convites com selo "Arquivado" e vitrine e FAQ sem a frase de contas convidadas, com o preço (verificar visualmente)

## 5. Documentação e fechamento

- [ ] 5.1 Atualizar `docs/documentacao/plano-de-produto.md`, a política de privacidade (Mercado Pago como operador do pagamento) e os Termos (preço e validade) (verificar leitura)
- [ ] 5.2 Revisar as telas novas com `web-design-guidelines` e corrigir o que for apontado
- [ ] 5.3 `npm run check`, `npm run specs` e `npm run build` passam
- [ ] 5.4 Cobrança de ponta a ponta numa prévia da Vercel com credenciais de teste e pagador "APRO": gerar Pix, aprovação automática, convite publicado com a validade certa (verificar no app e na tabela `charges`)

## Workflow follow-up

- O dono cadastra o webhook no painel do Mercado Pago (evento de orders) apontando para `/api/pagamentos/webhook` e salva `MERCADOPAGO_WEBHOOK_SECRET` na Vercel antes da tarefa 5.4.
- Aplicar a migração no Supabase de produção imediatamente antes do merge, com aprovação do dono: ela tira do cliente o poder de publicar, então app e banco precisam mudar juntos.
- Antes de cobrar de verdade: chave Pix na conta real, credenciais de produção no lugar das de teste e revisão jurídica da política e dos termos.
- Arquivar a mudança com `openspec-archive-change` depois do merge.
