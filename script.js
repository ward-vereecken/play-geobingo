const revealNodes = document.querySelectorAll(".reveal");

window.addEventListener("load", () => {
  document.body.classList.add("page-ready");
});

const heroCardSnackMessages = [
  "Love the enthousiasm, you'll find out more in the app!",
  "When you download the app, you'll be able to explore all of this!",
  "Okay buddy, please download the app or try out the demo first",
  "This is getting awkward",
  "Please leave me alone",
  "Okay you win",
  "Kidding, won't be that easy.",
  "You really like buttons, huh?",
  "We can do this all day",
  "This is getting silly",
  "Actually no I haven't got all day bro",
  "This website takes 1 minute to read please just read it and then decide whether to download or not",
  "I admire the dedication buddy but what are you genuinely trying to prove here",
  "Last warning (not really)",
  "We're both a couple of clicks away from peace. Just decide, but please stop this useless clicking",
  "Is this our life now?",
  "Okay, okay, I see you. You actually won.",
  "Kidding lol",
  "Okay this is my last one. I'm giving up. The texts will start looping now. Bye.",
  "Kidding LOLLLLLLLLLLL you really thought",
  "Okay man you're clinically insane. Get help. I mean it.",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "OKAY. YOU WIN. HERE. Take this. I'm leaving now. It's been an honour. Goodbye.",
];

let heroCardSnackCount = 0;
let heroCardSnackLocked = false;
let heroSnackHideTimer = null;

const siteSnackbar = document.getElementById("site-snackbar");
const joinBanner = document.getElementById("join-banner");
const joinCodeLabel = document.getElementById("join-code-label");
const joinOpenApp = document.getElementById("join-open-app");
const joinDownloadApp = document.getElementById("join-download-app");
const heroCards = Array.from(document.querySelectorAll(".hero-support-grid .support-card"));
const featureCards = Array.from(document.querySelectorAll(".feature-grid .feature-card-button"));
const heroCopy = document.querySelector(".hero-copy");
const heroVisual = document.querySelector(".hero-visual");
const heroCarouselShell = document.querySelector(".hero-carousel-shell");
const ctaReviewAuthor = document.getElementById("cta-review-author");
const ctaReviewText = document.querySelector(".cta-review p");

const ctaReviews = [
  {
    author: "Belgium App Store user",
    text: "I love love love this! Amazing app to learn new things and geography in a fun way.",
  },
  {
    author: "Cem Noel",
    text: "Best geography quiz app I’ve ever played! So much to do.",
  },
  {
    author: "Amy",
    text: "It’s so refreshing to have a well made game that doesn’t flood us with ads.",
  },
  {
    author: "Rafaela Sales",
    text: "So far the app is great, it’s the Duolingo of geography.",
  },
];

const appStoreUrl = "https://apps.apple.com/us/app/geobingo-geography-quiz/id6758577949";
const playStoreUrl = "https://play.google.com/store/apps/details?id=com.wardvereecken.geobingo&hl=en";

function getDownloadUrl() {
  const userAgent = navigator.userAgent || "";
  const isAppleDevice =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroidDevice = /Android/i.test(userAgent);

  if (isAppleDevice) {
    return appStoreUrl;
  }
  if (isAndroidDevice) {
    return playStoreUrl;
  }
  return "#download";
}

function getMultiplayerJoinCode() {
  const params = new URLSearchParams(window.location.search);
  const rawCode = params.get("code") || params.get("session") || "";
  const code = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return code.length >= 6 ? code : "";
}

function setupJoinBanner() {
  const code = getMultiplayerJoinCode();
  if (!code || !joinBanner || !joinCodeLabel || !joinOpenApp) {
    return;
  }

  const deepLink = `geobingo://join?code=${encodeURIComponent(code)}`;
  const downloadUrl = getDownloadUrl();
  joinCodeLabel.textContent = code;
  joinOpenApp.href = deepLink;
  if (joinDownloadApp) {
    joinDownloadApp.href = downloadUrl;
    if (downloadUrl !== "#download") {
      joinDownloadApp.target = "_blank";
      joinDownloadApp.rel = "noreferrer";
    }
  }
  joinOpenApp.addEventListener("click", (event) => {
    if (downloadUrl === "#download") {
      return;
    }

    event.preventDefault();
    const openedAt = Date.now();
    window.location.href = deepLink;
    window.setTimeout(() => {
      if (document.hidden || Date.now() - openedAt > 1800) {
        return;
      }
      window.location.href = downloadUrl;
    }, 1100);
  });
  joinBanner.hidden = false;
}

