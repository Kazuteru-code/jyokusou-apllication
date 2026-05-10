const SCORE_DEFS = {
  D: {
    label: "深さ",
    note: "写真のみでは断定しない。創底・深部到達・DTI/Uを手動確認。",
    manualDefault: true,
    options: [
      ["d0", "皮膚損傷なし"],
      ["d1", "持続する発赤"],
      ["d2", "真皮まで"],
      ["D3", "皮下組織まで"],
      ["D4", "皮下組織を超える"],
      ["D5", "関節腔・体腔"],
      ["DTI", "深部損傷疑い"],
      ["U", "深さ判定不能"]
    ]
  },
  E: {
    label: "滲出液",
    note: "ドレッシング交換頻度、浸軟、漏出を合わせて確認。",
    options: [
      ["e0", "なし"],
      ["e1", "少量"],
      ["e3", "中等量"],
      ["E6", "多量"]
    ]
  },
  S: {
    label: "サイズ",
    note: "長径×短径cmの概算。ポケットはPで別評価。",
    options: [
      ["s0", "損傷なし"],
      ["s3", "4未満"],
      ["s6", "4以上16未満"],
      ["s8", "16以上36未満"],
      ["s9", "36以上64未満"],
      ["s12", "64以上100未満"],
      ["S15", "100以上"]
    ]
  },
  I: {
    label: "炎症・感染",
    note: "発赤範囲、熱感、腫脹、膿性滲出液、悪臭、全身症状を確認。",
    options: [
      ["i0", "炎症なし"],
      ["i1", "局所炎症"],
      ["I3C", "臨界的定着疑い"],
      ["I3", "局所感染"],
      ["I9", "全身的影響"]
    ]
  },
  G: {
    label: "肉芽",
    note: "良性肉芽の割合、不良肉芽、上皮化の進行を確認。",
    options: [
      ["g0", "治癒・浅い創・DTI疑い"],
      ["g1", "良性肉芽90%以上"],
      ["g3", "良性肉芽50%以上"],
      ["G4", "良性肉芽10%以上50%未満"],
      ["G5", "良性肉芽10%未満"],
      ["G6", "良性肉芽なし"]
    ]
  },
  N: {
    label: "壊死",
    note: "スラフ、硬性壊死、創底被覆の有無を確認。",
    options: [
      ["n0", "壊死なし"],
      ["N3", "柔らかい壊死・スラフ"],
      ["N6", "硬く厚い壊死"]
    ]
  },
  P: {
    label: "ポケット",
    note: "写真のみでは断定しない。綿棒等で最大剥離範囲を手動確認。",
    manualDefault: true,
    options: [
      ["p0", "なし"],
      ["P6", "4未満"],
      ["P9", "4以上16未満"],
      ["P12", "16以上36未満"],
      ["P24", "36以上"]
    ]
  }
};

