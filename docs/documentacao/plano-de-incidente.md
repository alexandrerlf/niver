# Plano de resposta a incidente de dados

O que fazer se dados pessoais do Niver vazarem, forem acessados por quem não devia ou forem perdidos. Base: art. 48 da LGPD e Resolução CD/ANPD nº 15/2024.

## Quem age

O controlador, Alexandre Rodrigues Lopes Filho, conduz a resposta e faz as comunicações. O contato é o e-mail de privacidade em `src/lib/legal.ts`.

## Passo a passo

1. **Conter (na hora).** Tirar do ar o que expõe os dados: reverter o deploy na Vercel, trocar chaves no Supabase, desativar a conta ou a política de RLS afetada.
2. **Entender (até 24 horas).** Levantar o que aconteceu, desde quando, quais dados (conta, convites com nome e idade de crianças, presenças) e quantas pessoas. Guardar evidências: logs da Vercel e do Supabase, commits e migrações envolvidos.
3. **Avaliar o risco.** O incidente é comunicável quando pode causar risco ou dano relevante. Dados de crianças contam como critério de risco alto, então vazamento de convite com nome e idade é tratado como comunicável.
4. **Comunicar a ANPD (até 3 dias úteis do conhecimento).** Pelo formulário de comunicação de incidente no site da ANPD, com: descrição, dados e titulares afetados, medidas tomadas, riscos e motivo de eventual atraso.
5. **Comunicar os titulares (até 3 dias úteis).** E-mail para cada conta afetada, em linguagem simples: o que aconteceu, quais dados, o que fizemos e o que a pessoa pode fazer. Convidados não têm conta: o aviso vai para o dono do convite repassar e fica publicado no site.
6. **Corrigir e registrar.** Corrigir a causa, com teste que reproduz o problema. Registrar o incidente (data, causa, dados, decisões, comunicações) e guardar o registro por pelo menos 5 anos, mesmo quando não for comunicável.

## Contatos

- Supabase (banco, login e arquivos): suporte pelo painel do projeto.
- Vercel (hospedagem): suporte pelo painel da conta.
- ANPD: canal de comunicação de incidente de segurança no site gov.br/anpd.
