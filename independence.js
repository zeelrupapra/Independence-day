/* ==========================================================================
   AZAADI 2026 — INDEPENDENCE DAY INTERACTIVE JAVASCRIPT ENGINE
   Featuring:
   1. 24-Spoke Ashoka Chakra Renderer
   2. Full-Width Video & Animated Canvas Fallback
   3. Interactive Fireworks & Petal Particle System
   4. Realistic 3D Flag Hoisting Ceremony Simulator + Auto-Redirect to Music Player
   5. Patriotic Music Player — Local music/ Folder (Singing & Instrumental)
   6. Zeel Rupapara Personal Wish Card Generator & PNG / PDF Downloader (Dark/White Themes, Landscape Mobile Export)
   7. Responsive Mobile Navigation & Scroll Spy
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initAshokaChakras();
  initBackgroundCanvas();
  initHeroVideo();
  initFlagHoisting();
  initAudioEngine();
  initZeelWishes();
  initNavigation();
  initQuoteCarousel();
  initLiveClock();
});

/* --------------------------------------------------------------------------
   1. ASHOKA CHAKRA SPOKES RENDERER (24 SPOKES)
   -------------------------------------------------------------------------- */
function initAshokaChakras() {
  function drawSpokes(container, cx, cy, rInner, rOuter, strokeWidth, color) {
    if (!container) return;
    const ns = "http://www.w3.org/2000/svg";
    for (let i = 0; i < 24; i++) {
      const angle = (i * 360 / 24) * (Math.PI / 180);
      const x1 = cx + rInner * Math.cos(angle);
      const y1 = cy + rInner * Math.sin(angle);
      const x2 = cx + rOuter * Math.cos(angle);
      const y2 = cy + rOuter * Math.sin(angle);

      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", strokeWidth);
      container.appendChild(line);
    }
  }

  document.querySelectorAll("#defsSpokes").forEach((g) => {
    drawSpokes(g, 50, 50, 6, 44, 1.4, "currentColor");
  });

  const flagChakra = document.getElementById("flagChakraSpokes");
  if (flagChakra) {
    drawSpokes(flagChakra, 50, 50, 5, 42, 2, "#06038D");
  }
}

/* --------------------------------------------------------------------------
   2. BACKGROUND FIREWORKS & FLOWER PETALS CANVAS
   -------------------------------------------------------------------------- */
let fwCanvas, fwCtx;
let particles = [];
let petals = [];

function initBackgroundCanvas() {
  fwCanvas = document.getElementById("fireworksCanvas");
  if (!fwCanvas) return;
  fwCtx = fwCanvas.getContext("2d");

  function resizeCanvas() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  requestAnimationFrame(animateParticles);
}

function animateParticles() {
  if (!fwCtx) return;
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  // Update Fireworks Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    fwCtx.save();
    fwCtx.globalAlpha = p.alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 10;
    fwCtx.shadowColor = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }

  // Update Flower Petals
  for (let i = petals.length - 1; i >= 0; i--) {
    const pt = petals[i];
    pt.x += Math.sin(pt.osc) * pt.speedX;
    pt.y += pt.speedY;
    pt.osc += 0.05;
    pt.rot += pt.rotSpeed;

    if (pt.y > fwCanvas.height + 20) {
      petals.splice(i, 1);
      continue;
    }

    fwCtx.save();
    fwCtx.translate(pt.x, pt.y);
    fwCtx.rotate(pt.rot);
    fwCtx.fillStyle = pt.color;
    fwCtx.beginPath();
    fwCtx.ellipse(0, 0, pt.size, pt.size / 2, 0, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }

  requestAnimationFrame(animateParticles);
}

function triggerFireworks(cx, cy) {
  const colors = ["#FF9933", "#FFFFFF", "#138808", "#FFD700", "#06038D"];
  const particleCount = 80;
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.12,
      radius: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }
}

function triggerFlowerPetals() {
  const colors = ["#FF9933", "#FFF", "#138808", "#FF69B4", "#FFD700"];
  for (let i = 0; i < 60; i++) {
    petals.push({
      x: Math.random() * fwCanvas.width,
      y: -20 - Math.random() * 100,
      speedX: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 2 + 1.5,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      osc: Math.random() * Math.PI,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.1
    });
  }
}