const TIME_TREATMENTS = {
  T: {
    title: "Tissue Management",
    subtitle: "壊死組織除去 / DESIGN-R: N・Dが大文字",
    focus: ["N・Dが大文字", "壊死が残る間はEへ急がない"],
    blocks: [
      { title: "目的", items: ["壊死・スラフの除去", "創底の清浄化", "自己融解の促進"] },
      { title: "壊死＋滲出液が多いとき", items: ["カデックス®軟膏0.9%", "ブロメライン軟膏"] },
      { title: "壊死＋滲出液が少ないとき", items: ["ゲーベン®クリーム1%"] },
      { title: "補助手段", items: ["外科的デブリードマン", "鋭匙", "自己融解（湿潤環境）", "ハイドロジェル（グラニュゲル®）", "ハイドロコロイド（デュオアクティブ®）"] }
    ],
    note: "目標: NスコアをN0へ。ポケット＋滲出多い場合は、ビーズ残留の問題からカデックスよりユーパスタを優先。"
  },
  I: {
    title: "Infection / Inflammation Control",
    subtitle: "感染・炎症のコントロール / DESIGN-R: Iが大文字",
    focus: ["悪臭・膿・熱感", "局所感染ならI優先"],
    blocks: [
      { title: "目的", items: ["局所感染の制御", "細菌負荷の低減", "炎症の鎮静化"] },
      { title: "手段", items: ["局所抗菌管理", "抗菌ドレッシング", "全身性抗菌薬（必要時）", "外科的ドレナージ"] },
      { title: "製剤・材の例", items: ["スルファジアジン銀（ゲーベン®クリーム）", "カデキソマー・ヨウ素", "ポビドンヨード（消毒→洗浄）", "蜂蜜製剤（Medihoney®）", "銀含有フォーム（メピレックスAg®）", "銀含有ハイドロファイバー（アクアセル®Ag）", "PHMB含有ガーゼ（テルファーPHMB®）"] }
    ],
    note: "目標: IスコアをI0またはi1へ。局所感染サイン（熱感・悪臭・膿）の消失。"
  },
  M: {
    title: "Moisture Balance",
    subtitle: "滲出液の管理 / DESIGN-R: Eが大文字",
    focus: ["湿潤環境を調整", "浸軟を防ぐ", "乾燥も避ける"],
    blocks: [
      { title: "目的", items: ["過剰な滲出液の吸収", "適正な湿潤環境の維持", "浸軟と過乾燥の回避"] },
      { title: "滲出液が多いとき", items: ["アルギネート（アルゴダーム®）", "ハイドロファイバー（アクアセル®）", "高吸収フォーム（メピレックス®Border）", "フォームドレッシング（ハイドロサイト®）", "ポリウレタンフォーム（メピレックス®）"] },
      { title: "滲出液が少ない〜適正なとき", items: ["ハイドロコロイド（デュオアクティブ®）", "ハイドロジェルシート", "白色ワセリン塗布ガーゼ"] },
      { title: "手段", items: ["高吸収材の使用", "フォームによる管理", "陰圧閉鎖療法（NPWT）", "乾燥時は補水・保湿へ切り替え"] }
    ],
    note: "目標: EスコアをE1またはe1へ。ハイドロコロイドは多量滲出には不向き。"
  },
  E: {
    title: "Edge Advancement",
    subtitle: "創縁・上皮化の促進 / DESIGN-R: S・G・Pが関連",
    focus: ["最後に整える", "赤色肉芽かポケットか", "滲出液量で分岐"],
    blocks: [
      { title: "目的", items: ["創縁の前進", "上皮化の促進", "良性肉芽の増加", "ポケット縮小"] },
      { title: "赤色肉芽＋滲出液が多いとき", items: ["ブクラデシン（アクトシン®軟膏）", "精製白糖・ポビドンヨード（ユーパスタ®）"] },
      { title: "赤色肉芽＋滲出液が適正・少ないとき", items: ["トレチノイントコフェリル（オルセノン®）", "アルプロスタジル（プロスタンディン®軟膏）", "トラフェルミン（フィブラストスプレー®）"] },
      { title: "ポケット＋滲出液が多いとき", items: ["精製白糖・ポビドンヨード（ユーパスタ®）"] },
      { title: "ポケット＋滲出液が適正・少ないとき", items: ["トレチノイントコフェリル（オルセノン®）", "トラフェルミン（フィブラストスプレー®）"] },
      { title: "創縁保護・上皮化補助", items: ["薄型ハイドロコロイド（デュオアクティブET®）", "シリコーンフォーム（メピレックス®Lite）", "非固着性ガーゼ（メロリン®）"] }
    ],
    note: "重要: プロスタンディンはポケットでは原則避ける。まずオルセノンでポケット内を整理してから検討。"
  }
};

const state = {
  selected: {},
  ai: null,
  imageDataUrl: null,
  fileName: null,
  cameraStream: null,
  manualRequired: new Set(["D", "P"])
};

const el = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  renderScoreControls();
  bindEvents();
  renderAll();
});

