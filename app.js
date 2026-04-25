/**
 * WanderSwipe App Logic
 * Strict state partitioning, swipe physics, and consensus scoring.
 */

// --- 1. Mock Data ---
const destinations = [
  { id: 1, title: 'Kyoto, Japan', vibe: 'Cultural History', duration: '5 Days', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', desc: 'Step back in time to an era of samurai, geishas, and stunning temples in ancient Japan.' },
  { id: 2, title: 'Santorini, Greece', vibe: 'Romantic Coastal', duration: '4 Days', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop', desc: 'White-washed buildings clinging to cliffs above an underwater caldera.' },
  { id: 3, title: 'Bali, Indonesia', vibe: 'Tropical Zen', duration: '7 Days', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop', desc: 'Lush terraced rice paddies, ancient temples, and vibrant beach sunsets await.' },
  { id: 4, title: 'New York City, USA', vibe: 'Urban Energy', duration: '4 Days', img: 'https://images.unsplash.com/photo-1496442226666-8d4de5f8c85b?q=80&w=800&auto=format&fit=crop', desc: 'The city that never sleeps. Broadway, Times Square, and towering skyscrapers.' },
  { id: 5, title: 'Machu Picchu, Peru', vibe: 'Ancient Wonder', duration: '6 Days', img: 'https://images.unsplash.com/photo-1526392060635-9d601b09b0b4?q=80&w=800&auto=format&fit=crop', desc: 'Hike the Inca Trail to discover this breathtaking 15th-century citadel set high in the Andes.' },
  { id: 6, title: 'Amalfi Coast, Italy', vibe: 'Mediterranean Glamour', duration: '5 Days', img: 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=800&auto=format&fit=crop', desc: 'Cliffside villages, fragrant lemon groves, and sparkling azure waters.' },
  { id: 7, title: 'Banff, Canada', vibe: 'Mountain Wilderness', duration: '7 Days', img: 'https://images.unsplash.com/photo-1561134643-66a93bfaf126?q=80&w=800&auto=format&fit=crop', desc: 'Turquoise glacial lakes carved among dramatic jagged peaks.' },
  { id: 8, title: 'Cape Town, South Africa', vibe: 'Coastal Diversity', duration: '8 Days', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop', desc: 'Stunning harbor views, Table Mountain, and nearby rolling vineyards.' },
  { id: 9, title: 'Reykjavik, Iceland', vibe: 'Nordic Nature', duration: '5 Days', img: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?q=80&w=800&auto=format&fit=crop', desc: 'Geothermal spas, northern lights, and dramatic volcanic landscapes.' },
  { id: 10, title: 'Paris, France', vibe: 'Classic Romance', duration: '4 Days', img: 'https://images.unsplash.com/photo-1502602898657-3e90760e10b1?q=80&w=800&auto=format&fit=crop', desc: 'Iconic architecture, world-class art, and unparalleled culinary delights.' }
  // Adding more procedurally to reach 30+ easily
];

// Procedural generation to reach 30 destinations
const extraTitles = ['Tokyo', 'London', 'Rome', 'Seoul', 'Sydney', 'Barcelona', 'Dubai', 'Istanbul', 'Bangkok', 'Prague', 'Amsterdam', 'Vienna', 'Singapore', 'Rio', 'Marrakech', 'Lisbon', 'Venice', 'Budapest', 'Cairo', 'Petra', 'Phuket', 'Maldives', 'Fiji', 'Tasmania', 'Patagonia'];
for(let i=0; i < extraTitles.length; i++) {
  destinations.push({
    id: 11 + i, title: extraTitles[i], vibe: 'Global Adventure', duration: (Math.floor(Math.random()*5)+3)+' Days',
    img: `https://source.unsplash.com/800x600/?landmark,${extraTitles[i].toLowerCase()}`, 
    desc: `Discover the unique culture, incredible sights, and local secrets of ${extraTitles[i]}.`
  });
}

// --- 2. State Partitioning ---
const sessionState = {
  participants: [], // [{ name: 'Alice' }, { name: 'Bob' }]
  currentParticipantIndex: 0,
  currentCardIndex: 0,
  // Strict partition: scores[participantName][destinationId] = score (3, 1, 0)
  sentimentMatrix: {}
};

// Values
const SENTIMENT = { LOVE: 3, YES: 1, NO: 0 };
const EMOJI = { 3: '🔥', 1: '👍', 0: '❌' };

// --- 3. DOM Elements ---
const views = {
  start: document.getElementById('start-screen'),
  swipe: document.getElementById('swipe-screen'),
  interchange: document.getElementById('interchange-screen'),
  reveal: document.getElementById('reveal-screen')
};

const elems = {
  form: document.getElementById('session-form'),
  addBtn: document.getElementById('add-participant-btn'),
  extraContainer: document.getElementById('extra-participants'),
  cardStack: document.getElementById('card-stack'),
  participantBadge: document.getElementById('current-participant-name'),
  progressText: document.getElementById('progress-text'),
  nextParticipantBtn: document.getElementById('next-participant-btn'),
  nextTurnText: document.getElementById('next-turn-text'),
  btnNo: document.getElementById('btn-no'),
  btnYes: document.getElementById('btn-yes'),
  btnLove: document.getElementById('btn-love'),
};

let participantCount = 2;

// --- 4. Flow Management ---
function switchView(viewName) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[viewName].classList.add('active');
}

// Form logic
elems.addBtn.addEventListener('click', () => {
  if (participantCount >= 5) return;
  participantCount++;
  const div = document.createElement('div');
  div.className = 'quorum-input-group pulse-in';
  div.innerHTML = `
    <label>COUNCIL MEMBER ${participantCount}</label>
    <div class="quorum-input-wrapper">
      <span class="material-symbols-outlined">person</span>
      <input type="text" id="p${participantCount}" required placeholder="Enter name">
    </div>
  `;
  const container = document.getElementById('traveler-fields');
  container.appendChild(div);
  if (participantCount === 5) elems.addBtn.style.display = 'none';
});

elems.form.addEventListener('submit', (e) => {
  e.preventDefault();
  sessionState.participants = [];
  for (let i = 1; i <= participantCount; i++) {
    const val = document.getElementById(`p${i}`).value.trim();
    if (val) sessionState.participants.push({ name: val });
  }
  
  if (sessionState.participants.length >= 2) {
    // Initialize state matrix
    sessionState.participants.forEach(p => {
      sessionState.sentimentMatrix[p.name] = {};
    });
    
    startParticipantTurn(0);
  }
});

// Participant Turn flow
function startParticipantTurn(index) {
  sessionState.currentParticipantIndex = index;
  sessionState.currentCardIndex = 0;
  
  const pName = sessionState.participants[index].name;
  elems.participantBadge.textContent = `${pName}'s Turn`;
  
  renderCards();
  updateProgress();
  switchView('swipe');
}

function updateProgress() {
  elems.progressText.textContent = `${sessionState.currentCardIndex} / ${destinations.length}`;
}

// Next Participant Transition
elems.nextParticipantBtn.addEventListener('click', () => {
  startParticipantTurn(sessionState.currentParticipantIndex + 1);
});

// --- 5. Card Rendering and Swipe Physics ---

// Render top 3 cards for depth illusion
function renderCards() {
  elems.cardStack.innerHTML = '';
  
  const total = destinations.length;
  const current = sessionState.currentCardIndex;
  
  // Render cards in reverse order so current is on top
  const toRender = [];
  for (let i = current; i < Math.min(current + 3, total); i++) {
    toRender.unshift(destinations[i]);
  }
  
  toRender.forEach((dest, zIdxReverse) => {
    const zIndex = toRender.length - zIdxReverse;
    const cardIndexOffset = zIndex - 1; // 0 for top card, 1 for second, 2 for third
    
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.id = dest.id;
    cardEl.style.zIndex = 100 - cardIndexOffset;
    
    // Stacking offset styles (depth illusion)
    const scale = 1 - (cardIndexOffset * 0.05);
    const translateY = cardIndexOffset * 15;
    
    // Only top card is draggable, otherwise it's just visually stacked
    if (cardIndexOffset === 0) {
      cardEl.style.transform = `translateY(${translateY}px) scale(${scale})`;
      setupCardPhysics(cardEl, dest.id);
    } else {
      cardEl.style.transform = `translate2d(0, ${translateY}px) scale(${scale})`;
      cardEl.style.filter = `brightness(${1 - (cardIndexOffset * 0.2)})`;
    }

    cardEl.innerHTML = `
      <div class="stamp stamp-nope">NOPE</div>
      <div class="stamp stamp-like">YES</div>
      <div class="stamp stamp-love">LOVE</div>
      <img src="${dest.img}" class="card-img" alt="${dest.title}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb84e24328?q=80&w=800&auto=format&fit=crop'">
      <div class="card-info">
        <h2 class="card-title">${dest.title}</h2>
        <div class="card-tags">
          <span class="tag">${dest.vibe}</span>
          <span class="tag">${dest.duration}</span>
        </div>
        <p class="card-desc">${dest.desc}</p>
      </div>
    `;
    
    elems.cardStack.appendChild(cardEl);
  });
  
  if (current >= total) {
    handleTurnComplete();
  }
}

// Physics variables scoped for current active card
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;
let isDragging = false;
let startTime = 0;

function setupCardPhysics(card, destId) {
  // Pointer Events for maximum compatibility and performance
  card.addEventListener('pointerdown', onDragStart);
  window.addEventListener('pointermove', onDragMove); // Window to catch fast escapes
  window.addEventListener('pointerup', onDragEnd);
  
  const stampNope = card.querySelector('.stamp-nope');
  const stampLike = card.querySelector('.stamp-like');
  const stampLove = card.querySelector('.stamp-love');

  function onDragStart(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    startTime = Date.now();
    
    card.classList.remove('snap-back');
    card.setPointerCapture(e.pointerId);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    // Rotation proportional to lateral displacement
    // Ratio relative to screen width, amplified
    const rotate = (currentX / window.innerWidth) * 45;
    
    card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

    // Opacity of stamps based on distance
    const thresholdX = 50;
    const thresholdY = -50;
    
    stampNope.style.opacity = currentX < -thresholdX ? Math.min(1, Math.abs(currentX)/150) : 0;
    stampLike.style.opacity = currentX > thresholdX ? Math.min(1, Math.abs(currentX)/150) : 0;
    stampLove.style.opacity = currentY < thresholdY && Math.abs(currentX) < 80 ? Math.min(1, Math.abs(currentY)/150) : 0;
  }

  function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const dragTime = Date.now() - startTime;
    const velocityX = currentX / dragTime;
    const velocityY = currentY / dragTime;
    
    // Determine gesture completion based on displacement OR momentum (velocity)
    const passedX = Math.abs(currentX) > 100 || Math.abs(velocityX) > 0.5;
    const passedY = currentY < -100 || velocityY < -0.5;

    // Cleanup listeners
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);

    if (passedY && Math.abs(currentX) < 100) {
      // Love (Upward)
      throwCard(card, 0, -window.innerHeight, velocityY, destId, SENTIMENT.LOVE);
    } else if (passedX && currentX > 0) {
      // Yes (Right)
      throwCard(card, window.innerWidth, currentY + (velocityY*100), velocityX, destId, SENTIMENT.YES);
    } else if (passedX && currentX < 0) {
      // No (Left)
      throwCard(card, -window.innerWidth, currentY + (velocityY*100), velocityX, destId, SENTIMENT.NO);
    } else {
      // Snap-back spring on incomplete gesture
      card.classList.add('snap-back');
      card.style.transform = `translateY(0px) scale(1) rotate(0deg)`;
      stampNope.style.opacity = 0; stampLike.style.opacity = 0; stampLove.style.opacity = 0;
      currentX = 0; currentY = 0;
      
      // Re-add listeners for retry
      setupCardPhysics(card, destId);
    }
  }
}

function throwCard(card, targetX, targetY, velocity, destId, sentimentValue) {
  card.classList.add('throwing');
  
  // Calculate final rotation based on X throw direction to maintain momentum look
  const throwRot = targetX > 0 ? 45 : targetX < 0 ? -45 : 0;
  
  card.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${throwRot}deg)`;
  
  // Record the vote
  const pName = sessionState.participants[sessionState.currentParticipantIndex].name;
  sessionState.sentimentMatrix[pName][destId] = sentimentValue;
  
  // Move to next card
  setTimeout(() => {
    card.remove();
    sessionState.currentCardIndex++;
    renderCards();
    updateProgress();
  }, 300); // Wait for throw physics
}

// Button actions
function simulateAction(sentimentValue) {
  if (sessionState.currentCardIndex >= destinations.length) return;
  
  // The current active card matches the currentCardIndex destination ID
  const currentDestId = destinations[sessionState.currentCardIndex].id;
  const card = document.querySelector(`.card[data-id="${currentDestId}"]`);
  if(!card) return;
  
  const destId = card.dataset.id;
  
  let tx = 0, ty = 0;
  if(sentimentValue === SENTIMENT.YES) tx = window.innerWidth;
  if(sentimentValue === SENTIMENT.NO) tx = -window.innerWidth;
  if(sentimentValue === SENTIMENT.LOVE) ty = -window.innerHeight;
  
  throwCard(card, tx, ty, 0, destId, sentimentValue);
}

elems.btnNo.addEventListener('click', () => simulateAction(SENTIMENT.NO));
elems.btnYes.addEventListener('click', () => simulateAction(SENTIMENT.YES));
elems.btnLove.addEventListener('click', () => simulateAction(SENTIMENT.LOVE));

function handleTurnComplete() {
  if (sessionState.currentParticipantIndex + 1 < sessionState.participants.length) {
    const nextName = sessionState.participants[sessionState.currentParticipantIndex + 1].name;
    elems.nextTurnText.textContent = `Pass the device to ${nextName}`;
    switchView('interchange');
  } else {
    // All turns complete! Start reveal ceremony
    startRevealCeremony();
  }
}

// --- 6. Reveal Ceremony Pipeline ---
function startRevealCeremony() {
  switchView('reveal');
  
  const countdownEl = document.getElementById('countdown-timer');
  const containerResults = document.getElementById('results-container');
  const containerCountdown = document.getElementById('countdown-container');
  
  containerResults.classList.add('hidden');
  containerCountdown.classList.remove('hidden');
  
  // Countdown Timer
  let count = 3;
  countdownEl.textContent = count;
  
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
      countdownEl.parentElement.classList.remove('pulse-in');
      void countdownEl.parentElement.offsetWidth; // trigger reflow
      countdownEl.parentElement.classList.add('pulse-in');
    } else {
      clearInterval(interval);
      containerCountdown.classList.add('hidden');
      containerResults.classList.remove('hidden');
      
      calculateResults();
      fireConfetti();
    }
  }, 1000);
}

function calculateResults() {
  // Aggregate scores processing
  const aggregateScores = {};
  destinations.forEach(d => aggregateScores[d.id] = 0);
  
  sessionState.participants.forEach(p => {
    const scores = sessionState.sentimentMatrix[p.name];
    for (const curDestId in scores) {
      aggregateScores[curDestId] += scores[curDestId];
    }
  });
  
  // Map back to destination objects and sort
  const results = destinations.map(d => ({
    ...d,
    totalScore: aggregateScores[d.id]
  })).sort((a, b) => b.totalScore - a.totalScore);
  
  renderPodium(results.slice(0, 3));
  renderMatrix(results);
}

function renderPodium(top3) {
  const container = document.getElementById('podium-container');
  container.innerHTML = '';
  
  const topScore = top3[0] ? top3[0].totalScore : 0;

  // Render order: 2, 1, 3 for visual podium
  const order = [1, 0, 2];
  order.forEach(index => {
    const item = top3[index];
    if (!item) return; // In case less than 3 destinations (unlikely)
    
    // Rank 0 is visually Rank 1
    const visualRank = index + 1;
    const delta = item.totalScore - topScore;
    const deltaHtml = visualRank === 1 ? '' : `<p class="delta-score">(${delta} pts)</p>`;
    const extraClass = visualRank === 1 ? ' spring-zoom' : '';
    
    container.innerHTML += `
      <div class="podium-item rank-${visualRank}${extraClass}">
        <div class="podium-info">
          <p class="podium-title">${item.title}</p>
          <p class="podium-score">${item.totalScore} Points</p>
          ${deltaHtml}
        </div>
        <img src="${item.img}" class="podium-img" alt="${item.title}">
        <div class="podium-block">${visualRank === 1 ? '🥇' : visualRank === 2 ? '🥈' : '🥉'}</div>
      </div>
    `;
  });
}

function renderMatrix(allResults) {
  const tbody = document.getElementById('sentiment-matrix');
  
  // Table Header
  let headerHtml = `<tr><th>Destination</th><th>Rank</th><th>Total</th>`;
  sessionState.participants.forEach(p => {
    headerHtml += `<th>${p.name.substring(0, 3)}</th>`;
  });
  headerHtml += `</tr>`;
  
  // Table Rows (Top 10 max for sanity)
  let rowsHtml = '';
  allResults.slice(0, 10).forEach((dest, idx) => {
    rowsHtml += `<tr>
      <td class="dest-col">${dest.title}</td>
      <td>#${idx + 1}</td>
      <td style="color:var(--accent-secondary);font-weight:bold;">${dest.totalScore}</td>`;
      
    sessionState.participants.forEach(p => {
      const score = sessionState.sentimentMatrix[p.name][dest.id] !== undefined ? sessionState.sentimentMatrix[p.name][dest.id] : '-';
      rowsHtml += `<td>${EMOJI[score] || '-'}</td>`;
    });
    rowsHtml += `</tr>`;
  });
  
  tbody.innerHTML = headerHtml + rowsHtml;
}

document.getElementById('restart-btn').addEventListener('click', () => {
  window.location.reload();
});

// --- 7. CSS Confetti Particle Burst ---
// Lightweight, native canvas confetti without external library
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff477e', '#00f5d4', '#f72585', '#4cc9f0', '#ff9f1c'];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.8,
      r: Math.random() * 8 + 4,
      dx: Math.random() * 20 - 10,
      dy: Math.random() * -20 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 30 - 15,
      tiltAngle: 0,
      tiltAngleInc: (Math.random() * 0.07) + 0.05
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle) * 2 + p.dx;
      p.dy += 0.2; // Gravity
      p.y += p.dy;

      if (p.y < canvas.height) active = true;

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();
    });

    if (active) requestAnimationFrame(render);
    else canvas.style.display = 'none'; // Clean up
  }

  render();
}
