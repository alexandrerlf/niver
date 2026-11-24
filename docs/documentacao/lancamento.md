# Checklist de lançamento

Tudo o que precisa mudar entre o Niver em teste e o Niver cobrando de verdade. É a lista única: quem criar algo que vale só para teste, ou que precisa de outro valor em produção, acrescenta um item aqui no mesmo PR.

Hoje: produção em `niver-app-eta.vercel.app`, Mercado Pago com credenciais de teste, Pix de teste aprovado sozinho (`MERCADOPAGO_TEST_PAYER=1`) e login com Google restrito aos usuários de teste.

Legenda: **[dono]** feito pelo dono em painéis; **[código]** mudança no repositório, com PR; **[banco]** migração no Supabase.

## 1. Antes de cobrar de verdade

### Mercado Pago
- [ ] **[dono]** Cadastrar uma chave Pix na conta real do Mercado Pago (app ou site → Pix → Minhas chaves).
- [ ] **[dono]** Ativar as credenciais de produção da aplicação Niver-app (Suas integrações → Niver-app → Credenciais de produção; o Mercado Pago pede dados do negócio).
- [ ] **[dono]** Na Vercel (Settings → Environment Variables, ambiente Production), trocar `MERCADOPAGO_ACCESS_TOKEN` pelo Access Token de produção. No ambiente Preview, manter o de teste.
- [ ] **[dono]** Na Vercel, apagar `MERCADOPAGO_TEST_PAYER` do ambiente Production. Com ela ligada, o Pix sai com o pagador de teste "APRO".
- [ ] **[dono]** No painel do Mercado Pago, conferir o webhook no modo produção: URL `https://<domínio>/api/pagamentos/webhook`, evento de orders. Se a assinatura secreta de produção for diferente da de teste, trocar `MERCADOPAGO_WEBHOOK_SECRET` na Vercel.
- [ ] **[dono]** Fazer um Redeploy na Vercel depois de mudar variáveis: elas só valem no próximo deploy.
- [ ] **[dono]** Pagar um convite real de R$ 5,00 e conferir: o convite vai ao ar, o valor aparece na conta do Mercado Pago e a tabela `charges` mostra a cobrança paga.

### Contas e e-mail
- [ ] **[dono]** Configurar um SMTP próprio no Supabase (Authentication → Emails → SMTP Settings), por exemplo Resend ou Brevo. O serviço padrão do Supabase é só para teste e envia poucos e-mails por hora: com o cadastro aberto, novos clientes não conseguiriam confirmar a conta.
- [ ] **[dono]** Revisar os textos dos e-mails de confirmação e de recuperação de senha (Authentication → Emails → Templates), em português.
- [ ] **[dono]** Publicar o app de login do Google (Google Cloud Console → APIs e serviços → Tela de consentimento OAuth → Publicar app). Até lá, só os usuários de teste cadastrados ali entram com Google. O Google pede o link da Política de Privacidade (`/privacidade`) e dos Termos (`/termos`) e, com domínio próprio, a verificação do domínio.

### Jurídico e fiscal
- [ ] **[dono]** Revisão por advogado da Política de Privacidade (`src/app/privacidade/page.tsx`) e dos Termos de Uso (`src/app/termos/page.tsx`), principalmente reembolso em até 7 dias, foro e uso de dados de crianças.
- [ ] **[dono]** Formalizar a venda para emitir nota (por exemplo MEI) e conferir as taxas do Pix no Mercado Pago.
- [ ] **[código]** Depois da revisão, atualizar `effectiveDate` em `src/lib/legal.ts`.

### Dados de teste
- [ ] **[banco]** Apagar os convites e as cobranças criados nos testes em produção (tabela `charges` com origem `pix` paga com o pagador de teste, e os convites ligados a elas), com aprovação do dono antes de rodar.

## 2. Domínio próprio

- [ ] **[dono]** Comprar o domínio (por exemplo no registro.br, para `.com.br`).
- [ ] **[dono]** Vercel → projeto niver-app → Settings → Domains: adicionar o domínio, seguir as instruções de DNS e marcar como domínio de produção. O `niver-app-eta.vercel.app` pode continuar apontando para o mesmo site.
- [ ] **[dono]** Supabase → Authentication → URL Configuration: trocar o Site URL pelo novo domínio e incluir `https://<domínio>/auth/callback` em Redirect URLs. Sem isso, o link de confirmação de e-mail e o login com Google voltam para o endereço antigo.
- [ ] **[dono]** Google Cloud Console → Tela de consentimento OAuth: incluir o domínio em Domínios autorizados e atualizar a página inicial, a Política e os Termos para o novo endereço. O endereço de redirecionamento do Google continua o do Supabase (`https://jchdifrkhydeghbyilsd.supabase.co/auth/v1/callback`).
- [ ] **[dono]** Mercado Pago → Webhooks: trocar a URL para `https://<domínio>/api/pagamentos/webhook`.
- [ ] **[dono]** Criar um e-mail no domínio (por exemplo `privacidade@<domínio>`) e usá-lo também como remetente do SMTP.
- [ ] **[código]** Trocar `privacyEmail` em `src/lib/legal.ts` pelo e-mail do domínio e atualizar `effectiveDate`.
- [ ] **[dono]** Conferir o link compartilhado no WhatsApp: a imagem de prévia vem do domínio de produção da Vercel, então depois de marcar o novo domínio como produção ela passa a usar o endereço novo sozinha.

O código não tem o endereço do site fixo: login, convites e prévias usam o endereço de quem acessa. Por isso a troca de domínio é toda em painéis, menos o e-mail de contato.

## 3. Depois do lançamento

- [ ] **[código][banco]** Limpeza: remover a tabela `allowed_emails`, a função `private.is_allowed`, a tela `/admin/clientes` e as ações de clientes em `src/app/admin-actions.ts`, que deixaram de ser usadas com o cadastro aberto.
- [ ] **[código]** Incluir as cobranças no arquivo de "Baixar meus dados" (`src/app/api/conta/dados/route.ts`), para a portabilidade cobrir também os pagamentos.
- [ ] **[dono]** Supabase no plano Pro, se o volume justificar: liga a proteção contra senhas vazadas (aviso do painel de segurança).
- [ ] **[código]** Arquivar as mudanças do OpenSpec que já estiverem em produção (`npx openspec list`).

## Como saber se deu errado depois de trocar para produção

Voltar ao estado anterior (credenciais de teste e `MERCADOPAGO_TEST_PAYER=1` em Production, depois Redeploy) se:

- um Pix pago não colocar o convite no ar em até 2 minutos;
- a página de pagamento mostrar "Não foi possível gerar o Pix agora" para mais de uma pessoa;
- os logs da Vercel (Project → Logs, filtro `requestPixCharge` ou `webhook Mercado Pago`) mostrarem erros repetidos do Mercado Pago.
