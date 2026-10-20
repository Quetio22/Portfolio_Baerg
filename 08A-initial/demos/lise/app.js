const app = document.querySelector('#booking-app');
const form = document.querySelector('#booking-form');
const steps = [...document.querySelectorAll('[data-step]')];
const error = document.querySelector('#booking-error');
const complete = document.querySelector('#booking-complete');
let currentStep = 1;
app.hidden = false;
// Validation et état uniquement dans le DOM. Aucun réseau ni stockage persistant.
form.noValidate = true;
const selected = (name) => form.querySelector(`input[name="${name}"]:checked`);

function showStep(step) {
  currentStep = step;
  form.hidden = false;
  complete.hidden = true;
  error.hidden = true;
  steps.forEach((panel) => {
    panel.hidden = Number(panel.dataset.step) !== step;
  });
  document.querySelectorAll('[data-progress]').forEach((item) => {
    if (Number(item.dataset.progress) === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  const service = selected('service');
  if (service)
    document.querySelector('.selected-service').textContent =
      `${service.dataset.name} · ${service.dataset.duration} min · ${service.dataset.price} CHF`;
  const heading = steps[step - 1].querySelector('h3');
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: 'start' });
}

function fail(message, name) {
  error.textContent = message;
  error.hidden = false;
  const first = form.querySelector(`input[name="${name}"]`);
  first?.focus();
}

function renderTimes() {
  const day = selected('day');
  const field = document.querySelector('#time-field');
  field.hidden = !day;
  const times =
    day?.value === 'Samedi' ? ['09:00', '10:30', '12:00'] : ['09:00', '11:00', '14:00', '16:30'];
  const container = document.querySelector('#time-options');
  container.replaceChildren();
  if (!day) return;
  times.forEach((time) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'time';
    input.value = time;
    input.required = true;
    const text = document.createElement('span');
    text.textContent = time.replace(':', ' h ');
    label.append(input, text);
    container.append(label);
  });
}

function summarize() {
  const service = selected('service');
  const start = selected('time').value;
  const [hours, minutes] = start.split(':').map(Number);
  const endMinutes = hours * 60 + minutes + Number(service.dataset.duration);
  const end = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')} h ${String(endMinutes % 60).padStart(2, '0')}`;
  const rows = [
    ['Prestation', service.dataset.name],
    ['Jour fictif', selected('day').value + ' — semaine type'],
    ['Horaire', `${start.replace(':', ' h ')} – ${end}`],
    ['Durée totale', service.dataset.duration + ' minutes'],
    ['Prix illustratif', service.dataset.price + ' CHF'],
  ];
  const summary = document.querySelector('#booking-summary');
  summary.replaceChildren();
  rows.forEach(([term, value]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = value;
    row.append(dt, dd);
    summary.append(row);
  });
}

form.addEventListener('change', () => {
  error.hidden = true;
});
form.addEventListener('change', (event) => {
  if (event.target.name === 'day') renderTimes();
});
form.addEventListener('click', (event) => {
  const back = event.target.closest('[data-back]');
  if (back) return showStep(Number(back.dataset.back));
  const next = event.target.closest('[data-next]');
  if (!next) return;
  const step = Number(next.dataset.next);
  if (step === 2 && !selected('service'))
    return fail('Choisissez un soin pour continuer.', 'service');
  if (step === 3) {
    if (!selected('day')) return fail('Choisissez un jour fictif pour continuer.', 'day');
    if (!selected('time')) return fail('Choisissez une heure pour continuer.', 'time');
    summarize();
  }
  showStep(step);
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (currentStep !== 3 || !selected('service') || !selected('day') || !selected('time')) return;
  form.hidden = true;
  complete.hidden = false;
  document
    .querySelectorAll('[data-progress]')
    .forEach((item) => item.removeAttribute('aria-current'));
  form.reset();
  renderTimes();
  complete.querySelector('h3').focus({ preventScroll: true });
  complete.scrollIntoView({ block: 'start' });
});
document.querySelectorAll('[data-choose]').forEach((link) =>
  link.addEventListener('click', (event) => {
    event.preventDefault();
    form.querySelector(`[name="service"][value="${link.dataset.choose}"]`).checked = true;
    showStep(2);
    history.replaceState(null, '', '#rendez-vous');
  }),
);
document.querySelector('#restart').addEventListener('click', () => {
  form.reset();
  renderTimes();
  showStep(1);
});
