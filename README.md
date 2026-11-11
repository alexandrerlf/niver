# Niver

PWA para criar convites de aniversário interativos a partir de um catálogo de modelos. O admin cria e libera os modelos, o cliente escolhe um, preenche os dados e compartilha o link, e os convidados confirmam presença.

A documentação do fluxo e das funcionalidades fica em [docs/documentacao/index.html](docs/documentacao/index.html), e o requisito do catálogo em [docs/documentacao/requisito-catalogo-de-modelos.md](docs/documentacao/requisito-catalogo-de-modelos.md).

## Fluxo

1. O admin cria a cena do tema por fora, uma vez, sem nome nem dados escritos, e prepara o HTML.
2. O admin envia a arte, cola o HTML, confere a prévia e publica o modelo para todos ou por e-mail.
3. O cliente entra com Google ou e-mail, escolhe o modelo em `/novo` e preenche os dados.
4. O cliente publica o convite, servido em `/c/<slug>`.
5. Os convidados confirmam presença, e a lista aparece no app.

Os textos ficam fora da imagem. Corrigir data ou local não exige nova arte.

## Criar um modelo

- A arte não deve ter nome, idade, data nem local escritos. Eles entram por cima, em HTML.
- O HTML usa `{{child_name}}`, `{{age_label}}`, `{{event_date}}`, `{{event_date_short}}`, `{{event_weekday}}`, `{{event_time}}`, `{{location_name}}`, `{{message}}` e `{{art_url}}`.
- Os botões usam `data-action="rsvp"`, `data-action="maps"` e `data-action="gifts"`.
- `data-fit` reduz a fonte de um texto até ele caber.
- `templates/minecraft` guarda o primeiro modelo, com a arte limpa e o HTML.
- `templates/bluey` guarda um modelo em que a arte é só o cenário: os cartões e botões são desenhados pelo HTML, então dá para trocar a arte sem reposicionar nada. `arte.svg` é a fonte editável de `arte.jpg`.

Cada convite guarda uma cópia do HTML, então editar um modelo não altera convites já criados.

## Segurança do convite

`/c/<slug>` roda em sandbox com CSP: o HTML do modelo não acessa cookies do app, e apenas o script injetado pelo servidor executa.

## Configuração

1. Crie um projeto Supabase e aplique `supabase/migrations`.
2. Defina o admin no SQL Editor:

   ```sql
   insert into private.admins (email) values ('voce@exemplo.com');
   ```

3. Em Authentication, mantenha a confirmação de e-mail ativa, porque as permissões usam o e-mail da sessão.
4. Ative Google e adicione `http://localhost:3000/auth/callback` e a URL de produção às Redirect URLs.
5. Copie `.env.example` para `.env.local` e preencha o Supabase.
6. Rode:

   ```bash
   npm install
   npm run dev
   ```

Os clientes são autorizados em `/admin/clientes` ou ao liberar um modelo por e-mail.

## Verificação

```bash
npm run typecheck
npm test
npm run build
```

`examples/samuel-dante` guarda o convite original usado como referência.