/* --------------------------------------------------------------------------
   3. HERO FULL-WIDTH VIDEO & FALLBACK CANVAS ENGINE
   -------------------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.getElementById("heroBgVideo");
  const fallbackCanvas = document.getElementById("fallbackVideoCanvas");
  const playPauseBtn = document.getElementById("videoPlayPauseBtn");
  const muteBtn = document.getElementById("videoMuteBtn");

  if (!video) return;

  function startFallbackCanvas() {
    if (!fallbackCanvas) return;
    fallbackCanvas.style.display = "block";
    video.style.display = "none";
    const canvasCtx = fallbackCanvas.getContext("2d");
    
    let t = 0;
    function renderWave() {
      fallbackCanvas.width = window.innerWidth;
      fallbackCanvas.height = window.innerHeight;
      const w = fallbackCanvas.width;
      const h = fallbackCanvas.height;

      canvasCtx.clearRect(0, 0, w, h);

      const g = canvasCtx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#FF9933");
      g.addColorStop(0.5, "#FFFFFF");
      g.addColorStop(1, "#138808");

      canvasCtx.fillStyle = g;
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 20) {
        const y = Math.sin(x * 0.005 + t) * 40 + h * 0.5;
        canvasCtx.lineTo(x, y);
      }
      canvasCtx.lineTo(w, h);
      canvasCtx.lineTo(0, h);
      canvasCtx.closePath();
      canvasCtx.fill();

      t += 0.02;
      requestAnimationFrame(renderWave);
    }
    renderWave();
  }

  video.play().catch(() => {
    startFallbackCanvas();
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      } else {
        video.pause();
        playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted 
        ? `<i class="fa-solid fa-volume-xmark"></i>` 
        : `<i class="fa-solid fa-volume-high"></i>`;
    });
  }
}

/* --------------------------------------------------------------------------
   4. REALISTIC 3D FLAG HOISTING LOGIC & AUTO-REDIRECT TO MUSIC PLAYER
   -------------------------------------------------------------------------- */
function initFlagHoisting() {
  const flagWrap = document.getElementById("flagWrap");
  const fill = document.getElementById("hoistProgressFill");
  const statusText = document.getElementById("hoistStatusText");
  const hoistBtn = document.getElementById("hoistFlagBtn");
  const resetBtn = document.getElementById("resetFlagBtn");
  const petalsBtn = document.getElementById("burstPetalsBtn");

  if (!flagWrap || !hoistBtn) return;

  let isHoisting = false;
  let currentPos = 280;
  const topPos = 10;
  let hoistTimer;

  hoistBtn.addEventListener("click", () => {
    if (isHoisting) return;
    isHoisting = true;
    statusText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Hoisting the Tiranga Flag...`;

    clearInterval(hoistTimer);
    hoistTimer = setInterval(() => {
      if (currentPos > topPos) {
        currentPos -= 4;
        flagWrap.style.top = currentPos + "px";
        const progress = Math.min(100, Math.round(((280 - currentPos) / (280 - topPos)) * 100));
        fill.style.width = progress + "%";
      } else {
        clearInterval(hoistTimer);
        isHoisting = false;
        statusText.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--green)"></i> <strong>Tiranga Hoisted High! Redirecting to Music Player... 🇮🇳</strong>`;
        
        // Celebration FX
        triggerFlowerPetals();
        triggerFireworks(window.innerWidth / 2, window.innerHeight * 0.3);
        triggerFireworks(window.innerWidth * 0.3, window.innerHeight * 0.4);
        triggerFireworks(window.innerWidth * 0.7, window.innerHeight * 0.4);
        playPatrioticTrumpetFanfare();

        // AUTO-REDIRECT TO MUSIC SECTION & START PLAYBACK AUTOMATICALLY
        setTimeout(() => {
          const audioSection = document.getElementById("audioSection");
          if (audioSection) {
            audioSection.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              togglePlay();
            }, 600);
          }
        }, 1600);
      }
    }, 30);
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(hoistTimer);
    isHoisting = false;
    currentPos = 280;
    flagWrap.style.top = currentPos + "px";
    fill.style.width = "0%";
    statusText.innerHTML = `<i class="fa-solid fa-circle-info"></i> Click "Hoist Tiranga" to raise the flag!`;
  });

  petalsBtn.addEventListener("click", () => {
    triggerFlowerPetals();
    triggerFireworks(window.innerWidth * 0.5, window.innerHeight * 0.3);
  });
}