function cacheElements() {
  el.cameraInput = document.getElementById("camera-input");
  el.fileInput = document.getElementById("file-input");
  el.liveCameraBtn = document.getElementById("live-camera-btn");
  el.cameraLive = document.getElementById("camera-live");
  el.cameraVideo = document.getElementById("camera-video");
  el.captureFrameBtn = document.getElementById("capture-frame-btn");
  el.stopCameraBtn = document.getElementById("stop-camera-btn");
  el.previewShell = document.getElementById("preview-shell");
  el.preview = document.getElementById("image-preview");
  el.analyzeBtn = document.getElementById("analyze-btn");
  el.clearBtn = document.getElementById("clear-btn");
  el.aiResult = document.getElementById("ai-result");
  el.scoreControls = document.getElementById("score-controls");
  el.resetScoresBtn = document.getElementById("reset-scores-btn");
  el.summary = document.getElementById("confirmed-summary");
  el.alerts = document.getElementById("alerts");
  el.treatmentGuide = document.getElementById("treatment-guide");
  el.recommendations = document.getElementById("recommendations");
  el.apText = document.getElementById("ap-text");
  el.copyApBtn = document.getElementById("copy-ap-btn");
  el.apiStatus = document.getElementById("api-status");
  el.drugModal = document.getElementById("drug-modal");
  el.drugModalKicker = document.getElementById("drug-modal-kicker");
  el.drugModalTitle = document.getElementById("drug-modal-title");
  el.drugModalGeneric = document.getElementById("drug-modal-generic");
  el.drugModalBody = document.getElementById("drug-modal-body");
}

function bindEvents() {
  el.cameraInput.addEventListener("change", handleFileInput);
  el.fileInput.addEventListener("change", handleFileInput);
  el.liveCameraBtn.addEventListener("click", startLiveCamera);
  el.captureFrameBtn.addEventListener("click", captureLiveFrame);
  el.stopCameraBtn.addEventListener("click", stopLiveCamera);
  el.analyzeBtn.addEventListener("click", analyzeImage);
  el.clearBtn.addEventListener("click", clearImage);
  el.resetScoresBtn.addEventListener("click", () => {
    state.selected = {};
    state.manualRequired = new Set(["D", "P"]);
    renderAll();
  });
  el.copyApBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(el.apText.value);
    el.copyApBtn.textContent = "コピー済み";
    setTimeout(() => { el.copyApBtn.textContent = "コピー"; }, 1400);
  });
  el.treatmentGuide.addEventListener("click", (event) => {
    const button = event.target.closest("[data-drug-name]");
    if (!button) return;
    openDrugDetail(button.dataset.drugName);
  });
  el.drugModal.addEventListener("click", (event) => {
    if (event.target.closest("[data-drug-close]")) closeDrugDetail();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !el.drugModal.hidden) closeDrugDetail();
  });
}

function renderScoreControls() {
  el.scoreControls.innerHTML = Object.entries(SCORE_DEFS).map(([key, def]) => {
    const options = def.options.map(([value, label]) => (
      `<button class="score-option" type="button" data-score-key="${key}" data-score-value="${value}">
        <b>${value}</b>${label}
      </button>`
    )).join("");

    return `
      <div class="score-row" data-score-row="${key}">
        <div class="score-title">
          <span class="score-letter">${key}</span>
          <span>
            <strong>${def.label}</strong>
            <small>${def.note}</small>
            <span class="manual-required" data-manual-badge="${key}" hidden>手動確認が必要</span>
          </span>
        </div>
        <div class="score-options">${options}</div>
      </div>
    `;
  }).join("");

  el.scoreControls.addEventListener("click", (event) => {
    const button = event.target.closest(".score-option");
    if (!button) return;
    const key = button.dataset.scoreKey;
    const value = button.dataset.scoreValue;
    state.selected[key] = value;
    state.manualRequired.delete(key);
    renderAll();
  });
}

async function handleFileInput(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
    showAiMessage("PNG、JPEG、WebPの画像を選択してください。", true);
    return;
  }

  if (file.size > 7 * 1024 * 1024) {
    showAiMessage("画像が大きすぎます。7MB以下の画像を選択してください。", true);
    return;
  }

  state.fileName = file.name;
  setSelectedImage(await readFileAsDataUrl(file), file.name);
  showAiMessage("写真を読み込みました。AI解析を実行できます。", false);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function clearImage() {
  state.imageDataUrl = null;
  state.fileName = null;
  state.ai = null;
  stopLiveCamera();
  el.preview.removeAttribute("src");
  el.previewShell.classList.remove("has-image");
  el.analyzeBtn.disabled = true;
  el.cameraInput.value = "";
  el.fileInput.value = "";
  showAiMessage("写真をクリアしました。手動入力はそのまま使えます。", false);
}

