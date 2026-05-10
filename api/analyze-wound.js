const MAX_BODY_BYTES = 9 * 1024 * 1024;
const MAX_IMAGE_DATA_URL_BYTES = 8 * 1024 * 1024;

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "POST only." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const imageDataUrl = String(body.imageDataUrl || "");
    const image = parseAndValidateImageDataUrl(imageDataUrl);

    const result = await callVisionProvider(image);
    sendJson(res, 200, normalizeResult(result));
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || error.message || "AI analysis failed."
    });
  }
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  let total = 0;
  const chunks = [];
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      throwPublic(413, "Request body is too large. Please use a smaller image.");
    }
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function parseAndValidateImageDataUrl(imageDataUrl) {
  const match = imageDataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throwPublic(400, "Send a PNG, JPEG, or WebP image Data URL.");
  }

  if (Buffer.byteLength(imageDataUrl, "utf8") > MAX_IMAGE_DATA_URL_BYTES) {
    throwPublic(413, "Image is too large. Please use an image around 7MB or less.");
  }

  return {
    mimeType: `image/${match[1]}`,
    base64: match[2],
    dataUrl: imageDataUrl
  };
}

async function callVisionProvider(image) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider === "openai") return callOpenAiProvider(image);
  return callGeminiProvider(image);
}

async function callGeminiProvider(image) {
  const apiKey = String(process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "").trim();
  if (!apiKey) {
    throwPublic(501, "GEMINI_API_KEY is not set. Add it to Vercel Environment Variables.");
  }

  const baseUrl = (process.env.GEMINI_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  const model = normalizeGeminiModel(process.env.GEMINI_MODEL || process.env.AI_MODEL || "gemini-2.5-flash");
  const endpoint = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              inline_data: {
                mime_type: image.mimeType,
                data: image.base64
              }
            },
            { text: buildPrompt() }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1400,
        responseMimeType: "application/json"
      }
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || payload.error?.status || "Gemini API request failed.";
    const error = new Error(message);
    error.statusCode = 502;
    error.publicMessage = `Gemini API request failed (${response.status}): ${sanitizePublicError(message)} You can continue with manual scoring.`;
    throw error;
  }

  return parseJsonObject(extractGeminiText(payload));
}

function normalizeGeminiModel(model) {
  return String(model || "gemini-2.5-flash")
    .trim()
    .replace(/^models\//, "");
}

function sanitizePublicError(message) {
  return String(message || "")
    .replace(/[A-Za-z0-9_-]{30,}/g, "[redacted]")
    .slice(0, 300);
}

async function callOpenAiProvider(image) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    throwPublic(501, "OPENAI_API_KEY is not set. Add it to Vercel Environment Variables.");
  }

  const baseUrl = (process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || process.env.AI_MODEL || "gpt-4.1-mini";

  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      store: false,
      max_output_tokens: 1400,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: buildPrompt() },
            { type: "input_image", image_url: image.dataUrl, detail: "low" }
          ]
        }
      ]
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || "OpenAI API request failed.";
    const error = new Error(message);
    error.statusCode = 502;
    error.publicMessage = "OpenAI API request failed. You can continue with manual scoring.";
    throw error;
  }

  return parseJsonObject(extractOpenAiText(payload));
}

