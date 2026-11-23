# Design

## Context

Motivação em proposal.md. O app é Next.js 16 com Supabase. A sessão vem de `supabase.auth.getClaims()` (cookie), o cliente usa só a chave publicável e toda permissão mora na RLS. O service worker só é registrado em produção, e o manifesto já existe, então o navegador só oferece instalação em produção. `/api/*` é público no `src/proxy.ts`: cada rota precisa checar a sessão sozinha. O convite público e as prévias passam por `src/lib/invitation-response.ts`, que já define os cabeçalhos de segurança. A janela de confirmação é injetada pelo servidor em `src/lib/render.ts` (`RUNTIME_MARKUP` e `RUNTIME_SCRIPT`), dentro do sandbox do convite. O slug é gerado em `src/app/actions.ts` com `randomBytes(3)` (6 caracteres hexadecimais) e a coluna aceita até 80 caracteres.

## Goals / Non-Goals

**Goals:**
- Tudo o que a LGPD exige e o produto controla fica dentro do app: transparência, aceite, consentimento do responsável, acesso, portabilidade e exclusão.
- O tutorial e o aviso de instalação nunca aparecem juntos nem para quem já os resolveu.

**Non-Goals:**
- Banner de consentimento de cookies: o Niver só usa cookies essenciais de sessão, e a política explica isso.
- Correção de dados pelo titular: já existe, porque o cliente edita os próprios convites.
- Trocar o slug de convites já publicados: os links que as famílias enviaram continuam valendo.
- Atendimento de pedidos de convidados (que não têm conta): é feito pelo e-mail de contato da política.

## Decisions

- **Marca do tutorial na conta.** Fica em `user_metadata.onboarded_at`, gravado por uma server action com `supabase.auth.updateUser`. O layout do app lê o valor das claims da sessão, que já carrega, sem consulta extra. Alternativa: `localStorage`; descartada porque o tutorial voltaria em cada aparelho. Como as claims só mudam na próxima renovação do token, o componente também grava um `localStorage` para não reabrir o tutorial na mesma sessão.
- **Aviso de instalação no navegador.** Um componente cliente escuta `beforeinstallprompt`, guarda o evento e mostra o aviso com o botão "Instalar". Não mostra quando `display-mode: standalone` ou `navigator.standalone` indicam o app instalado, nem depois de `appinstalled`. Para o iPhone, onde o Safari não dispara o evento, mostra o passo a passo quando detecta iOS fora do modo app. As marcas "instalado" e "fechado em" ficam no `localStorage` do aparelho, porque instalar é uma condição do aparelho, não da conta. O layout só monta o aviso quando o tutorial já foi visto.
- **Conteúdo legal num arquivo só.** `src/lib/legal.ts` guarda controlador, e-mail de contato, foro, prazo de guarda e data de vigência. As páginas `/privacidade` e `/termos` são componentes de servidor estáticos que leem esse arquivo. Trocar o e-mail é mudar uma linha.
- **Consentimento do responsável.** Caixa obrigatória no formulário de criação (não na edição). O schema do zod exige o campo só na criação, e a server action grava `guardian_consent_at = now()` na nova coluna de `invitations`. A coluna fica fora das permissões de edição do cliente, para não ser apagada depois.
- **Aviso ao convidado.** O texto entra no `RUNTIME_MARKUP`, junto da dica já existente, com link absoluto para `<origem do app>/privacidade` e `target="_blank"`. O sandbox do convite já permite abrir nova aba (`allow-popups`).
- **Fora dos buscadores.** `invitationResponse` passa a enviar `X-Robots-Tag: noindex, nofollow`, o que cobre o convite público e as duas prévias.
- **Link mais difícil de adivinhar.** `randomBytes(8)` gera 16 caracteres hexadecimais (64 bits). O slug mais longo possível (50 do nome, 8 da idade e 17 do código) continua dentro do limite de 80 da coluna.
- **Baixar meus dados.** Rota `GET /api/conta/dados` que exige sessão (401 sem ela), lê com o cliente da sessão (a RLS limita aos dados do dono) e responde JSON com `Content-Disposition: attachment`. Inclui a conta (e-mail, data de criação), os convites sem o HTML do modelo e as presenças de cada um.
- **Excluir minha conta.** Função `public.delete_my_account()` em SQL, `security definer` e `search_path` vazio, executável só por `authenticated`. Apaga o e-mail da sessão de `public.allowed_emails`, `public.template_access` e `private.admins` e depois apaga `auth.users` onde `id = auth.uid()`. Os convites caem em cascata, e as presenças junto. A server action chama a função, encerra a sessão e leva para `/`. Alternativa: a API de admin do Supabase com a chave de serviço; descartada porque colocaria uma chave de serviço no servidor do app só para isso.
- **Prazo de guarda.** Extensão `pg_cron` com uma tarefa diária às 06:00 UTC (03:00 em Brasília) que chama `private.purge_old_rsvps()`, apagando presenças de convites cuja festa foi há mais de 6 meses. Alternativa: Vercel Cron com uma rota; descartada porque exigiria a chave de serviço e uma rota pública protegida.

## Risks / Trade-offs

- [O e-mail pessoal fica público na política] → Está num único arquivo; o dono pode trocar quando tiver o e-mail do site.
- [Excluir a conta é irreversível] → Confirmação com `ConfirmButton` e texto explícito do que será apagado.
- [A sessão continua válida por alguns minutos depois de apagar o usuário] → A action encerra a sessão logo após a exclusão, e a RLS já não encontra dados da conta.
- [O `pg_cron` precisa ser habilitado no projeto] → A migração habilita a extensão; se o plano do Supabase recusar, a rotina vira uma função chamada manualmente até ser resolvido.
- [O aviso de instalação depende do navegador] → Chrome, Edge e Samsung Internet disparam `beforeinstallprompt`; Firefox no computador não, e nesse caso o aviso não aparece.
- [Textos jurídicos feitos sem advogado] → Data de vigência na política e recomendação de revisão antes de cobrar pelo Pix.

## Migration Plan

1. Aplicar a migração no Supabase antes do merge: coluna `guardian_consent_at`, função `delete_my_account`, extensão `pg_cron`, função e tarefa de limpeza.
2. Merge e deploy.
3. Conferir em produção: `/privacidade`, `/termos`, exclusão com uma conta de teste e a tarefa listada em `cron.job`.

Rollback: remover a tarefa (`cron.unschedule`), a função de exclusão e a coluna nova numa migração reversa; o código anterior não depende delas.