function setSelectedImage(dataUrl, fileName) {
  state.imageDataUrl = dataUrl;
  state.fileName = fileName || "camera-capture.jpg";
  state.ai = null;
  el.preview.src = dataUrl;
  el.previewShell.classList.add("has-image");
  el.analyzeBtn.disabled = false;
}

async function startLiveCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showAiMessage("このブラウザではライブカメラを起動できません。保存済み写真の選択、またはスマホのカメラ撮影を使ってください。", true);
    return;
  }

  try {
    stopLiveCamera();
    state.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    el.cameraVideo.srcObject = state.cameraStream;
    el.cameraLive.hidden = false;
    showAiMessage("カメラを起動しました。創部を映して「この映像を撮影」を押してください。", false);
  } catch (error) {
    showAiMessage(`カメラを起動できませんでした。ブラウザのカメラ許可を確認してください。詳細: ${error.message}`, true);
  }
}

function captureLiveFrame() {
  if (!state.cameraStream || !el.cameraVideo.videoWidth) {
    showAiMessage("カメラ映像を取得できていません。少し待ってから再度撮影してください。", true);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = el.cameraVideo.videoWidth;
  canvas.height = el.cameraVideo.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(el.cameraVideo, 0, 0, canvas.width, canvas.height);
  setSelectedImage(canvas.toDataURL("image/jpeg", 0.9), "camera-capture.jpg");
  stopLiveCamera();
  showAiMessage("カメラ映像から写真を作成しました。AI解析を実行できます。", false);
}

function stopLiveCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach((track) => track.stop());
    state.cameraStream = null;
  }
  if (el.cameraVideo) el.cameraVideo.srcObject = null;
  if (el.cameraLive) el.cameraLive.hidden = true;
}

async function analyzeImage() {
  if (!state.imageDataUrl) return;

  el.analyzeBtn.disabled = true;
  el.analyzeBtn.textContent = "解析中...";
  el.apiStatus.textContent = "AI解析中";
  showAiMessage("外部AI APIで解析しています。写真は保存しません。", false);

  try {
    const response = await fetch("/api/analyze-wound", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: state.imageDataUrl,
        fileName: state.fileName
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "AI解析に失敗しました。");
    }

    state.ai = payload;
    applyAiSuggestions(payload);
    el.apiStatus.textContent = "AI仮判定を反映";
    renderAll();
  } catch (error) {
    showAiMessage(`${error.message} 手動入力でフローチャートは利用できます。`, true);
    el.apiStatus.textContent = "手動入力に切替可";
  } finally {
    el.analyzeBtn.disabled = false;
    el.analyzeBtn.textContent = "AI解析";
  }
}

function applyAiSuggestions(result) {
  state.manualRequired = new Set(["D", "P", ...(result.manualRequired || [])]);

  Object.entries(result.scores || {}).forEach(([key, guess]) => {
    if (!SCORE_DEFS[key] || !guess || !guess.value) return;
    if (key === "D" || key === "P" || guess.source === "manual_required") {
      state.manualRequired.add(key);
      return;
    }
    const allowed = SCORE_DEFS[key].options.some(([value]) => value === guess.value);
    if (allowed && guess.confidence !== "low") {
      state.selected[key] = guess.value;
    }
  });
}

function renderAll() {
  renderScoreState();
  renderAiResult();
  renderOutput();
}

function renderScoreState() {
  Object.keys(SCORE_DEFS).forEach((key) => {
    const badge = document.querySelector(`[data-manual-badge="${key}"]`);
    if (badge) badge.hidden = !state.manualRequired.has(key);

    const aiValue = state.ai?.scores?.[key]?.value;
    document.querySelectorAll(`[data-score-key="${key}"]`).forEach((button) => {
      const value = button.dataset.scoreValue;
      button.classList.toggle("active", state.selected[key] === value);
      button.classList.toggle("ai-suggested", aiValue === value);
    });
  });
}