function buildPrompt() {
  return [
    "You support pressure ulcer observation input for medical and care professionals.",
    "Do not diagnose, prescribe, or finalize treatment.",
    "Do not infer DESIGN-R depth D or pocket P from a photo alone. Return them as manual_required.",
    "Return JSON only. No Markdown outside JSON.",
    "",
    "Allowed values:",
    "D: d0,d1,d2,D3,D4,D5,DTI,U or null. Usually null.",
    "E: e0,e1,e3,E6 or null.",
    "S: s0,s3,s6,s8,s9,s12,S15 or null.",
    "I: i0,i1,I3C,I3,I9 or null.",
    "G: g0,g1,g3,G4,G5,G6 or null.",
    "N: n0,N3,N6 or null.",
    "P: p0,P6,P9,P12,P24 or null. Usually null.",
    "",
    "Return this schema exactly:",
    "{",
    '  "observations": ["string"],',
    '  "scores": {',
    '    "D": {"value": null, "confidence": "low", "reason": "Depth cannot be safely determined from photo alone.", "source": "manual_required"},',
    '    "E": {"value": "e0|e1|e3|E6|null", "confidence": "low|medium|high", "reason": "string", "source": "ai"},',
    '    "S": {"value": "s0|s3|s6|s8|s9|s12|S15|null", "confidence": "low|medium|high", "reason": "string", "source": "ai"},',
    '    "I": {"value": "i0|i1|I3C|I3|I9|null", "confidence": "low|medium|high", "reason": "string", "source": "ai"},',
    '    "G": {"value": "g0|g1|g3|G4|G5|G6|null", "confidence": "low|medium|high", "reason": "string", "source": "ai"},',
    '    "N": {"value": "n0|N3|N6|null", "confidence": "low|medium|high", "reason": "string", "source": "ai"},',
    '    "P": {"value": null, "confidence": "low", "reason": "Pocket cannot be safely determined from photo alone.", "source": "manual_required"}',
    "  },",
    '  "manualRequired": ["D", "P"],',
    '  "warnings": ["string"]',
    "}",
    "",
    "If a field is visually unclear, use value:null and confidence:low.",
    "If possible personal information such as face, name, ID, card, or room number appears, add a warning."
  ].join("\n");
}

function extractGeminiText(payload) {
  const parts = [];
  for (const candidate of payload.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (typeof part.text === "string") parts.push(part.text);
    }
  }
  return parts.join("\n").trim();
}

function extractOpenAiText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;

  const parts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        parts.push(content.text);
      } else if (typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }
  return parts.join("\n").trim();
}

function parseJsonObject(text) {
  const cleaned = String(text || "")
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throwPublic(502, "AI response could not be parsed. You can continue with manual scoring.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function normalizeResult(raw) {
  const allowed = {
    D: new Set(["d0", "d1", "d2", "D3", "D4", "D5", "DTI", "U"]),
    E: new Set(["e0", "e1", "e3", "E6"]),
    S: new Set(["s0", "s3", "s6", "s8", "s9", "s12", "S15"]),
    I: new Set(["i0", "i1", "I3C", "I3", "I9"]),
    G: new Set(["g0", "g1", "g3", "G4", "G5", "G6"]),
    N: new Set(["n0", "N3", "N6"]),
    P: new Set(["p0", "P6", "P9", "P12", "P24"])
  };

  const scores = {};
  for (const key of Object.keys(allowed)) {
    const guess = raw.scores?.[key] || {};
    const value = allowed[key].has(guess.value) ? guess.value : null;
    const confidence = ["low", "medium", "high"].includes(guess.confidence) ? guess.confidence : "low";
    const source = guess.source === "ai" && key !== "D" && key !== "P" ? "ai" : "manual_required";

    scores[key] = {
      value: key === "D" || key === "P" ? null : value,
      confidence: key === "D" || key === "P" ? "low" : confidence,
      reason: typeof guess.reason === "string" ? guess.reason.slice(0, 240) : defaultReason(key),
      source
    };
  }

  return {
    observations: Array.isArray(raw.observations)
      ? raw.observations.filter((item) => typeof item === "string").slice(0, 8)
      : [],
    scores,
    manualRequired: Array.from(new Set(["D", "P", ...(Array.isArray(raw.manualRequired) ? raw.manualRequired : [])]))
      .filter((key) => Object.prototype.hasOwnProperty.call(allowed, key)),
    warnings: Array.isArray(raw.warnings)
      ? raw.warnings.filter((item) => typeof item === "string").slice(0, 6)
      : []
  };
}

function defaultReason(key) {
  if (key === "D") return "Depth cannot be safely determined from photo alone.";
  if (key === "P") return "Pocket cannot be safely determined from photo alone.";
  return "The image was not clear enough to safely suggest this field.";
}

function throwPublic(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;
  throw error;
}