function playPatrioticTrumpetFanfare() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [
      { freq: 392.00, duration: 0.2, delay: 0 },    // G4
      { freq: 523.25, duration: 0.2, delay: 0.25 }, // C5
      { freq: 659.25, duration: 0.2, delay: 0.5 },  // E5
      { freq: 783.99, duration: 0.6, delay: 0.75 }  // G5
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.delay);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + n.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + n.delay);
      osc.stop(ctx.currentTime + n.delay + n.duration);
    });
  } catch (e) {
    console.log("Web Audio Fanfare:", e);
  }
}

/* --------------------------------------------------------------------------
   5. LOCAL MUSIC FOLDER PLAYER (100% WORKING RELIABLE AUDIO)
   -------------------------------------------------------------------------- */
const audioData = {
  anthem: {
    title: "Jana Gana Mana — National Anthem",
    durationSec: 52,
    localFiles: {
      singing: "./music/national_anthem_singing.mpeg",
      instumental: "./music/national_anthem_instumental.mpeg"
    },
    hindiLyrics: [
      "जनगणमन-अधिनायक जय हे भारतभाग्यविधाता।",
      "पंजाब सिन्धु गुजरात मराठा द्राविड़ उत्कल बंग।",
      "विन्ध्य हिमाचल यमुना गंगा उच्छलजलधितरंग।",
      "तव शुभ नामे जागे, तव शुभ आशिष मागे,",
      "गाहे तव जयगाथा।",
      "जनगणमंगलदायक जय हे भारतभाग्यविधाता।",
      "जय हे, जय हे, जय हे, जय जय जय, जय हे॥"
    ],
    englishLyrics: [
      "Jana-gana-mana-adhinayaka jaya he Bharata-bhagya-vidhata.",
      "Punjaba-Sindhu-Gujarata-Maratha Dravida-Utkala-Banga.",
      "Vindhya-Himachala-Yamuna-Ganga Uchchala-Jaladhi-taranga.",
      "Tava subha name jage, Tava subha asisa mage,",
      "Gahe tava jaya-gatha.",
      "Jana-gana-mangala-dayaka jaya he Bharata-bhagya-vidhata.",
      "Jaya he, jaya he, jaya he, Jaya jaya jaya, jaya he!"
    ]
  },
  vandemataram: {
    title: "Vande Mataram — National Song",
    durationSec: 68,
    localFiles: {
      singing: "./music/vande_matarm_singing.mpeg",
      instumental: "./music/vande_mataram_instumental.mpeg"
    },
    hindiLyrics: [
      "वन्दे मातरम्! सुजलां सुफलां मलयजशीतलाम्,",
      "शस्यश्यामलां मातरम्। वन्दे मातरम्!",
      "शुभ्रज्योत्स्नापुलकितयामिनीम्,",
      "फुल्लकुसुमितद्रुमदलशोभिनीम्,",
      "सुहासिनीं सुमधुर भाषिणीम्,",
      "सुखदां वरदां मातरम्॥ वन्दे मातरम्!"
    ],
    englishLyrics: [
      "Vande Mataram! Sujalam suphalam malayaja shitalam,",
      "Shasya shyamalam mataram! Vande Mataram!",
      "Shubhra jyotsna pulakita yaminim,",
      "Phulla kusumita drumadala shobhinim,",
      "Suhasinim sumadhura bhashinim,",
      "Sukhadam varadam mataram! Vande Mataram!"
    ]
  }
};

let currentTrackKey = "anthem";
let currentVersion = "singing";
let currentLang = "hindi";

let audioElement = new Audio();
audioElement.preload = "auto";

function initAudioEngine() {
  const tabBtns = document.querySelectorAll(".audio-tab-btn");
  const versionPills = document.querySelectorAll(".version-pill");
  const playBtn = document.getElementById("playAudioBtn");
  const stopBtn = document.getElementById("stopAudioBtn");
  const scrubber = document.getElementById("audioScrubber");
  const scrubberFill = document.getElementById("scrubberFill");
  const volumeSlider = document.getElementById("volumeSlider");
  const langBtns = document.querySelectorAll(".lang-btn");

  // Track Selector Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTrackKey = btn.dataset.track;
      loadTrack(currentTrackKey);
    });
  });

  // Version Toggle Pills (Singing / Vocal vs Instrumental)
  versionPills.forEach(pill => {
    pill.addEventListener("click", () => {
      versionPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentVersion = pill.dataset.version;
      loadTrack(currentTrackKey);
    });
  });

  // Language Switcher
  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      langBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      renderLyrics();
    });
  });

  if (playBtn) playBtn.addEventListener("click", togglePlay);
  if (stopBtn) stopBtn.addEventListener("click", stopTrack);

  if (scrubber) {
    scrubber.addEventListener("input", (e) => {
      if (audioElement.duration && !isNaN(audioElement.duration)) {
        audioElement.currentTime = (e.target.value / 100) * audioElement.duration;
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      audioElement.volume = parseFloat(e.target.value);
    });
  }

  audioElement.addEventListener("timeupdate", updateProgress);
  audioElement.addEventListener("ended", () => {
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    const badge = document.getElementById("nowPlayingBadge");
    if (badge) badge.innerHTML = `<i class="fa-solid fa-music"></i> Finished playing`;
  });

  loadTrack(currentTrackKey);
  initVisualizerCanvas();
}