function renderAiResult() {
  if (!state.ai) return;

  const observations = (state.ai.observations || []).slice(0, 6).map((text) => (
    `<div class="observation">${escapeHtml(text)}</div>`
  )).join("");

  const scores = Object.keys(SCORE_DEFS).map((key) => {
    const guess = state.ai.scores?.[key];
    const value = guess?.value || "手動確認";
    const confidence = guess?.confidence || "low";
    const reason = guess?.reason || (key === "D" || key === "P" ? "写真のみでは判定しません。" : "候補なし。");
    return `
      <div class="ai-score">
        <strong>${key}: ${escapeHtml(value)} <span class="confidence ${confidence}">${confidence}</span></strong>
        <p>${escapeHtml(reason)}</p>
      </div>
    `;
  }).join("");

  const warnings = (state.ai.warnings || []).slice(0, 6).map((text) => (
    `<div class="alert">${escapeHtml(text)}</div>`
  )).join("");

  el.aiResult.className = "ai-result";
  el.aiResult.innerHTML = `
    ${warnings ? `<div class="alert-list">${warnings}</div>` : ""}
    <div class="observation-list">${observations || '<div class="observation">観察所見は返されませんでした。</div>'}</div>
    <div class="ai-score-grid">${scores}</div>
  `;
}

function showAiMessage(message, isError) {
  el.aiResult.className = `ai-result empty${isError ? " error" : ""}`;
  el.aiResult.textContent = message;
}

function getScenario() {
  const s = state.selected;
  const exudate = !s.E ? "unknown" : ["e3", "E6"].includes(s.E) ? "high" : "low";
  const infection = !s.I ? "unknown"
    : s.I === "I9" ? "systemic"
    : ["I3", "I3C"].includes(s.I) ? "local"
    : s.I === "i1" ? "inflammation"
    : "none";
  const necrosis = !s.N ? "unknown"
    : s.N === "N6" ? "hard"
    : s.N === "N3" ? "slough"
    : "none";
  const pocket = !s.P ? "unknown" : s.P === "p0" ? "none" : "present";
  const granulation = !s.G ? "unknown"
    : s.G === "g0" ? "healed"
    : ["g1", "g3"].includes(s.G) ? "good"
    : "poor";

  return {
    exudate,
    infection,
    necrosis,
    pocket,
    granulation,
    deep: ["D4", "D5"].includes(s.D),
    depthUnknown: ["U", "DTI"].includes(s.D),
    largeWound: ["s9", "s12", "S15"].includes(s.S),
    redPhase: necrosis === "none" && ["none", "inflammation"].includes(infection) && ["good", "poor"].includes(granulation),
    values: { ...s }
  };
}

function renderOutput() {
  const sc = getScenario();
  const selectedKeys = Object.keys(SCORE_DEFS).filter((key) => state.selected[key]);
  el.summary.textContent = selectedKeys.length
    ? selectedKeys.map((key) => `${key}:${state.selected[key]}`).join(" / ")
    : "DESIGN-Rを選択してください";

  const alerts = buildAlerts(sc);
  el.alerts.innerHTML = alerts.map((text) => `<div class="alert">${escapeHtml(text)}</div>`).join("");

  renderTreatmentGuide(sc);

  const recs = buildRecommendations(sc);
  el.recommendations.innerHTML = recs.length
    ? recs.map(renderRecommendation).join("")
    : `<div class="rx-empty">E、I、N、G、Pを確認すると候補を絞り込みやすくなります。D/Pは手動確認してください。</div>`;

  el.apText.value = buildApText(sc, alerts, recs);
}