setupJoinBanner();

function showSiteSnackbar(message, duration = 5200) {
  if (!siteSnackbar) {
    return;
  }

  siteSnackbar.classList.remove("visible", "animating");
  void siteSnackbar.offsetWidth;
  siteSnackbar.textContent = message;
  siteSnackbar.classList.add("visible", "animating");

  if (heroSnackHideTimer) {
    window.clearTimeout(heroSnackHideTimer);
  }

  heroSnackHideTimer = window.setTimeout(() => {
    siteSnackbar.classList.remove("visible", "animating");
  }, duration);
}

function handleHeroCardSnack() {
  heroCardSnackCount += 1;

  let message = "...";
  if (heroCardSnackLocked || heroCardSnackCount > 22) {
    heroCardSnackLocked = true;
    message = "...";
  } else if (heroCardSnackCount === 22) {
    heroCardSnackLocked = true;
    message = heroCardSnackMessages[21];
  } else {
    const index = Math.max(0, Math.min(heroCardSnackMessages.length - 1, heroCardSnackCount - 1));
    message = heroCardSnackMessages[index];
  }

  showSiteSnackbar(message);
}

heroCards.forEach((card) => {
  card.addEventListener("click", handleHeroCardSnack);
});

featureCards.forEach((node) => {
  node.addEventListener("click", handleHeroCardSnack);
});

function syncHeroColumnHeights() {
  if (!heroCopy || !heroVisual || !heroCarouselShell) {
    return;
  }

  if (window.innerWidth <= 1180) {
    heroVisual.style.height = "";
    heroCarouselShell.style.height = "";
    return;
  }

  const copyHeight = heroCopy.getBoundingClientRect().height;
  const targetHeight = `${Math.ceil(copyHeight)}px`;
  heroVisual.style.height = targetHeight;
  heroCarouselShell.style.height = targetHeight;
}

window.addEventListener("load", syncHeroColumnHeights);
window.addEventListener("resize", syncHeroColumnHeights);

if (ctaReviewAuthor && ctaReviewText) {
  let ctaReviewIndex = 0;

  window.setInterval(() => {
    ctaReviewIndex = (ctaReviewIndex + 1) % ctaReviews.length;
    const next = ctaReviews[ctaReviewIndex];

    ctaReviewText.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(8px)" },
      ],
      {
        duration: 180,
        easing: "ease-in",
        fill: "forwards",
      },
    ).onfinish = () => {
      ctaReviewText.textContent = `“${next.text}”`;
      ctaReviewAuthor.textContent = next.author;
      ctaReviewText.animate(
        [
          { opacity: 0, transform: "translateY(-8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 240,
          easing: "ease-out",
          fill: "forwards",
        },
      );
    };
  }, 4000);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealNodes.forEach((node) => revealObserver.observe(node));

const heroCarouselImage = document.getElementById("hero-carousel-image");
const heroCarouselDots = document.getElementById("hero-carousel-dots");
const heroPrev = document.getElementById("hero-prev");
const heroNext = document.getElementById("hero-next");

const heroSlides = [
  {
    image: "./assets/screens/news-01.png",
    caption: "Guided lessons, polished rewards, and a map-first flow all the way through.",
  },
  {
    image: "./assets/screens/news-02.png",
    caption: "Challenge menus, collections, and progression all keep the app feeling alive.",
  },
  {
    image: "./assets/screens/news-03.png",
    caption: "Journey and daily systems make the next step feel obvious instead of overwhelming.",
  },
  {
    image: "./assets/screens/news-04.png",
    caption: "GeoDex and mastery tracking turn progress into something you can actually see.",
  },
  {
    image: "./assets/screens/news-05.png",
    caption: "Short sessions still feel satisfying because the app wraps them in a bigger loop.",
  },
  {
    image: "./assets/screens/news-06.png",
    caption: "The UI stays soft and playful without feeling cheap or generic.",
  },
  {
    image: "./assets/screens/news-07.png",
    caption: "Modes branch outward into flags, maps, trivia, nature, space, and beyond.",
  },
  {
    image: "./assets/screens/news-08.png",
    caption: "It is built to be pretty, but also to keep you learning for a long time.",
  },
];

