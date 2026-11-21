# Proposal

## Why

Depois do login, o cliente não sabe que pode instalar o Niver como app nem como usar o produto pela primeira vez. Além disso, o Niver trata dados pessoais de pais, crianças e convidados sem política de privacidade, sem consentimento do responsável pela criança e sem um jeito de o titular baixar ou apagar os próprios dados, o que a LGPD exige. A checagem de conformidade também apontou que o convite público, com nome, idade e endereço da festa da criança, pode ser indexado por buscadores e tem um código de link curto.

## What Changes

- Aviso para instalar o app depois do login, que não aparece quando o app já está instalado ou aberto como app. No iPhone mostra o passo a passo do Safari. Fechado, volta só depois de 14 dias.
- Tutorial de boas-vindas em quatro passos, mostrado uma vez por conta, com a opção de rever em "Minha conta".
- Política de Privacidade e Termos de Uso públicos, com links no login, na vitrine e no app.
- Aviso de aceite dos termos e da política no login e na criação de conta.
- **BREAKING** Criar convite passa a exigir a confirmação de que a pessoa é mãe, pai ou responsável pela criança e autoriza o uso do nome e da idade no convite.
- A janela de confirmação de presença avisa o convidado que o nome e o número de pessoas vão para quem enviou o convite.
- Página "Minha conta": baixar todos os meus dados e excluir a conta, apagando convites, presenças e o e-mail das listas de liberação.
- Convite público e prévias marcados para não aparecer em buscadores, e código aleatório do link mais longo nos convites novos.
- Presenças apagadas automaticamente 6 meses depois da data da festa.
- Plano de resposta a incidente de segurança em `docs/`.

## Capabilities

### New Capabilities
- `privacidade`: transparência sobre o tratamento de dados (política, termos, avisos de aceite), direitos do titular (baixar dados e excluir conta), prazo de guarda das presenças e proteção do convite público contra exposição.
- `boas-vindas`: o primeiro contato do cliente logado com o app, com o tutorial e o aviso para instalar.

### Modified Capabilities
- `convites`: criar convite exige a confirmação do responsável pela criança; o convite público não é indexado e o link novo é mais difícil de adivinhar.
- `confirmacao-de-presenca`: a janela de confirmação passa a avisar o convidado sobre o uso do nome dele.

## Impact

- **Banco:** migração com a função de exclusão da conta, a coluna de consentimento do responsável em `invitations` e a rotina diária que apaga presenças antigas (extensão `pg_cron`).
- **Código:** páginas `/privacidade`, `/termos` e `/conta`, rota de exportação de dados, componentes do tutorial e do aviso de instalação, formulário de criação de convite, janela de confirmação injetada no convite, cabeçalhos do convite público, geração do link.
- **Conteúdo:** controlador Alexandre Rodrigues Lopes Filho, contato `alexandrerodrigueslopesfilho@gmail.com`, foro de Manaus/AM, guardados num único arquivo de configuração para troca futura.
- **Documentação:** `docs/documentacao/plano-de-incidente.md`.
