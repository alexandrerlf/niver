# Plano de produto

Decisões tomadas com o dono do projeto em novembro de 2026, depois de comparar o Niver com o FestaLab e com editores de artes prontas.

## Posicionamento

O Niver é um catálogo **curado** de convites interativos. Não vira editor livre de artes nem catálogo com milhares de modelos: cada modelo tem arte e layout próprios.

## Situação

| Item | Situação |
|---|---|
| 1. Prazo para confirmar presença | Feito |
| 2. Foto da criança no convite | Backlog |
| 3. Pagamento por Pix (Mercado Pago) | Implementado, falta o teste de ponta a ponta e as credenciais de produção |

## 1. Prazo para confirmar presença

- Campo opcional "Confirmar presença até" nos dados da festa. Não pode passar do dia da festa.
- O prazo vale até o fim do dia escolhido, no horário de Brasília.
- Dentro do prazo, a janela de confirmação avisa a data limite. Depois, mostra que as confirmações foram encerradas.
- O bloqueio vale no banco (política da tabela `rsvps`), não só na tela.

## 2. Foto da criança (backlog)

Fica para depois do Pix. O plano já discutido:

Para a foto não quebrar o layout:

- **O modelo define a moldura.** Só modelos com um espaço de foto mostram o campo. A moldura tem formato e proporção fixos (círculo, polaroid etc.).
- **O cliente recorta no envio.** Ele posiciona e dá zoom na foto dentro da moldura do modelo. O app salva a foto já recortada e reduzida.
- **Sem foto, nada quebra.** A moldura some ou mostra uma ilustração padrão do tema.
- **Privacidade.** É foto de criança em link público: avisar no envio. Depois de arquivado, a foto fica visível só para o dono.

## 3. Pagamento por Pix (Mercado Pago)

- **Preço:** R$ 5,00 por publicação. Reativar custa o mesmo.
- **Fluxo.** O cliente cria o convite e vê a prévia de graça. Ao publicar, o app gera a cobrança Pix. O Mercado Pago avisa o app quando o pagamento cai, e só então o link passa a existir.
- **Cadastro aberto.** Qualquer conta confirmada cria convites; só o pagamento coloca o convite no ar. A lista de e-mails liberados e a tela "Clientes" deixam de ser usadas. Até o app do Google ser publicado, o login com Google fica limitado aos usuários de teste do Google Cloud Console; o cadastro por e-mail e senha fica aberto.
- **Bloqueio.** Só o servidor publica, depois de confirmar o pagamento. O cliente perde a permissão de mudar a situação do convite. `/c/<slug>` responde apenas se o convite estiver publicado e dentro da validade.
- **Marca d'água.** Nenhum site impede print. A prévia não paga leva "PRÉVIA" repetido sobre todo o convite, injetado pelo servidor fora do HTML do modelo, e fica com confirmar presença, mapa e presentes desativados. Um print da prévia não serve como convite.
- **Validade.** Ativo até 7 dias depois da festa (ou do pagamento, se for depois da festa). Se a festa mudar de data, a validade acompanha, até 90 dias depois do pagamento. Aviso na compra e na gestão: "Ativo até dd/mm. Compartilhe o link quantas vezes quiser."
- **Cortesia.** O admin publica sem pagar, com a mesma validade.
- **Arquivamento.** Automático pela data. Depois do prazo, o link mostra uma página de convite encerrado.
- **Histórico e reativação.** O convite arquivado continua na conta, com a prévia e as presenças só para leitura. Um novo pagamento de R$ 5,00 o coloca de volta no ar com o mesmo link.
- **Convites já publicados.** Recebem validade de 7 dias depois da festa, com pelo menos 7 dias a partir da entrada da cobrança.

A especificação formal está em `openspec/changes/cobranca-por-pix/` (proposta, requisitos com cenários e design).

### Pendente

Os passos que faltam para cobrar de verdade (credenciais de produção, `MERCADOPAGO_TEST_PAYER`, chave Pix, SMTP, domínio, revisão jurídica) estão em `docs/documentacao/lancamento.md`.

## Fora do plano por enquanto

- Lista de presentes com pagamento.
- Lembretes automáticos por WhatsApp.
- Resposta "não vou" e exportar a lista de presenças (sugeridos, não confirmados pelo dono).
