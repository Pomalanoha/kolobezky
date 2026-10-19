// Odeslání formuláře bez přenačtení stránky: chyby se zobrazí u polí, po úspěchu přesměrování.
// Bez JavaScriptu formulář funguje klasicky (server vrátí přesměrování nebo stránku s chybami).
export function enhanceForm(form: HTMLFormElement) {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const formError = form.querySelector<HTMLElement>('[data-form-error]');
  const label = button?.innerHTML ?? '';

  const clearError = (e: Event) => {
    const name = (e.target as HTMLInputElement).name;
    const el = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (el) el.textContent = '';
  };
  form.addEventListener('input', clearError);
  form.addEventListener('change', clearError);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (formError) formError.textContent = '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Bezig met verzenden…';
    }
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = (await res.json()) as { ok: boolean; redirect?: string; errors?: Record<string, string>; message?: string };
      if (data.ok && data.redirect) {
        location.href = data.redirect;
        return;
      }
      const errors = data.errors ?? {};
      form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => {
        el.textContent = errors[el.dataset.errorFor!] ?? '';
      });
      const first = Object.keys(errors)[0];
      if (first) {
        const target = form.querySelector<HTMLElement>(`[name="${first}"]`);
        target?.scrollIntoView({ block: 'center' });
        target?.focus();
      }
      if (data.message && formError) formError.textContent = data.message;
    } catch {
      if (formError) formError.textContent = 'Verzenden is niet gelukt. Probeer het opnieuw of stuur een WhatsApp-bericht.';
    }
    if (button) {
      button.disabled = false;
      button.innerHTML = label;
    }
  });
}
