const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const LOCATION_ID = "smJPZ6t6Ow6wzcuyCvVp";
const PIPELINE_ID = "2m2UkvGggMscqxNqZyhx";
const PIPELINE_STAGE_ID = "4d6d1396-fecf-4740-bbd0-9c942cb40219";
// Default attribution for the main site. Each form posts a more specific
// `source` (e.g. "NextKey Site - Fremont") so organic/site leads are
// distinguishable in GHL from the paid landing page ("NextKey Website").
const DEFAULT_SOURCE = "NextKey Site";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function splitName(name) {
  const parts = cleanText(name, 120).split(" ").filter(Boolean);
  if (!parts.length) return { firstName: "Website", lastName: "Lead" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function ghlRequest(path, options = {}) {
  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) {
    throw new Error("GHL_PRIVATE_TOKEN is not configured");
  }

  const response = await fetch(`${GHL_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Version: GHL_VERSION,
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const detail = data && (data.message || data.error || JSON.stringify(data));
    throw new Error(`HighLevel ${response.status}: ${detail || "request failed"}`);
  }

  return data;
}

function getContactId(data) {
  return data?.contact?.id || data?.id || data?.contactId;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 204, {});
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);
    if (body.company) {
      return sendJson(res, 200, { ok: true });
    }

    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 40);
    const address = cleanText(body.address, 240);
    const motivation = cleanText(body.motivation, 1000);
    const source = cleanText(body.source, 80) || DEFAULT_SOURCE;
    const digits = phone.replace(/\D/g, "");

    if (name.length < 2 || digits.length < 7 || address.length < 5) {
      return sendJson(res, 400, {
        ok: false,
        error: "Please enter your name, phone number, and property address.",
      });
    }

    const { firstName, lastName } = splitName(name);
    const contactPayload = {
      locationId: LOCATION_ID,
      firstName,
      lastName,
      name,
      phone,
      address1: address,
      source,
      country: "US",
    };

    const contactResult = await ghlRequest("/contacts/upsert", {
      method: "POST",
      body: contactPayload,
    });

    const contactId = getContactId(contactResult);
    if (!contactId) {
      throw new Error("HighLevel did not return a contact ID");
    }

    const opportunityName = `${name} - ${address}`;
    const opportunityResult = await ghlRequest("/opportunities/upsert", {
      method: "POST",
      body: {
        locationId: LOCATION_ID,
        contactId,
        name: opportunityName.slice(0, 250),
        pipelineId: PIPELINE_ID,
        pipelineStageId: PIPELINE_STAGE_ID,
        status: "open",
        source,
      },
    });

    let noteCreated = true;
    try {
      await ghlRequest(`/contacts/${encodeURIComponent(contactId)}/notes`, {
        method: "POST",
        body: {
          body: [
            "New NextKey website lead",
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Property address: ${address}`,
            motivation ? `Selling motivation: ${motivation}` : "Selling motivation: Not provided",
            `Source: ${source}`,
          ].join("\n"),
        },
      });
    } catch (noteError) {
      noteCreated = false;
      console.warn("HighLevel note creation failed", noteError.message);
    }

    return sendJson(res, 200, {
      ok: true,
      contactId,
      opportunityId: opportunityResult?.opportunity?.id || opportunityResult?.id || null,
      noteCreated,
    });
  } catch (error) {
    console.error("NextKey lead submission failed", error);
    return sendJson(res, 502, {
      ok: false,
      error: "We couldn't send your details just now. Please call or text (408) 314-4420 and we'll get your cash offer started.",
    });
  }
};
