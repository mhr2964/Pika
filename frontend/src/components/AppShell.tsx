import React, { ReactNode } from 'react';

type AppShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AppShell({
  eyebrow,
  title,
  subtitle,
  children,
}: AppShellProps) {
  return (
    <main className="app-shell">
      <section className="app-shell__panel">
        <header className="app-shell__header">
          {eyebrow ? <p className="app-shell__eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          <p className="app-shell__subtitle">{subtitle}</p>
        </header>
        <div className="app-shell__body">{children}</div>
      </section>
    </main>
  );
}