function loadTrack(trackKey) {
  const t = audioData[trackKey];
  if (!t) return;

  const badge = document.getElementById("nowPlayingBadge");
  const title = document.getElementById("lyricsTitle");
  const durTime = document.getElementById("durationTime");

  const verText = currentVersion === "singing" ? "Singing / Vocal" : "Instrumental";

  if (badge) {
    badge.innerHTML = `<i class="fa-solid fa-music"></i> Ready [${verText}]: ${t.title}`;
  }

  if (title) title.innerText = `${t.title} (${verText})`;

  const isCurrentlyPlaying = !audioElement.paused;
  
  audioElement.pause();
  audioElement.src = t.localFiles[currentVersion];
  audioElement.currentTime = 0;
  audioElement.load();

  audioElement.onloadedmetadata = () => {
    if (durTime) durTime.innerText = formatTime(audioElement.duration || t.durationSec);
  };

  renderLyrics();

  if (isCurrentlyPlaying) {
    togglePlay();
  }
}

function renderLyrics() {
  const container = document.getElementById("lyricsText");
  if (!container) return;

  const t = audioData[currentTrackKey];
  const lines = currentLang === "hindi" ? t.hindiLyrics : t.englishLyrics;

  container.innerHTML = lines.map((line, idx) => `
    <div class="lyrics-line ${idx === 0 ? 'active-line' : ''}">${line}</div>
  `).join("");
}