if (heroCarouselImage && heroCarouselDots) {
  let heroCarouselIndex = 0;
  let heroIntervalId = null;

  function renderHeroDots() {
    heroCarouselDots.innerHTML = "";
    heroSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
      if (index === heroCarouselIndex) {
        dot.classList.add("active");
      }
      dot.addEventListener("click", () => {
        setHeroSlide(index);
        restartHeroInterval();
      });
      heroCarouselDots.appendChild(dot);
    });
  }

  function setHeroSlide(index) {
    heroCarouselIndex = (index + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[heroCarouselIndex];
    const preload = new Image();
    preload.src = slide.image;

    heroCarouselImage.src = slide.image;
    renderHeroDots();
    heroCarouselImage.animate(
      [
        { opacity: 0.38, transform: "scale(1.01)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      {
        duration: 260,
        easing: "ease-out",
        fill: "forwards",
      },
    );
  }

  function advanceHero(step) {
    setHeroSlide(heroCarouselIndex + step);
  }

  function restartHeroInterval() {
    if (heroIntervalId) {
      window.clearInterval(heroIntervalId);
    }
    heroIntervalId = window.setInterval(() => advanceHero(1), 3300);
  }

  heroPrev?.addEventListener("click", () => {
    advanceHero(-1);
    restartHeroInterval();
  });

  heroNext?.addEventListener("click", () => {
    advanceHero(1);
    restartHeroInterval();
  });

  renderHeroDots();
  restartHeroInterval();
  syncHeroColumnHeights();
}

const demoWorldGeoJson = window.DEMO_WORLD_GEOJSON || null;

const miniLessonQuestions = [
  {
    type: "flag",
    lessonFamily: "flags",
    prompt: "Which country does this flag belong to?",
    media: {
      type: "flag",
      src: "./assets/flags/ca.svg",
      alt: "Canada flag",
    },
    options: ["Canada", "The United States", "the United Kingdom", "Australia", "France", "Germany"],
    answer: "Canada",
    correctMessage: "Canada chose the maple leaf because it had already been a national symbol for centuries. In 1965, the country adopted this bold design to represent Canada without any colonial emblems.",
  },
  {
    type: "map",
    lessonFamily: "countries",
    prompt: "Which country is highlighted?",
    mapTarget: "France",
    mapCenter: [46.4, 2.5],
    mapZoom: 4.4,
    options: ["France", "Italy", "Germany", "Spain", "Belgium", "Switzerland"],
    answer: "France",
    correctMessage: "France is the most visited country in the world and spans 12 time zones because of overseas territories from its colonial past.",
  },
  {
    type: "pinpoint",
    lessonFamily: "locations",
    prompt: "Pinpoint the United States of America on the map",
    mapTarget: "The United States of America",
    correctMessage: "the United States is home to the world’s largest economy and the first humans on the Moon.",
  },
  {
    type: "capital_map",
    lessonFamily: "capitals",
    prompt: "Which is the capital of Japan?",
    mapTarget: "Japan",
    mapCenter: [36.2, 138.3],
    mapZoom: 4.2,
    capitalMarker: [35.6762, 139.6503],
    options: ["Tokyo", "Seoul", "Beijing", "Bangkok", "Taipei", "Manila"],
    answer: "Tokyo",
    correctMessage: "Tokyo is the most populous metropolitan area in the world.",
  },
  {
    type: "trivia",
    lessonFamily: "trivia",
    prompt: "Which country has the most time zones including overseas territories?",
    options: ["Russia", "USA", "France", "China"],
    answer: "France",
    correctMessage: "France spans 12 time zones due to its overseas departments and territories.",
  },
];

const miniTitle = document.getElementById("mini-lesson-title");
const miniLabelIcon = document.getElementById("mini-lesson-label-icon");
const miniMedia = document.getElementById("mini-lesson-media");
const miniInlineTools = document.getElementById("mini-lesson-inline-tools");
const miniOptions = document.getElementById("mini-lesson-options");
const miniFact = document.getElementById("mini-lesson-fact");
const miniFactIcon = document.getElementById("mini-lesson-fact-icon");
const miniFeedback = document.getElementById("mini-lesson-feedback");
const miniProgress = document.getElementById("mini-lesson-progress");
const miniProgressFill = document.getElementById("mini-lesson-progress-fill");
const miniReset = document.getElementById("mini-lesson-reset");
const miniFastToggle = document.getElementById("mini-lesson-fast-toggle");
const miniFastToggleIcon = document.getElementById("mini-lesson-fast-toggle-icon");
const miniNext = document.getElementById("mini-lesson-next");
const miniLearnAll = document.getElementById("mini-lesson-learn-all");

if (miniTitle && miniLabelIcon && miniMedia && miniInlineTools && miniOptions && miniFact && miniFactIcon && miniFeedback && miniProgress && miniProgressFill && miniReset && miniFastToggle && miniFastToggleIcon && miniNext && miniLearnAll) {
  let currentQuestionIndex = 0;
  let score = 0;
  let locked = false;
  let answeredCurrentQuestion = false;
  let miniFastModeEnabled = false;
  let leafMap = null;
  let leafGeoLayer = null;
  let leafHighlightGlowLayer = null;
  let leafHighlightCoreLayer = null;
  let leafSuccessGlowLayer = null;
  let leafSuccessCoreLayer = null;
  let capitalMarkerLayer = null;
  let pinpointAnswered = false;
  let miniFastAdvanceTimer = null;

  const lessonTypeMeta = {
    flags: {
      icon: "./assets/icons/flags2.webp",
      cta: "Learn all flags",
    },
    countries: {
      icon: "./assets/icons/identify1.webp",
      cta: "Learn all countries",
    },
    locations: {
      icon: "./assets/icons/pinpoint2.webp",
      cta: "Learn all locations",
    },
    capitals: {
      icon: "./assets/icons/capital1.webp",
      cta: "Learn all capitals",
    },
    trivia: {
      icon: "./assets/icons/globe1.webp",
      cta: "Learn all trivia",
    },
  };

  function setNextEnabled(enabled) {
    answeredCurrentQuestion = enabled;
    miniNext.disabled = !enabled;
  }

  function clearMiniFastAdvanceTimer() {
    if (miniFastAdvanceTimer) {
      window.clearTimeout(miniFastAdvanceTimer);
      miniFastAdvanceTimer = null;
    }
  }

  function updateLessonChrome(question) {
    const meta = lessonTypeMeta[question.lessonFamily] || lessonTypeMeta.countries;
    miniLabelIcon.src = meta.icon;
    miniLearnAll.textContent = meta.cta;
  }

  function updateMiniFastToggleVisual() {
    miniFastToggle.classList.toggle("is-active", miniFastModeEnabled);
    miniFastToggleIcon.src = miniFastModeEnabled
      ? "./assets/icons/fast_mode3.webp"
      : "./assets/icons/slow_mode1.webp";
    miniNext.style.display = miniFastModeEnabled ? "none" : "";
  }

  function showFastModeSnackbar() {
    if (miniFastModeEnabled) {
      showSiteSnackbar(
        'Fast mode activated! No need to tap "Next" anymore after answering a question now. You might miss the fun facts though!',
        8000,
      );
      return;
    }

    showSiteSnackbar(
      'Fast mode turned off. You will need to tap "Next" again after answering, and you will see the fun facts normally.',
      8000,
    );
  }

  function maybeAutoAdvanceAnsweredQuestion() {
    if (!miniFastModeEnabled || !answeredCurrentQuestion) {
      return;
    }
    scheduleMiniFastAdvance();
  }

  function setFactVisibility(visible) {
    miniFact.classList.toggle("is-hidden", !visible);
  }

  function teardownLeafletMap() {
    clearMiniFastAdvanceTimer();
    if (capitalMarkerLayer) {
      if (typeof capitalMarkerLayer.remove === "function") {
        capitalMarkerLayer.remove();
      }
      capitalMarkerLayer = null;
    }
    if (leafHighlightGlowLayer) {
      if (typeof leafHighlightGlowLayer.remove === "function") {
        leafHighlightGlowLayer.remove();
      }
      leafHighlightGlowLayer = null;
    }
    if (leafHighlightCoreLayer) {
      if (typeof leafHighlightCoreLayer.remove === "function") {
        leafHighlightCoreLayer.remove();
      }
      leafHighlightCoreLayer = null;
    }
    if (leafSuccessGlowLayer) {
      if (typeof leafSuccessGlowLayer.remove === "function") {
        leafSuccessGlowLayer.remove();
      }
      leafSuccessGlowLayer = null;
    }
    if (leafSuccessCoreLayer) {
      if (typeof leafSuccessCoreLayer.remove === "function") {
        leafSuccessCoreLayer.remove();
      }
      leafSuccessCoreLayer = null;
    }
    if (leafGeoLayer) {
      if (typeof leafGeoLayer.remove === "function") {
        leafGeoLayer.remove();
      }
      leafGeoLayer = null;
    }
    if (leafMap) {
      leafMap.remove();
      leafMap = null;
    }
  }

  function normalizeMapTarget(targetName) {
    if (targetName === "The United States" || targetName === "The United States of America") {
      return "the United States of America";
    }
    return targetName;
  }

  function sameCountryName(a, b) {
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  }

  function updateFastModeToolVisual() {
    const fastButton = document.getElementById("mini-map-tool-fast");
    const fastIcon = document.getElementById("mini-map-tool-fast-icon");
    if (!fastButton || !fastIcon) {
      return;
    }

    fastButton.classList.toggle("is-active", miniFastModeEnabled);
    fastIcon.src = miniFastModeEnabled
      ? "./assets/icons/fast_mode3.webp"
      : "./assets/icons/slow_mode1.webp";
  }

  function scheduleMiniFastAdvance() {
    clearMiniFastAdvanceTimer();
    if (!miniFastModeEnabled) {
      return;
    }
    miniFastAdvanceTimer = window.setTimeout(() => {
      clearMiniFastAdvanceTimer();
      goToNextQuestion();
    }, 900);
  }

  function renderLeafletMap(question) {
    if (!miniMedia || !window.L || !demoWorldGeoJson) {
      miniMedia.innerHTML = '<div class="mini-lesson-map-shell"><div class="mini-map-caption">Map preview unavailable here.</div></div>';
      return;
    }

    const targetName = question.mapTarget;
    const geoTargetName = normalizeMapTarget(targetName);
    const isPinpoint = question.type === "pinpoint";
    const isCapitalMap = question.type === "capital_map";

    miniMedia.innerHTML = `
      <div class="mini-lesson-map-shell">
        <div class="mini-map-tool-panel">
          <button class="mini-map-tool" id="mini-map-tool-zoom-in" type="button" aria-label="Zoom in">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
          </button>
          <button class="mini-map-tool" id="mini-map-tool-zoom-out" type="button" aria-label="Zoom out">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14"></path>
            </svg>
          </button>
          <button class="mini-map-tool ${miniFastModeEnabled ? "is-active" : ""}" id="mini-map-tool-fast" data-action="fast" type="button" aria-label="Toggle fast mode">
            <img id="mini-map-tool-fast-icon" src="${miniFastModeEnabled ? "./assets/icons/fast_mode3.webp" : "./assets/icons/slow_mode1.webp"}" alt="" />
          </button>
        </div>
        <div class="mini-lesson-map" id="mini-lesson-map-canvas"></div>
        <div class="mini-map-caption">${isPinpoint ? "Move around the real map and tap the country itself." : isCapitalMap ? "" : "Pan and zoom the real world map while the answer stays highlighted."}</div>
      </div>
    `;

    const mapNode = document.getElementById("mini-lesson-map-canvas");
    if (!mapNode) return;

    teardownLeafletMap();

    leafMap = L.map(mapNode, {
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      preferCanvas: true,
    }).setView(question.mapCenter || [22, 10], question.mapZoom || 2);

    const zoomInButton = document.getElementById("mini-map-tool-zoom-in");
    const zoomOutButton = document.getElementById("mini-map-tool-zoom-out");
    const fastButton = document.getElementById("mini-map-tool-fast");

    [zoomInButton, zoomOutButton, fastButton].forEach((button) => {
      if (!button) {
        return;
      }
      button.addEventListener("pointerdown", () => {
        button.classList.add("is-pressed");
      });
      const clearPressed = () => button.classList.remove("is-pressed");
      button.addEventListener("pointerup", clearPressed);
      button.addEventListener("pointerleave", clearPressed);
      button.addEventListener("pointercancel", clearPressed);
    });

    zoomInButton?.addEventListener("click", () => leafMap?.zoomIn());
    zoomOutButton?.addEventListener("click", () => leafMap?.zoomOut());
    fastButton?.addEventListener("click", () => {
      miniFastModeEnabled = !miniFastModeEnabled;
      updateFastModeToolVisual();
      updateMiniFastToggleVisual();
      showFastModeSnackbar();
      maybeAutoAdvanceAnsweredQuestion();
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 6,
      minZoom: 1,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(leafMap);

    pinpointAnswered = false;

    if (!leafMap.getPane("mini-highlight-glow")) {
      leafMap.createPane("mini-highlight-glow");
      leafMap.getPane("mini-highlight-glow").style.zIndex = "401";
    }
    if (!leafMap.getPane("mini-highlight-core")) {
      leafMap.createPane("mini-highlight-core");
      leafMap.getPane("mini-highlight-core").style.zIndex = "402";
    }

    leafGeoLayer = L.geoJSON(demoWorldGeoJson, {
      style: (feature) => {
        const name = feature?.properties?.name;
        return {
          color: "rgba(118, 103, 173, 0.34)",
          weight: 1,
          fillColor: "rgba(255,255,255,0.80)",
          fillOpacity: 0.8,
        };
      },
      interactive: isPinpoint,
      onEachFeature: isPinpoint
        ? (feature, layer) => {
            layer.on({
              mouseover: () => {
                if (!pinpointAnswered) {
                  layer.setStyle({
                    fillColor: "#daccff",
                    fillOpacity: 0.92,
                  });
                }
              },
              mouseout: () => {
                if (!pinpointAnswered) {
                  leafGeoLayer.resetStyle(layer);
                }
              },
              click: () => {
                if (locked || pinpointAnswered) {
                  return;
                }
                pinpointAnswered = true;
                locked = true;
                const clickedName = feature?.properties?.name;
                leafGeoLayer.eachLayer((otherLayer) => {
                  const otherName = otherLayer.feature?.properties?.name;
                  if (sameCountryName(otherName, geoTargetName)) {
                    otherLayer.setStyle({
                      color: "rgba(76, 175, 114, 0)",
                      weight: 0,
                      fillColor: "rgba(128, 216, 159, 0)",
                      fillOpacity: 0,
                    });
                  } else if (sameCountryName(otherName, clickedName) && !sameCountryName(clickedName, geoTargetName)) {
                    otherLayer.setStyle({
                      color: "#dd6c82",
                      weight: 2,
                      fillColor: "#ffb3c0",
                      fillOpacity: 0.95,
                    });
                  } else {
                    otherLayer.setStyle({
                      color: "rgba(118, 103, 173, 0.26)",
                      weight: 1,
                      fillColor: "rgba(255,255,255,0.54)",
                      fillOpacity: 0.6,
                    });
                  }
                });

                if (sameCountryName(clickedName, geoTargetName)) {
                  const successFeature = demoWorldGeoJson.features.filter((countryFeature) =>
                    sameCountryName(countryFeature?.properties?.name, geoTargetName),
                  );

                  leafSuccessGlowLayer = L.geoJSON(
                    { type: "FeatureCollection", features: successFeature },
                    {
                      pane: "mini-highlight-glow",
                      interactive: false,
                      style: {
                        color: "rgba(120, 226, 156, 0.34)",
                        weight: 18,
                        opacity: 1,
                        fillColor: "rgba(138, 235, 171, 0.28)",
                        fillOpacity: 0.95,
                        lineJoin: "round",
                      },
                    },
                  ).addTo(leafMap);

                  leafSuccessCoreLayer = L.geoJSON(
                    { type: "FeatureCollection", features: successFeature },
                    {
                      pane: "mini-highlight-core",
                      interactive: false,
                      style: {
                        color: "#47b56f",
                        weight: 3,
                        opacity: 1,
                        fillColor: "#86dfa5",
                        fillOpacity: 0.97,
                        lineJoin: "round",
                      },
                    },
                  ).addTo(leafMap);

                  score += 1;
                  miniFeedback.textContent = question.correctMessage;
                } else {
                  miniFeedback.textContent = `Not quite. That was ${clickedName}. The correct answer is ${targetName}.`;
                }
                if (miniFastModeEnabled) {
                  setFactVisibility(false);
                  setNextEnabled(false);
                  scheduleMiniFastAdvance();
                } else {
                  setFactVisibility(true);
                  setNextEnabled(true);
                }
              },
            });
          }
        : undefined,
    }).addTo(leafMap);

    if (!isPinpoint) {
      const targetFeature = demoWorldGeoJson.features.filter((feature) =>
        sameCountryName(feature?.properties?.name, geoTargetName),
      );
      const highlightGlowColor = isCapitalMap
        ? "rgba(127, 204, 255, 0.34)"
        : "rgba(182, 156, 243, 0.34)";
      const highlightGlowFill = isCapitalMap
        ? "rgba(138, 214, 255, 0.26)"
        : "rgba(201, 181, 247, 0.26)";
      const highlightCoreBorder = isCapitalMap ? "#4f9ce8" : "#927edb";
      const highlightCoreFill = isCapitalMap ? "#8fd3ff" : "#c6b6f3";

      leafHighlightGlowLayer = L.geoJSON(
        { type: "FeatureCollection", features: targetFeature },
        {
          pane: "mini-highlight-glow",
          interactive: false,
          style: {
            color: highlightGlowColor,
            weight: 18,
            opacity: 1,
            fillColor: highlightGlowFill,
            fillOpacity: 0.95,
            lineJoin: "round",
          },
        },
      ).addTo(leafMap);

      leafHighlightCoreLayer = L.geoJSON(
        { type: "FeatureCollection", features: targetFeature },
        {
          pane: "mini-highlight-core",
          interactive: false,
          style: {
            color: highlightCoreBorder,
            weight: 3,
            opacity: 1,
            fillColor: highlightCoreFill,
            fillOpacity: 0.96,
            lineJoin: "round",
          },
        },
      ).addTo(leafMap);
    }

    if (isCapitalMap && Array.isArray(question.capitalMarker)) {
      L.circleMarker(question.capitalMarker, {
        radius: 16,
        color: "rgba(91, 146, 221, 0.24)",
        weight: 6,
        fillOpacity: 0,
      }).addTo(leafMap);

      capitalMarkerLayer = L.marker(question.capitalMarker, {
        interactive: false,
        icon: L.divIcon({
          className: "",
          html: '<div class="mini-capital-marker"><img src="./assets/icons/capital1.webp" alt="" /></div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(leafMap);
    }
  }

  function renderMiniMedia(question) {
    miniMedia.innerHTML = "";
    miniFastToggle.classList.remove("is-in-media");
    miniInlineTools.classList.add("is-hidden");
    miniInlineTools.appendChild(miniFastToggle);

    if (question.type === "flag" && question.media?.src) {
      miniMedia.classList.remove("is-empty");
      miniMedia.innerHTML = `
        <div class="mini-lesson-flag-shell">
          <div class="mini-lesson-flag-card">
            <div class="mini-lesson-flag-card-inner">
              <img class="mini-lesson-flag-image" src="${question.media.src}" alt="${question.media.alt || ""}" />
            </div>
          </div>
        </div>
      `;
      const flagShell = miniMedia.querySelector(".mini-lesson-flag-shell");
      if (flagShell) {
        miniFastToggle.classList.add("is-in-media");
        flagShell.appendChild(miniFastToggle);
      }
      return;
    }

    if (question.type === "map" || question.type === "pinpoint" || question.type === "capital_map") {
      miniMedia.classList.remove("is-empty");
      renderLeafletMap(question);
      return;
    }

    miniMedia.classList.add("is-empty");
    teardownLeafletMap();
    miniInlineTools.classList.remove("is-hidden");
  }

  function finishMiniLesson() {
    clearMiniFastAdvanceTimer();
    miniTitle.classList.remove("fit-one-line");
    miniTitle.textContent = `Demo finished. You got ${score} / ${miniLessonQuestions.length}.`;
    miniProgress.textContent = "";
    miniProgressFill.style.width = "100%";
    miniOptions.innerHTML = "";
    miniMedia.innerHTML = "";
    miniMedia.classList.add("is-empty");
    miniInlineTools.classList.add("is-hidden");
    miniFastToggle.classList.remove("is-in-media");
    miniInlineTools.appendChild(miniFastToggle);
    teardownLeafletMap();
    miniFeedback.textContent = "That was only a tiny sample. The real app goes much deeper.";
    miniFactIcon.src = "./assets/icons/learn2.webp";
    miniLearnAll.textContent = "Learn the world";
    setFactVisibility(true);
    miniNext.disabled = true;
    miniNext.style.display = "none";
  }

  function goToNextQuestion() {
    currentQuestionIndex += 1;
    if (currentQuestionIndex >= miniLessonQuestions.length) {
      finishMiniLesson();
      return;
    }
    renderMiniQuestion();
  }

  function renderMiniQuestion() {
    const question = miniLessonQuestions[currentQuestionIndex];
    clearMiniFastAdvanceTimer();
    locked = false;
    pinpointAnswered = false;
    setNextEnabled(false);
    setFactVisibility(false);
    miniFactIcon.src = "./assets/icons/light1.webp";
    miniNext.style.display = miniFastModeEnabled ? "none" : "";
    updateLessonChrome(question);
    miniTitle.classList.toggle(
      "fit-one-line",
      question.prompt === "Which country does this flag belong to?",
    );
    miniTitle.textContent = question.prompt;
    miniProgress.textContent = `${currentQuestionIndex + 1} / ${miniLessonQuestions.length}`;
    miniProgressFill.style.width = `${((currentQuestionIndex + 1) / miniLessonQuestions.length) * 100}%`;
    if (question.type === "pinpoint") {
      miniFeedback.textContent = "Move around the map and tap the country itself.";
    } else if (question.type === "map") {
      miniFeedback.textContent = "Move around the map if you want, then choose from the answers below.";
    } else if (question.type === "capital_map") {
      miniFeedback.textContent = "Use the map clues, then choose from the cities below.";
    } else {
      miniFeedback.textContent = "Choose an answer.";
    }
    miniOptions.innerHTML = "";
    renderMiniMedia(question);

    if (!question.options) {
      return;
    }

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "mini-lesson-option";
      button.textContent = option;
      button.type = "button";
      button.addEventListener("click", () => handleMiniAnswer(button, option));
      miniOptions.appendChild(button);
    });
  }

  function handleMiniAnswer(button, option) {
    if (locked) {
      return;
    }

    locked = true;
    const question = miniLessonQuestions[currentQuestionIndex];
    const optionButtons = Array.from(miniOptions.querySelectorAll(".mini-lesson-option"));

    optionButtons.forEach((node) => {
      node.classList.add("disabled");
      if (node.textContent === question.answer) {
        node.classList.add("correct");
      }
    });

    if (option === question.answer) {
      score += 1;
      miniFeedback.textContent = question.correctMessage;
    } else {
      button.classList.add("incorrect");
      miniFeedback.textContent = `Not quite. The correct answer is ${question.answer}.`;
    }
    if (miniFastModeEnabled) {
      setFactVisibility(false);
      setNextEnabled(false);
      scheduleMiniFastAdvance();
    } else {
      setFactVisibility(true);
      setNextEnabled(true);
    }
  }

  miniNext.addEventListener("click", () => {
    if (!answeredCurrentQuestion) {
      return;
    }
    goToNextQuestion();
  });

  miniReset.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    locked = false;
    clearMiniFastAdvanceTimer();
    setNextEnabled(false);
    setFactVisibility(false);
    miniMedia.innerHTML = "";
    miniMedia.classList.add("is-empty");
    teardownLeafletMap();
    renderMiniQuestion();
  });

  miniFastToggle.addEventListener("pointerdown", () => {
    miniFastToggle.classList.add("is-pressed");
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
    miniFastToggle.addEventListener(eventName, () => {
      miniFastToggle.classList.remove("is-pressed");
    });
  });

  miniFastToggle.addEventListener("click", () => {
    miniFastModeEnabled = !miniFastModeEnabled;
    updateMiniFastToggleVisual();
    updateFastModeToolVisual();
    showFastModeSnackbar();
    maybeAutoAdvanceAnsweredQuestion();
  });

  miniLearnAll.addEventListener("click", () => {
    document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateMiniFastToggleVisual();
  renderMiniQuestion();
}