function renderTreatmentGuide(sc) {
  const active = getActiveTimeIssues(sc);
  el.treatmentGuide.innerHTML = Object.entries(TIME_TREATMENTS).map(([key, treatment]) => {
    const blocks = treatment.blocks.map((block) => `
      <div class="treatment-block">
        <div class="treatment-block-title">${escapeHtml(block.title)}</div>
        <div class="treatment-tags">
          ${block.items.map(renderTreatmentTag).join("")}
        </div>
      </div>
    `).join("");

    return `
      <article class="treatment-card ${active.has(key) ? "active" : ""}">
        <div class="treatment-head">
          <span class="time-badge ${key}">${key}</span>
          <div>
            <div class="treatment-title">${escapeHtml(treatment.title)}</div>
            <div class="treatment-sub">${escapeHtml(treatment.subtitle)}</div>
          </div>
        </div>
        <div class="treatment-tags">
          ${treatment.focus.map(renderTreatmentTag).join("")}
        </div>
        ${blocks}
        <div class="treatment-note">${escapeHtml(treatment.note)}</div>
      </article>
    `;
  }).join("");
}

function renderTreatmentTag(item) {
  const hasDetail = Boolean(getDrugDetail(item));
  if (!hasDetail) return `<span class="treatment-tag">${escapeHtml(item)}</span>`;
  return `<button class="treatment-tag has-detail" type="button" data-drug-name="${escapeHtml(item)}">${escapeHtml(item)}</button>`;
}

function getDrugDetail(displayName) {
  const map = window.DRUG_NAME_MAP || {};
  const db = window.DRUG_DB || {};
  const key = map[displayName] || displayName;
  return db[key] ? { key, detail: db[key] } : null;
}

function openDrugDetail(displayName) {
  const found = getDrugDetail(displayName);
  if (!found) return;
  const d = found.detail;
  const tags = Array.isArray(d.timeTags) ? d.timeTags.join(" / ") : "";

  el.drugModalKicker.textContent = tags ? `TIME: ${tags}` : "薬剤情報";
  el.drugModalTitle.textContent = d.brandName || displayName;
  el.drugModalGeneric.textContent = d.generic || "";
  el.drugModalBody.innerHTML = `
    <div class="drug-info-grid">
      <div class="drug-info-box">
        <div class="drug-info-label">基剤・剤型</div>
        <div class="drug-info-value">${d.base || ""}</div>
      </div>
      <div class="drug-info-box">
        <div class="drug-info-label">適する滲出液量</div>
        <div class="drug-info-value">${d.exudate || ""}</div>
      </div>
      <div class="drug-info-box">
        <div class="drug-info-label">機能</div>
        <div class="drug-info-value">${d.func || ""}</div>
      </div>
      <div class="drug-info-box">
        <div class="drug-info-label">DBキー</div>
        <div class="drug-info-value">${escapeHtml(found.key)}</div>
      </div>
    </div>
    <div class="drug-section">
      <div class="drug-section-label">この薬剤を選ぶ理由</div>
      <div class="drug-section-text">${d.reason || ""}</div>
    </div>
    ${d.warn ? `<div class="drug-warning"><strong>注意点・禁忌事項</strong><br>${d.warn}</div>` : ""}
    ${d.pocket ? `<div class="drug-pocket"><strong>ポケット創での使用</strong><br>${d.pocket}</div>` : ""}
  `;
  el.drugModal.hidden = false;
}

function closeDrugDetail() {
  el.drugModal.hidden = true;
}

function getActiveTimeIssues(sc) {
  const active = new Set();
  if (sc.necrosis !== "none" && sc.necrosis !== "unknown") active.add("T");
  if (sc.depthUnknown || sc.deep) active.add("T");
  if (sc.infection === "local" || sc.infection === "systemic") active.add("I");
  if (sc.exudate === "high") active.add("M");
  if (sc.redPhase || sc.pocket === "present" || ["good", "poor"].includes(sc.granulation)) active.add("E");
  return active;
}

