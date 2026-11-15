# Plano de produto

Decisões tomadas com o dono do projeto em novembro de 2026, depois de comparar o Niver com o FestaLab e com editores de artes prontas.

## Posicionamento

O Niver é um catálogo **curado** de convites interativos. Não vira editor livre de artes nem catálogo com milhares de modelos: cada modelo tem arte e layout próprios.

## Situação

| Item | Situação |
|---|---|
| 1. Prazo para confirmar presença | Feito |
| 2. Foto da criança no convite | Planejado |
| 3. Pagamento por Pix (Mercado Pago) | Planejado, aguardando decisões |

## 1. Prazo para confirmar presença

- Campo opcional "Confirmar presença até" nos dados da festa. Não pode passar do dia da festa.
- O prazo vale até o fim do dia escolhido, no horário de Brasília.
- Dentro do prazo, a janela de confirmação avisa a data limite. Depois, mostra que as confirmações foram encerradas.
- O bloqueio vale no banco (política da tabela `rsvps`), não só na tela.

## 2. Foto da criança

Para a foto não quebrar o layout:

- **O modelo define a moldura.** Só modelos com um espaço de foto mostram o campo. A moldura tem formato e proporção fixos (círculo, polaroid etc.).
- **O cliente recorta no envio.** Ele posiciona e dá zoom na foto dentro da moldura do modelo. O app salva a foto já recortada e reduzida.
- **Sem foto, nada quebra.** A moldura some ou mostra uma ilustração padrão do tema.
- **Privacidade.** É foto de criança em link público: avisar no envio. Depois de arquivado, a foto fica visível só para o dono.

## 3. Pagamento por Pix (Mercado Pago)

- **Fluxo.** O cliente cria o convite e vê a prévia de graça. Ao publicar, o app gera a cobrança Pix. O Mercado Pago avisa o app quando o pagamento cai, e só então o link passa a existir.
- **3.1 Bloqueio.** Só o servidor publica, depois de confirmar o pagamento. Hoje o cliente consegue mudar a situação do convite; isso precisa sair da permissão dele. `/c/<slug>` responde apenas se o convite estiver pago e dentro da validade.
- **3.2 Print.** Nenhum site impede captura de tela. A proteção é a prévia levar marca d'água de "PRÉVIA" e ter os botões desativados antes do pagamento. Um print do convite pago não confirma presença nem abre o mapa.
- **3.3 Aviso.** Na tela de pagamento e na página do convite: "Ativo até dd/mm. Compartilhe o link quantas vezes quiser."
- **3.4 Arquivamento.** Automático pela data. Depois do prazo, o link mostra uma página de convite encerrado.
- **3.5 Histórico.** O convite arquivado continua na conta, com a prévia e a lista de presenças só para leitura, sem link público.

### Decisões em aberto

1. **Preço.**
2. **Validade.** Um mês contado do pagamento derruba o convite antes da festa se a pessoa pagar com muita antecedência. Sugestão: ativo até 7 dias depois da festa, ou um mês com esse mínimo garantido.
3. **Cadastro.** Continua só para e-mails liberados, ou aberto a qualquer pessoa que pague?
4. **Cortesia.** O admin publica sem pagar, para testes e presentes?
5. **Reativação.** Convite arquivado volta ao ar pagando de novo?
6. **Conta do Mercado Pago** com Pix habilitado e credenciais de teste.

## Fora do plano por enquanto

- Lista de presentes com pagamento.
- Lembretes automáticos por WhatsApp.
- Resposta "não vou" e exportar a lista de presenças (sugeridos, não confirmados pelo dono).
