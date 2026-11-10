"use client";

import { useActionState } from "react";
import { signInWithPassword, signUp, type FormState } from "@/app/actions";
import { ErrorMessage, NoticeMessage } from "@/components/form-feedback";
import { Spinner } from "@/components/icons";

const initial: FormState = {};

export function LoginForm() {
  const [signInState, signInAction, signingIn] = useActionState(signInWithPassword, initial);
  const [signUpState, signUpAction, signingUp] = useActionState(signUp, initial);
  const error = signInState.error ?? signUpState.error;
  const pending = signingIn || signingUp;

  return (
    <form className="space-y-4">
      <div>
        <label className="label" htmlFor="email">
          E-mail
        </label>
        <input
          className="field"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Senha
        </label>
        <input
          className="field"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="8 ou mais caracteres"
          minLength={8}
          required
        />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {signUpState.notice && <NoticeMessage>{signUpState.notice}</NoticeMessage>}
      <button className="button-primary w-full" formAction={signInAction} disabled={pending}>
        {signingIn && <Spinner />}
        Entrar
      </button>
      <p className="text-center text-sm text-muted">
        Primeira vez por aqui?{" "}
        <button
          className="cursor-pointer rounded font-semibold text-coral underline-offset-4 hover:underline disabled:opacity-60"
          formAction={signUpAction}
          disabled={pending}
        >
          {signingUp ? "Criando conta..." : "Criar conta com este e-mail"}
        </button>
      </p>
    </form>
  );
}
