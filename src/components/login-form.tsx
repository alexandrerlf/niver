"use client";

import { useActionState } from "react";
import { signInWithPassword, signUp, type FormState } from "@/app/actions";

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
        <input className="field" id="email" name="email" type="email" autoComplete="email" required />
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
          minLength={8}
          required
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      {signUpState.notice && (
        <p role="status" className="text-sm font-semibold text-leaf">
          {signUpState.notice}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <button className="button-secondary" formAction={signUpAction} disabled={pending}>
          Criar conta
        </button>
        <button className="button-primary" formAction={signInAction} disabled={pending}>
          Entrar
        </button>
      </div>
    </form>
  );
}
