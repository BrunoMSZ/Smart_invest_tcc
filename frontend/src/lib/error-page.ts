export function renderErrorPage(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Erro — SmartInvest</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #f6f7f9;
      color: #111827;
    }
    main {
      max-width: 28rem;
      padding: 2rem;
      text-align: center;
    }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    p { margin: 0 0 1.5rem; color: #4b5563; line-height: 1.5; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    button, a {
      appearance: none;
      border: 1px solid #d1d5db;
      background: #fff;
      color: inherit;
      text-decoration: none;
      padding: 0.55rem 1rem;
      border-radius: 0.5rem;
      font: inherit;
      cursor: pointer;
    }
    button { background: #111827; color: #fff; border-color: #111827; }
  </style>
</head>
<body>
  <main>
    <h1>Algo deu errado</h1>
    <p>Não foi possível carregar esta página. Tente novamente ou volte ao início.</p>
    <div class="actions">
      <button type="button" onclick="location.reload()">Tentar de novo</button>
      <a href="/">Ir para o início</a>
    </div>
  </main>
</body>
</html>`;
}