function buildAlerts(sc) {
  const alerts = [];
  for (const warning of state.ai?.warnings || []) {
    alerts.push(`AI警告: ${warning}`);
  }
  if (state.manualRequired.has("D")) alerts.push("D（深さ）は手動確認が必要です。写真AIの結果だけで確定しないでください。");
  if (state.manualRequired.has("P")) alerts.push("P（ポケット）は手動確認が必要です。綿棒等で最大剥離範囲を確認してください。");
  if (sc.infection === "systemic") alerts.push("I9です。局所処置だけで完結せず、全身抗菌薬、入院、ドレナージ要否の評価を優先してください。");
  if (sc.deep) alerts.push("D4/D5では筋・腱・骨露出や骨髄炎を伴うことがあります。専門医連携を前提に判断してください。");
  if (sc.depthUnknown) alerts.push("U/DTIは深達度が未確定です。デブリードマン後または経過観察後に再評価してください。");
  if (sc.largeWound) alerts.push("創が大きいため、局所薬だけでなく体圧分散、栄養、ドレッシング選択、手術適応も合わせて検討してください。");
  return alerts;
}

function addRec(list, issue, rank, name, meta, reason, caution) {
  const existing = list.find((item) => item.name === name);
  if (existing) {
    existing.issue = existing.issue.includes(issue) ? existing.issue : `${existing.issue}/${issue}`;
    existing.rank = Math.min(existing.rank, rank);
    return;
  }
  list.push({ issue, rank, name, meta, reason, caution });
}

function buildRecommendations(sc) {
  const recs = [];

  if (sc.necrosis !== "none" && sc.necrosis !== "unknown") {
    if (sc.exudate === "high") {
      if (sc.pocket === "present") {
        addRec(recs, "T", 1, "ユーパスタ", "壊死・感染傾向 + ポケット + 滲出多量", "ビーズ残留を避けやすく、滲出液が多いポケット創で使いやすい候補です。", "感染や壊死が落ち着いた後は漫然継続せず、赤色期の処置へ切り替えます。");
      }
      addRec(recs, "T", 2, "カデックス軟膏", "壊死除去 + 抗菌 + 吸水", "滲出液が多く壊死が残る場合に、吸水しながら細菌負荷と壊死組織を減らす候補です。", "ポケットでは残留に注意し、洗浄性を確認します。");
      addRec(recs, "T", 3, "ブロメライン軟膏", "酵素的デブリードマン", "湿潤した壊死創で壊死組織の融解を狙う候補です。", "乾燥創では効きにくく、周囲皮膚保護が必要です。");
    } else if (sc.exudate === "low") {
      addRec(recs, "T", 1, "ゲーベンクリーム", "少滲出の壊死・感染寄り", "少滲出の壊死創で補水しながら銀による抗菌を期待できます。", "赤色肉芽が主体になったら肉芽形成阻害に注意して切替を検討します。");
      if (sc.pocket === "present") {
        addRec(recs, "T", 1, "オルセノン軟膏", "ポケット清掃", "少滲出のポケット創で補水しながら清掃と肉芽形成への移行を狙います。", "感染や壊死が強い時はT/I優先です。");
      }
    }
  }

  if (sc.infection === "local" || sc.infection === "systemic") {
    if (sc.exudate === "high") {
      addRec(recs, "I", sc.pocket === "present" ? 1 : 2, "ユーパスタ", "感染 + 滲出多量", "感染徴候と多い滲出液があり、ポケットがある場合にも合わせやすい候補です。", "ヨード系の継続は創の状態を見て切替を検討します。");
      addRec(recs, "I", 2, "カデックス軟膏", "感染 + 吸水", "感染徴候があり滲出液も多い時に、抗菌と吸水を両立する候補です。", "ポケット残留と乾燥化に注意します。");
    } else if (sc.exudate === "low") {
      addRec(recs, "I", 1, "ゲーベンクリーム", "感染 + 少滲出", "少滲出の感染創で補水しながら抗菌作用を使いやすい候補です。", "赤色肉芽が増えたら促進系へ切り替えます。");
    }
  }

  if (sc.redPhase || (sc.necrosis === "none" && sc.infection !== "systemic" && sc.granulation !== "healed")) {
    if (sc.pocket === "present") {
      if (sc.exudate === "high") {
        addRec(recs, "M", 1, "ユーパスタ", "ポケット + 滲出多量", "ポケットがあり滲出液が多い時は、充填しやすく排液管理しやすい候補です。", "浅く乾燥寄りになれば切替を検討します。");
      } else if (sc.exudate === "low") {
        addRec(recs, "E", 1, "オルセノン軟膏", "ポケット + 赤色期", "ポケットが清潔で少滲出なら、肉芽形成へつなげる候補です。", "感染や壊死が残る場合は先にT/Iを優先します。");
        addRec(recs, "E", 2, "フィブラストスプレー", "肉芽形成促進", "創が整ってきた後に肉芽形成を後押しする候補です。", "単独では湿潤環境を作れないため、被覆材や外用薬と組み合わせます。");
      }
    } else if (sc.exudate === "high") {
      addRec(recs, "M", 1, "アクトシン軟膏", "赤色肉芽 + 滲出多量", "赤色肉芽が主体で滲出液が多い時に、吸水しながら上皮化を促す候補です。", "冷所保管など製剤ごとの管理条件を確認します。");
    } else if (sc.exudate === "low") {
      addRec(recs, "E", 1, "プロスタンディン軟膏", "肉芽形成・上皮化促進", "壊死や感染が落ち着いた少滲出の赤色期で、保湿しながら肉芽形成を進める候補です。", "ポケットでは袋とじリスクがあるため優先しません。");
      addRec(recs, "E", 1, "オルセノン軟膏", "乾燥寄り・赤色期", "乾燥気味の創に補水しながら肉芽形成を促したい時に合います。", "感染や壊死が残る間は先にT/Iを優先します。");
    }
  }

  if (sc.necrosis === "none" && sc.granulation === "good" && sc.exudate === "low") {
    addRec(recs, "E", 2, "非固着性ガーゼ・シリコンフォーム", "創縁保護", "上皮化段階では新生上皮を傷つけにくい被覆材を検討します。", "剥離時の疼痛と皮膚損傷を避けます。");
  }

  return recs.sort((a, b) => a.rank - b.rank || a.issue.localeCompare(b.issue));
}

