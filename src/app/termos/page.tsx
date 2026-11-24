import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";
import { PRICE_CENTS, formatPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "As regras para usar o Niver e criar convites de aniversário.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      intro="Ao criar uma conta ou usar o Niver, você concorda com estas regras. Leia junto com a Política de Privacidade."
    >
      <LegalSection id="servico" title="O que é o Niver">
        <p>
          O Niver é um aplicativo para criar convites de aniversário a partir de modelos prontos, compartilhar o
          convite por um link e receber as confirmações de presença. O serviço é oferecido por{" "}
          <strong>{LEGAL.controller}</strong>. Contato: <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="conta" title="Sua conta">
        <ul>
          <li>Você precisa ter 18 anos ou mais para criar uma conta.</li>
          <li>Mantenha sua senha em segredo. O que for feito na sua conta é de sua responsabilidade.</li>
          <li>Qualquer pessoa com conta confirmada pode criar convites.</li>
        </ul>
      </LegalSection>

      <LegalSection id="uso" title="Como usar">
        <ul>
          <li>
            Crie convites só para crianças de quem você é mãe, pai ou responsável, ou com a autorização deles.
          </li>
          <li>Informe dados verdadeiros e não use o convite para ofender, enganar ou divulgar algo ilegal.</li>
          <li>Não tente acessar dados de outras pessoas nem atrapalhar o funcionamento do serviço.</li>
        </ul>
        <p>Podemos suspender ou apagar convites e contas que desrespeitem estas regras.</p>
      </LegalSection>

      <LegalSection id="conteudo" title="O convite e os modelos">
        <p>
          Os textos que você escreve no convite são seus, e você responde por eles. As artes, os modelos e a marca
          Niver pertencem ao Niver ou a quem licenciou para nós: você pode usar o convite para a sua festa, mas não
          pode copiar os modelos para outros fins.
        </p>
        <p>
          O convite publicado abre para qualquer pessoa com o link. Você decide com quem compartilhar.
        </p>
      </LegalSection>

      <LegalSection id="preco" title="Preço e validade">
        <ul>
          <li>Criar o convite e ver a prévia é grátis.</li>
          <li>
            Para publicar e receber o link, você paga {formatPrice(PRICE_CENTS)} por Pix, uma vez por convite. O preço
            aparece antes de gerar o Pix, e nada é cobrado sem o seu pagamento.
          </li>
          <li>
            O convite fica no ar até 7 dias depois da data da festa, ou 7 dias depois do pagamento se ele for feito
            depois da festa. Se você mudar a data da festa, a validade acompanha, até 90 dias depois do pagamento.
          </li>
          <li>
            Depois desse prazo, o link mostra que o convite foi encerrado. O convite e as presenças continuam na sua
            conta, e você pode colocá-lo de volta no ar pagando de novo.
          </li>
          <li>
            Se quiser desistir da compra, peça o reembolso pelo e-mail{" "}
            <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> em até 7 dias depois do pagamento,
            como prevê o Código de Defesa do Consumidor.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="disponibilidade" title="Disponibilidade e responsabilidade">
        <p>
          Trabalhamos para o Niver ficar sempre no ar, mas ele pode ter pausas para manutenção ou falhas fora do
          nosso controle. Confira os dados do convite antes de enviar. Não respondemos por informações erradas
          preenchidas no convite nem pelo que acontece na festa.
        </p>
      </LegalSection>

      <LegalSection id="encerramento" title="Encerrar a conta">
        <p>
          Você pode excluir sua conta quando quiser em <Link href="/conta">Minha conta</Link>. Os convites deixam
          de abrir e os dados são apagados como descrito na <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </LegalSection>

      <LegalSection id="mudancas" title="Mudanças nestes termos">
        <p>
          Se estes termos mudarem, atualizamos a data no topo da página e avisamos no app quando a mudança for
          importante. Continuar usando o Niver depois disso significa concordar com a nova versão.
        </p>
      </LegalSection>

      <LegalSection id="lei" title="Lei e foro">
        <p>
          Estes termos seguem as leis do Brasil. Fica eleito o foro de {LEGAL.forum}, sem prejuízo do seu direito,
          como consumidor, de propor ação no foro do seu domicílio.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
