import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o Niver trata os dados de quem cria convites, das crianças aniversariantes e dos convidados.",
};

export default function PrivacyPage() {
  const email = <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>;

  return (
    <LegalPage
      title="Política de Privacidade"
      intro="Este texto explica quais dados o Niver usa, para quê, com quem divide e como você controla tudo isso, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018)."
    >
      <LegalSection id="controlador" title="Quem cuida dos seus dados">
        <p>
          O controlador dos dados é <strong>{LEGAL.controller}</strong>, responsável pelo Niver. Para qualquer
          assunto de privacidade, inclusive pedidos sobre os seus direitos, escreva para {email}. Esse é também o
          canal do encarregado pelo tratamento de dados.
        </p>
      </LegalSection>

      <LegalSection id="dados" title="Quais dados usamos">
        <ul>
          <li>
            <strong>Da sua conta:</strong> e-mail e senha (guardada cifrada). Se você entra com o Google, recebemos
            também o nome e a foto do perfil que o Google informa.
          </li>
          <li>
            <strong>Do convite:</strong> nome e idade da criança, data, horário e local da festa, link do mapa,
            mensagem, sugestões de presente e a data em que você confirmou ser responsável pela criança.
          </li>
          <li>
            <strong>Dos convidados:</strong> o nome e o número de pessoas informados ao confirmar presença, com a
            data da resposta. O convidado não cria conta.
          </li>
          <li>
            <strong>Do pagamento:</strong> valor, data e situação de cada cobrança Pix e o código da transação no
            Mercado Pago. Os dados bancários de quem paga ficam com o banco e o Mercado Pago; o Niver não os recebe.
          </li>
          <li>
            <strong>Técnicos:</strong> cookies de sessão para manter você conectado e registros de acesso (como
            endereço IP e horário) guardados pelos nossos fornecedores para segurança. No seu aparelho guardamos se
            você já viu o tutorial e o aviso de instalação.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="finalidades" title="Para que usamos e com qual base legal">
        <ul>
          <li>
            Criar sua conta, montar e publicar os convites e mostrar as presenças: execução do serviço que você
            pediu (art. 7º, V, da LGPD).
          </li>
          <li>
            Usar o nome e a idade da criança no convite: consentimento específico de um dos pais ou do responsável
            (art. 14, § 1º), dado no momento de criar o convite.
          </li>
          <li>
            Registrar as presenças para quem enviou o convite organizar a festa: legítimo interesse do organizador
            e execução do serviço, sempre com aviso ao convidado na hora de confirmar.
          </li>
          <li>Proteger a conta e o serviço contra abusos: legítimo interesse (art. 7º, IX).</li>
        </ul>
        <p>Não vendemos dados, não usamos os dados para publicidade e não fazemos perfis de comportamento.</p>
      </LegalSection>

      <LegalSection id="criancas" title="Dados de crianças">
        <p>
          A criança não usa o Niver. Quem informa o nome e a idade dela é a mãe, o pai ou o responsável, que
          confirma essa condição e autoriza o uso antes de criar o convite. Pedimos só o necessário para o convite e
          não pedimos foto. Você pode apagar o convite a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection id="link" title="Quem vê o convite">
        <p>
          O convite publicado abre para qualquer pessoa que tenha o link, sem login. O link tem um código aleatório
          difícil de adivinhar e pedimos aos buscadores que não indexem os convites. Compartilhe o link só com quem
          você quer convidar. A lista de presenças só aparece para você.
        </p>
      </LegalSection>

      <LegalSection id="compartilhamento" title="Com quem dividimos">
        <p>Usamos fornecedores que tratam dados em nosso nome, só para fazer o Niver funcionar:</p>
        <ul>
          <li>
            <strong>Supabase:</strong> banco de dados, login e arquivos, em servidores em São Paulo.
          </li>
          <li>
            <strong>Vercel:</strong> hospedagem do site, em servidores em São Paulo.
          </li>
          <li>
            <strong>Google:</strong> só se você escolher entrar com a conta Google.
          </li>
          <li>
            <strong>Mercado Pago:</strong> processa o pagamento por Pix. Recebe o seu e-mail e o valor da cobrança.
          </li>
        </ul>
        <p>
          Essas empresas têm sede no exterior e podem acessar os dados de fora do Brasil para suporte e segurança,
          com as garantias previstas nos contratos delas (art. 33 da LGPD). Também podemos entregar dados quando a
          lei ou uma ordem judicial exigir.
        </p>
      </LegalSection>

      <LegalSection id="prazo" title="Por quanto tempo guardamos">
        <ul>
          <li>Conta e convites: enquanto a conta existir ou até você apagar o convite.</li>
          <li>
            Presenças: apagadas automaticamente {LEGAL.rsvpRetentionMonths} meses depois da data da festa. O
            convite continua no seu histórico.
          </li>
          <li>
            Cobranças: junto com o convite. O Mercado Pago guarda os dados da transação pelo prazo que a lei exige.
          </li>
          <li>Registros de acesso: pelo prazo dos fornecedores e da lei.</li>
        </ul>
        <p>Quando você exclui a conta, apagamos a conta, os convites e as presenças na hora.</p>
      </LegalSection>

      <LegalSection id="direitos" title="Seus direitos">
        <p>
          Você pode, a qualquer momento: confirmar se tratamos seus dados, acessá-los, corrigi-los, levá-los para
          outro serviço, pedir a eliminação, saber com quem dividimos, revogar o consentimento e reclamar à
          Autoridade Nacional de Proteção de Dados (ANPD) (art. 18 da LGPD).
        </p>
        <ul>
          <li>
            Em <Link href="/conta">Minha conta</Link>, você baixa seus dados num arquivo e exclui a conta sozinho.
          </li>
          <li>Os dados do convite você corrige na tela de cada convite.</li>
          <li>
            Para o resto, ou se você foi convidado e quer apagar sua resposta, escreva para {email}. Respondemos
            em até 15 dias.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          Usamos só cookies essenciais, que mantêm você conectado. Não usamos cookies de publicidade nem de
          rastreamento.
        </p>
      </LegalSection>

      <LegalSection id="seguranca" title="Segurança">
        <p>
          O acesso aos dados é controlado no próprio banco: cada conta só lê e altera o que é dela. A conexão é
          sempre cifrada. Se acontecer um incidente que possa trazer risco ou dano relevante, avisamos você e a
          ANPD.
        </p>
      </LegalSection>

      <LegalSection id="mudancas" title="Mudanças nesta política">
        <p>
          Quando esta política mudar, atualizamos a data no topo da página. Se a mudança for importante, avisamos
          no app.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