function renderRecommendation(rec) {
  return `
    <article class="rx-card">
      <div class="rx-top">
        <div class="rx-name">${escapeHtml(rec.name)}</div>
        <div class="rx-tag">${escapeHtml(rec.issue)} / ${rec.rank === 1 ? "第一候補" : "候補"}</div>
      </div>
      <p><strong>${escapeHtml(rec.meta)}</strong></p>
      <p>${escapeHtml(rec.reason)}</p>
      <p>注意: ${escapeHtml(rec.caution)}</p>
    </article>
  `;
}

function buildApText(sc, alerts, recs) {
  const s = state.selected;
  const assessment = [];
  assessment.push("褥瘡。");
  if (s.D) assessment.push(`深さ ${s.D}。`); else assessment.push("深達度は手動評価を要する。");
  if (s.E) assessment.push(`滲出液 ${s.E}。`);
  if (s.I) assessment.push(`炎症・感染 ${s.I}。`);
  if (s.G) assessment.push(`肉芽 ${s.G}。`);
  if (s.N) assessment.push(`壊死 ${s.N}。`);
  if (s.P) assessment.push(`ポケット ${s.P}。`); else assessment.push("ポケットは手動評価を要する。");

  const plan = [];
  plan.push("DESIGN-Rを確認し、除圧、洗浄、創周囲皮膚保護、栄養・全身状態評価を行う。");
  if (recs.length) {
    plan.push(`TIME分類に沿い、候補として ${recs.slice(0, 3).map((r) => r.name).join("、")} を検討する。`);
  } else {
    plan.push("E/I/N/G/Pを追加確認し、TIME分類に沿って局所処置を検討する。");
  }
  if (state.manualRequired.has("D") || state.manualRequired.has("P")) {
    plan.push("D/Pの手動評価後に処置方針を再確認する。");
  }
  if (alerts.some((text) => text.includes("I9") || text.includes("D4") || text.includes("D5") || text.includes("専門医"))) {
    plan.push("重症所見に応じて医師・専門職連携、全身治療、外科的処置の要否を確認する。");
  }

  return `A:\n${assessment.join("")}\n\nP:\n${plan.join("")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
