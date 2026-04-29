import './styles.css';

type Stage = 'landing' | 'join' | 'lobby' | 'round' | 'results';

type Player = {
  id: string;
  name: string;
  isHost?: boolean;
  isReady?: boolean;
  emoji?: string;
};

type Option = {
  id: string;
  label: string;
  votes?: number;
};

type Matchup = {
  left: Option;
  right: Option;
  prompt: string;
  roundLabel: string;
};

const players: Player[] = [
  { id: 'p1', name: 'Avery', isHost: true, isReady: true, emoji: '🦊' },
  { id: 'p2', name: 'Mina', isReady: true, emoji: '🐼' },
  { id: 'p3', name: 'Leo', isReady: false, emoji: '🐸' },
  { id: 'p4', name: 'Jules', isReady: true, emoji: '🐝' }
];

const options: Option[] = [
  { id: 'o1', label: 'Sushi' },
  { id: 'o2', label: 'Tacos' },
  { id: 'o3', label: 'Pizza' },
  { id: 'o4', label: 'Ramen' }
];

const currentMatchup: Matchup = {
  left: { id: 'o1', label: 'Sushi' },
  right: { id: 'o2', label: 'Tacos' },
  prompt: 'Which should win this round?',
  roundLabel: 'Round 2 of 5'
};

let stage: Stage = 'landing';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Missing #app root');
}

function pill(label: string, tone: 'neutral' | 'accent' | 'success' = 'neutral') {
  return `<span class="pill pill-${tone}">${label}</span>`;
}

function playerCard(player: Player) {
  return `
    <div class="player-card">
      <div class="player-emoji">${player.emoji ?? '🙂'}</div>
      <div class="player-meta">
        <div class="player-name">${player.name}${player.isHost ? ' · Host' : ''}</div>
        <div class="player-status">${player.isReady ? 'Ready' : 'Choosing a name'}</div>
      </div>
      ${player.isReady ? pill('Ready', 'success') : pill('Pending')}
    </div>
  `;
}

function optionCard(option: Option, kind: 'default' | 'winner' = 'default') {
  return `
    <button class="option-card ${kind === 'winner' ? 'option-card-winner' : ''}">
      <span>${option.label}</span>
      ${kind === 'winner' ? pill('Leading', 'accent') : ''}
    </button>
  `;
}

function header(title: string, subtitle: string) {
  return `
    <header class="screen-header">
      <div>
        <div class="eyebrow">Pika</div>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      ${pill('Prototype', 'accent')}
    </header>
  `;
}

function landingScreen() {
  return `
    <section class="screen">
      ${header('Rank options fast with friends', 'Create a room, invite the group, and settle on a winner through playful head-to-head matchups.')}
      <div class="panel hero-actions">
        <button data-next="join" class="primary">Join a room</button>
        <button data-next="lobby" class="secondary">Preview host lobby</button>
      </div>
      <div class="grid two">
        <div class="panel">
          <h2>How it works</h2>
          <ol>
            <li>Create or join a room</li>
            <li>Add options together</li>
            <li>Vote through matchups</li>
            <li>Share the result</li>
          </ol>
        </div>
        <div class="panel">
          <h2>What groups use Pika for</h2>
          <div class="chip-row">
            <span class="chip">Where to eat</span>
            <span class="chip">Movie night</span>
            <span class="chip">Weekend plans</span>
            <span class="chip">Team outing</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function joinScreen() {
  return `
    <section class="screen">
      ${header('Join a room', 'Enter a room code and pick a display name to jump in quickly.')}
      <div class="panel form-panel">
        <label>Room code</label>
        <input value="PIKA42" />
        <label>Your name</label>
        <input value="Avery" />
        <div class="row">
          <button data-next="lobby" class="primary">Continue</button>
          <button data-next="landing" class="secondary">Back</button>
        </div>
      </div>
    </section>
  `;
}

function lobbyScreen() {
  return `
    <section class="screen">
      ${header('Room lobby', 'Players are joining and adding options before the ranking starts.')}
      <div class="grid two">
        <div class="panel">
          <div class="row space-between">
            <h2>Room PIKA42</h2>
            ${pill('4 players', 'accent')}
          </div>
          <div class="stack">
            ${players.map(playerCard).join('')}
          </div>
        </div>
        <div class="panel">
          <div class="row space-between">
            <h2>Options</h2>
            ${pill('4 added')}
          </div>
          <div class="stack">
            ${options.map(option => optionCard(option)).join('')}
          </div>
          <div class="row">
            <button data-next="round" class="primary">Start round</button>
            <button data-next="landing" class="secondary">Exit preview</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function roundScreen() {
  return `
    <section class="screen">
      ${header('Head-to-head matchup', 'Each player picks the option they want to advance.')}
      <div class="panel matchup-panel">
        <div class="matchup-top">
          ${pill(currentMatchup.roundLabel, 'accent')}
          ${pill('12s left')}
        </div>
        <h2>${currentMatchup.prompt}</h2>
        <div class="grid two">
          ${optionCard(currentMatchup.left)}
          ${optionCard(currentMatchup.right)}
        </div>
        <div class="row">
          <button data-next="results" class="primary">Preview results</button>
          <button data-next="lobby" class="secondary">Back to lobby</button>
        </div>
      </div>
    </section>
  `;
}

function resultsScreen() {
  return `
    <section class="screen">
      ${header('Result shared', 'The group finished ranking and has a winner ready to send around.')}
      <div class="grid two">
        <div class="panel">
          <h2>Final ranking</h2>
          <div class="stack">
            ${optionCard({ id: 'o2', label: 'Tacos' }, 'winner')}
            ${optionCard({ id: 'o1', label: 'Sushi' })}
            ${optionCard({ id: 'o4', label: 'Ramen' })}
            ${optionCard({ id: 'o3', label: 'Pizza' })}
          </div>
        </div>
        <div class="panel">
          <h2>Share</h2>
          <p>Invite the rest of the group to see what won and start another quick round.</p>
          <div class="row">
            <button class="primary">Copy result link</button>
            <button data-next="landing" class="secondary">Start over</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function render() {
  const markup =
    stage === 'landing'
      ? landingScreen()
      : stage === 'join'
      ? joinScreen()
      : stage === 'lobby'
      ? lobbyScreen()
      : stage === 'round'
      ? roundScreen()
      : resultsScreen();

  root!.innerHTML = `
    <div class="app-shell">
      <nav class="top-nav">
        <button data-next="landing" class="nav-brand">Pika</button>
        <div class="nav-links">
          <button data-next="join">Join</button>
          <button data-next="lobby">Lobby</button>
          <button data-next="round">Round</button>
          <button data-next="results">Results</button>
        </div>
      </nav>
      ${markup}
    </div>
  `;
}

document.addEventListener('click', event => {
  const target = event.target as HTMLElement | null;
  const next = target?.getAttribute('data-next');

  if (next === 'landing' || next === 'join' || next === 'lobby' || next === 'round' || next === 'results') {
    stage = next;
    render();
  }
});

render();