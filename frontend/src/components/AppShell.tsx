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
    <div className="app-shell">
      <header className="app-shell__header">
        {eyebrow ? <p className="app-shell__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className="app-shell__subtitle">{subtitle}</p>
      </header>
      <section className="app-shell__body">{children}</section>
    </div>
  );
}