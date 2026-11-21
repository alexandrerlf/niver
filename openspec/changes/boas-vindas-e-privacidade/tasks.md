# Tasks

## 1. Banco

- [x] 1.1 Migração com a coluna `guardian_consent_at` em `invitations`, sem permissão de edição para o cliente (verificar com `npx openspec validate` e leitura do SQL pela skill `supabase-postgres-best-practices`)
- [x] 1.2 Na mesma migração, a função `public.delete_my_account()` que apaga o e-mail de `allowed_emails`, `template_access` e `private.admins` e o usuário em `auth.users` (verificar num banco de teste: outro usuário não é afetado)
- [x] 1.3 Na mesma migração, a extensão `pg_cron`, a função `private.purge_old_rsvps()` e a tarefa diária (verificar que a função apaga só presenças de festas com mais de 6 meses)

## 2. Conteúdo legal

- [x] 2.1 `src/lib/legal.ts` com controlador, e-mail, foro, prazo de guarda e data de vigência (verificar com `npm run check`)
- [x] 2.2 Páginas públicas `/privacidade` e `/termos`, liberadas no `src/proxy.ts` (verificar abrindo sem sessão em 390 px e 1280 px)
- [x] 2.3 Links para as duas páginas na vitrine, no login e em "Minha conta" (verificar visualmente)
- [x] 2.4 Aviso de aceite no login, junto de entrar, criar conta e Google (verificar visualmente)

## 3. Convites

- [x] 3.1 Caixa obrigatória de consentimento do responsável no formulário de criação e validação no schema só na criação, com teste em `src/lib` (verificar com `npm run check`: sem a caixa o convite não é criado)
- [x] 3.2 Gravar `guardian_consent_at` na criação do convite (verificar no backend de teste)
- [x] 3.3 `X-Robots-Tag: noindex, nofollow` no convite público e nas prévias, com teste (verificar o cabeçalho com `curl -I`)
- [x] 3.4 Código aleatório do link com `randomBytes(8)`, com teste de formato e tamanho do slug (verificar com `npm run check`)
- [x] 3.5 Aviso ao convidado com link para a política na janela de confirmação (verificar abrindo o convite público)

## 4. Minha conta

- [x] 4.1 Página `/conta` com e-mail, "Baixar meus dados", "Rever tutorial", links legais e "Excluir minha conta" com `ConfirmButton`, e link para ela no topo do app (verificar em 390 px e 1280 px, temas claro e escuro)
- [x] 4.2 Rota `GET /api/conta/dados` que exige sessão e responde o arquivo JSON (verificar com e sem sessão)
- [x] 4.3 Server action de exclusão que chama a função, encerra a sessão e leva para `/` (verificar com conta de teste)

## 5. Boas-vindas

- [x] 5.1 Tutorial em quatro passos com o Leo, marcado em `user_metadata.onboarded_at` por server action e reaberto por "Rever tutorial" (verificar: aparece no primeiro acesso, não reaparece depois de concluir ou pular)
- [x] 5.2 Aviso de instalação com `beforeinstallprompt`, passo a passo para iPhone, sem aparecer no modo app, depois de instalar ou por 14 dias após fechar, e só depois do tutorial (verificar emulando Android e iPhone)
- [x] 5.3 Lógica de quando mostrar o aviso numa função pura com testes (verificar com `npm run check`)

## 6. Documentação e fechamento

- [x] 6.1 `docs/documentacao/plano-de-incidente.md` com quem avisa, como e em quanto tempo (verificar leitura)
- [x] 6.2 Revisar as telas novas com a skill `web-design-guidelines` e corrigir o que for apontado
- [x] 6.3 `npm run check`, `npm run specs` e `npm run build` passam

## Workflow follow-up

- Aplicar a migração no Supabase de produção antes do merge, com aprovação do dono.
- Arquivar a mudança com `openspec-archive-change` depois do merge.