function togglePlay() {
  const playBtn = document.getElementById("playAudioBtn");
  const badge = document.getElementById("nowPlayingBadge");
  const verText = currentVersion === "singing" ? "Vocal" : "Instrumental";

  if (audioElement.paused) {
    audioElement.volume = parseFloat(document.getElementById("volumeSlider")?.value || 0.9);
    
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        if (badge) badge.innerHTML = `<i class="fa-solid fa-volume-high fa-beat"></i> Playing [${verText}]: ${audioData[currentTrackKey].title}`;
      }).catch(err => {
        console.error("Playback error:", err);
        if (badge) badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Click Play to start audio`;
      });
    }
  } else {
    audioElement.pause();
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    if (badge) badge.innerHTML = `<i class="fa-solid fa-music"></i> Paused: ${audioData[currentTrackKey].title}`;
  }
}

function stopTrack() {
  const playBtn = document.getElementById("playAudioBtn");
  if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  audioElement.pause();
  audioElement.currentTime = 0;
  updateProgress();
}

function updateProgress() {
  const curTime = document.getElementById("currentTime");
  const scrubber = document.getElementById("audioScrubber");
  const fill = document.getElementById("scrubberFill");

  const cur = audioElement.currentTime || 0;
  const dur = (audioElement.duration && !isNaN(audioElement.duration)) ? audioElement.duration : audioData[currentTrackKey].durationSec;

  if (curTime) curTime.innerText = formatTime(cur);

  const pct = Math.min(100, (cur / dur) * 100);
  if (scrubber) scrubber.value = pct;
  if (fill) fill.style.width = pct + "%";

  const lines = document.querySelectorAll(".lyrics-line");
  if (lines.length > 0) {
    const activeIdx = Math.floor((cur / dur) * lines.length);
    lines.forEach((l, i) => {
      if (i === activeIdx) l.classList.add("active-line");
      else l.classList.remove("active-line");
    });
  }
}

function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function initVisualizerCanvas() {
  const canvas = document.getElementById("audioSpectrumCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function draw() {
    requestAnimationFrame(draw);

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const barCount = 32;
    const barWidth = (w / barCount) - 4;
    const isPlaying = !audioElement.paused;

    for (let i = 0; i < barCount; i++) {
      let amp = 10;
      if (isPlaying) {
        amp = Math.sin(Date.now() * 0.006 + i * 0.35) * (h * 0.3) + (h * 0.28);
      }

      const x = i * (barWidth + 4) + 2;
      const y = h - amp;

      let fillStyle = "#FF9933";
      if (i > 10 && i <= 20) fillStyle = "#FFFFFF";
      else if (i > 20) fillStyle = "#138808";

      ctx.fillStyle = fillStyle;
      ctx.shadowBlur = isPlaying ? 12 : 0;
      ctx.shadowColor = fillStyle;
      ctx.fillRect(x, y, barWidth, amp);
    }
  }

  draw();
}

/* --------------------------------------------------------------------------
   6. ZEEL RUPAPARA WISH CARD GENERATOR & LANDSCAPE MOBILE EXPORT (PNG/PDF)
   -------------------------------------------------------------------------- */
function renderLandscapeWishCardCanvas(wishCardEl) {
  return new Promise((resolve, reject) => {
    const isWhiteTheme = wishCardEl.classList.contains("theme-light");
    
    // Clone element to force exact 850px Landscape canvas regardless of mobile screen width
    const clone = wishCardEl.cloneNode(true);
    clone.style.width = "850px";
    clone.style.maxWidth = "none";
    clone.style.minWidth = "850px";
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.zIndex = "-9999";
    clone.style.transform = "none";
    clone.style.boxShadow = "none";

    // Format interior layout in pristine landscape alignment
    const bodyContent = clone.querySelector(".card-body-content");
    if (bodyContent) bodyContent.style.padding = "40px 36px";

    const title = clone.querySelector(".card-main-title");
    if (title) title.style.fontSize = "2.4rem";

    const message = clone.querySelector(".card-message-text");
    if (message) {
      message.style.fontSize = "1.25rem";
      message.style.lineHeight = "1.7";
      message.style.marginBottom = "30px";
    }

    const footerTags = clone.querySelector(".card-footer-tags");
    if (footerTags) {
      footerTags.style.display = "flex";
      footerTags.style.flexDirection = "row";
      footerTags.style.justifyContent = "space-between";
      footerTags.style.alignItems = "center";
      footerTags.style.textAlign = "left";
      footerTags.style.paddingTop = "24px";
    }

    const badgeSeal = clone.querySelector(".tag-badge-seal");
    if (badgeSeal) badgeSeal.style.textAlign = "right";

    document.body.appendChild(clone);

    html2canvas(clone, {
      scale: 2,
      useCORS: true,
      width: 850,
      windowWidth: 1200,
      backgroundColor: isWhiteTheme ? "#FFFFFF" : "#070B14"
    }).then(canvas => {
      document.body.removeChild(clone);
      resolve(canvas);
    }).catch(err => {
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
      reject(err);
    });
  });
}

function initZeelWishes() {
  const nameInput = document.getElementById("visitorNameInput");
  const msgSelect = document.getElementById("wishMsgSelect");
  const generateBtn = document.getElementById("generateWishBtn");
  const wishOutput = document.getElementById("wishOutputCard");
  const wishCardEl = document.getElementById("downloadableWishCard");
  const bodyText = document.getElementById("customWishBody");
  const authorTag = document.getElementById("customWishAuthor");
  const themePills = document.querySelectorAll(".card-theme-selector .theme-pill");

  const downloadImgBtn = document.getElementById("downloadWishImgBtn");
  const downloadPdfBtn = document.getElementById("downloadWishPdfBtn");
  const copyBtn = document.getElementById("copyWishBtn");

  if (!generateBtn) return;

  const messagesMap = {
    "1": `"May the tricolor flag fly high and fill your life with eternal freedom, unity, and glory!"`,
    "2": `"Freedom in mind, faith in words, pride in our heart. Wishing you a proud and joyful Happy 80th Independence Day!"`,
    "3": `"Saluting the brave martyrs who gave their lives so we could breathe in a free nation. Jai Hind!"`
  };

  // Certificate Theme Switcher (Dark vs White)
  themePills.forEach(pill => {
    pill.addEventListener("click", () => {
      themePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const selectedTheme = pill.dataset.cardTheme;
      if (selectedTheme === "light") {
        wishCardEl.classList.remove("theme-dark");
        wishCardEl.classList.add("theme-light");
      } else {
        wishCardEl.classList.remove("theme-light");
        wishCardEl.classList.add("theme-dark");
      }
    });
  });

  generateBtn.addEventListener("click", () => {
    const rawName = nameInput.value.trim();
    const visitorName = rawName ? rawName : "A Proud Indian";
    const selectedMsgKey = msgSelect ? msgSelect.value : "1";

    bodyText.innerText = messagesMap[selectedMsgKey] || messagesMap["1"];
    authorTag.innerText = `${visitorName} & Zeel Rupapara`;

    wishOutput.classList.remove("hidden");
    wishOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });

    triggerFireworks(window.innerWidth * 0.5, window.innerHeight * 0.5);
    triggerFlowerPetals();
  });

  // Download Card as Photo (PNG) — Full-Width Landscape format on Phone & Desktop
  if (downloadImgBtn) {
    downloadImgBtn.addEventListener("click", () => {
      const visitorName = nameInput.value.trim() || "ProudIndian";
      downloadImgBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating Landscape Photo...`;

      if (typeof html2canvas !== "undefined") {
        renderLandscapeWishCardCanvas(wishCardEl).then(canvas => {
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `Azaadi_WishCard_${visitorName.replace(/\s+/g, '_')}.png`;
          link.href = image;
          link.click();

          downloadImgBtn.innerHTML = `<i class="fa-solid fa-check"></i> Photo Downloaded!`;
          setTimeout(() => {
            downloadImgBtn.innerHTML = `<i class="fa-solid fa-file-image"></i> Download Card as Photo (PNG)`;
          }, 3000);
        }).catch(err => {
          console.error("html2canvas error:", err);
          downloadImgBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error Exporting`;
        });
      } else {
        alert("Image generator library is loading, please try again in a moment.");
      }
    });
  }

  // Download Card as PDF — Full-Width Landscape format on Phone & Desktop
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      const visitorName = nameInput.value.trim() || "ProudIndian";
      downloadPdfBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating Landscape PDF...`;

      if (typeof html2canvas !== "undefined" && window.jspdf) {
        renderLandscapeWishCardCanvas(wishCardEl).then(canvas => {
          const imgData = canvas.toDataURL("image/jpeg", 0.98);
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height]
          });

          pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
          pdf.save(`Azaadi_WishCard_${visitorName.replace(/\s+/g, '_')}.pdf`);

          downloadPdfBtn.innerHTML = `<i class="fa-solid fa-check"></i> PDF Downloaded!`;
          setTimeout(() => {
            downloadPdfBtn.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Download Card as PDF`;
          }, 3000);
        }).catch(err => {
          console.error("jsPDF error:", err);
          downloadPdfBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error Exporting PDF`;
        });
      } else {
        alert("PDF generator library is loading, please try again in a moment.");
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const visitorName = nameInput.value.trim() || "A Proud Indian";
      const textToCopy = `Happy 80th Independence Day! Warmest wishes from ${visitorName}\nCelebrate India's freedom with patriotic songs, flag hoisting, and custom wish cards: ${window.location.href}`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied Text!`;
        setTimeout(() => {
          copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy Text`;
        }, 3000);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   7. NAVIGATION & SCROLL SPY
   -------------------------------------------------------------------------- */
function initNavigation() {
  const toggle = document.getElementById("mobileNavToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-item");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      if (navLinks) navLinks.classList.remove("active");
    });
  });

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      const targetNav = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach(n => n.classList.remove("active"));
          targetNav.classList.add("active");
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. QUOTE CAROUSEL
   -------------------------------------------------------------------------- */
function initQuoteCarousel() {
  const quoteElems = Array.from(document.querySelectorAll(".quote"));
  const dotsWrap = document.getElementById("quoteDots");
  let quoteIndex = 0;
  let quoteTimer;

  if (quoteElems.length && dotsWrap) {
    dotsWrap.innerHTML = "";
    quoteElems.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Show quote " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => showQuote(i, true));
      dotsWrap.appendChild(dot);
    });

    function showQuote(i, manual) {
      quoteElems[quoteIndex].classList.remove("active");
      dotsWrap.children[quoteIndex].classList.remove("active");
      quoteIndex = i;
      quoteElems[quoteIndex].classList.add("active");
      dotsWrap.children[quoteIndex].classList.add("active");
      if (manual) restartTimer();
    }

    function restartTimer() {
      clearInterval(quoteTimer);
      quoteTimer = setInterval(() => {
        showQuote((quoteIndex + 1) % quoteElems.length, false);
      }, 5000);
    }

    restartTimer();
  }
}

/* --------------------------------------------------------------------------
   9. LIVE CLOCK DISPLAY
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById("liveClockDisplay");
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-IN', options);
    clockEl.innerText = `${dateStr} • Happy 80th Swatantrata Diwas!`;
  }
  updateClock();
}
