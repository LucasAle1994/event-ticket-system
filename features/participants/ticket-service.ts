import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// NOTE: prisma is imported dynamically inside DB functions to avoid loading DB
// when only generating images/PDFs locally for testing.
import { prisma } from "@/lib/prisma";

export type TicketStatus = "GENERATED" | "SENT";

export async function createTicketForParticipant(participantId: number, uuid: string) {
  return prisma.ticket.create({
    data: {
      participantId,
      uuid,
      status: "GENERATED",
    },
  });
}

export async function setTicketMedia(ticketId: number, whatsappUrl: string, pdfBase64: string) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      whatsappUrl,
      pdfBase64,
    },
  });
}

export async function markTicketSent(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "SENT",
    },
  });
}

export async function findTicketByParticipant(participantId: number) {
  return prisma.ticket.findUnique({
    where: { participantId },
  });
}

async function detectWhiteRegions(imageBuffer: Buffer) {
  // Downscale for analysis
  const probe = sharp(imageBuffer).resize({ width: 600, withoutEnlargement: true }).greyscale();
  const { data, info } = await probe.raw().toBuffer({ resolveWithObject: true });

  // Determine original image size so we can map component coords back
  const origMeta = await sharp(imageBuffer).metadata();
  const probeWidth = info.width;
  const probeHeight = info.height;

  const w = probeWidth;
  const h = probeHeight;
  const threshold = 240; // near-white

  const visited = new Uint8Array(w * h);
  const components: Array<{ x0: number; y0: number; x1: number; y1: number; area: number }> = [];

  function idx(x: number, y: number) {
    return y * w + x;
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      if (visited[i]) continue;
      const brightness = data[i];
      if (brightness < threshold) {
        visited[i] = 1;
        continue;
      }

      // BFS flood fill
      const stack = [i];
      visited[i] = 1;
      let minX = x,
        maxX = x,
        minY = y,
        maxY = y,
        area = 0;

      while (stack.length) {
        const cur = stack.pop() as number;
        const cx = cur % w;
        const cy = Math.floor(cur / w);
        area++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        const neighbors = [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const ni = idx(nx, ny);
          if (visited[ni]) continue;
          if (data[ni] >= threshold) {
            visited[ni] = 1;
            stack.push(ni);
          } else {
            visited[ni] = 1;
          }
        }
      }

      components.push({ x0: minX, y0: minY, x1: maxX, y1: maxY, area });
    }
  }

  // Transform back coordinates to original image scale.
  // scale = original / probe
  const scaleX = (origMeta.width || probeWidth) / probeWidth;
  const scaleY = (origMeta.height || probeHeight) / probeHeight;
  return { components, scaleX, scaleY, probeWidth, probeHeight };
}

// function svgTextForName(name: string, width: number, height: number) {
//   // Start with larger font to better occupy the available name area, then reduce until it fits.
//   let fontSize = Math.min(72, Math.floor(height * 0.8));
//   const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

//   // Try progressively smaller sizes; keep a small minimum for very long names
//   while (fontSize > 8) {
//     const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><style>.name{font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; font-weight:700; fill:#000; }</style><rect width='100%' height='100%' fill='transparent' /><text x='50%' y='75%' text-anchor='middle' dominant-baseline='middle' class='name'>${escape(name)}</text></svg>`;
//     // Rough width check by character count; using 0.55 multiplier allows slightly larger font sizes
//     if (name.length * fontSize * 0.55 < width) {
//       return svg;
//     }
//     fontSize -= 2;
//   }

//   return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><style>.name{font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight:700; fill:#000; }</style><rect width='100%' height='100%' fill='transparent' /><text x='50%' y='75%' text-anchor='middle' dominant-baseline='middle' class='name'>${escape(name)}</text></svg>`;
// }

function svgTextForName(name: string, width: number, height: number) {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
    >
      <rect width="100%" height="100%" fill="white"/>
      <text
        x="50%"
        y="75%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="50"
        font-weight="700"
        fill="black"
      >${escape(name)}</text>
    </svg>
  `;
}

export async function generateTicketImage(participant: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: Date;
  uuid: string;
}) {
  const templatePath = path.join(process.cwd(), "public", "tickets", "ticket-template.png");

  try {
    const templateBuffer = await fs.readFile(templatePath);

    // Detect white regions to find QR and name placeholders
    const detection = await detectWhiteRegions(templateBuffer);
    const { components, scaleX, scaleY } = detection;

    // Choose candidate components
    // Scale components back to original coordinates
    const meta = await sharp(templateBuffer).metadata();
    const origW = meta.width || 0;
    const origH = meta.height || 0;

    const scaledComps = components.map((c) => ({
      x0: Math.round(c.x0 * scaleX),
      y0: Math.round(c.y0 * scaleY),
      x1: Math.round(c.x1 * scaleX),
      y1: Math.round(c.y1 * scaleY),
      area: c.area,
    }));

    // Heuristics: QR area is near-square, name area is wide
    let qrBox = null as null | { left: number; top: number; width: number; height: number };

    for (const c of scaledComps.sort((a, b) => b.area - a.area)) {
      const w = c.x1 - c.x0 + 1;
      const h = c.y1 - c.y0 + 1;
      const ar = w / h;
      if (!qrBox && ar > 0.7 && ar < 1.4 && Math.min(w, h) > Math.min(origW, origH) * 0.08) {
        qrBox = { left: c.x0, top: c.y0, width: w, height: h };
      }
    }

    // Fallback positions if detection failed
    if (!qrBox) {
      const size = Math.round(Math.min(origW, origH) * 0.22);
      qrBox = { left: origW - size - 60, top: origH - size - 60, width: size, height: size };
    }
    // Zona fija del nombre según ticket-template.png
    const nameBox = { left: 223, top: 611, width: 660, height: 64};

    // Generate high-res QR
    const qrPayload = `ticket:${participant.uuid}`;
    const qrPngBuffer = await QRCode.toBuffer(qrPayload, { type: "png", width: Math.max(qrBox.width, qrBox.height) * 3, margin: 1, errorCorrectionLevel: "H" });

    // Resize QR to fit placeholder with inner padding (target ~90-95% of placeholder).
    // Use 92% to leave a small safe margin while increasing visual size.
    const qrInner = Math.max(8, Math.round(Math.min(qrBox.width, qrBox.height) * 0.98));
    const qrLeft = qrBox.left + Math.round((qrBox.width - qrInner) / 2);
    const qrTop = qrBox.top + Math.round((qrBox.height - qrInner) / 2);
    const qrBufferResized = await sharp(qrPngBuffer).resize(qrInner, qrInner, { fit: "contain" }).png().toBuffer();

    // Generate participant name
    const nameInnerWidth = Math.round(nameBox.width * 0.96);
    const nameInnerHeight = Math.round(nameBox.height * 0.90);

    const nameSvg = svgTextForName( //participant.fullName//, 
      "PRUEBA",nameInnerWidth, nameInnerHeight);

    const namePng = await sharp(Buffer.from(nameSvg))
    .png()
    .toBuffer();

    const nameLeft = nameBox.left + Math.round((nameBox.width - nameInnerWidth) / 2);
    const nameTop = nameBox.top + Math.round((nameBox.height - nameInnerHeight) / 2);

    // Composite onto template
    const composed = await sharp(templateBuffer)
      .composite([
        { input: qrBufferResized, left: qrLeft, top: qrTop },
        { input: namePng, left: nameLeft, top: nameTop },
      ])
      .png()
      .toBuffer();

    return { buffer: composed, width: origW, height: origH };
  } catch (error) {
    throw new Error(`Ticket image generation failed: ${String(error)}`);
  }
}

export async function generateTicketPdfFromImage(imageBuffer: Buffer, widthPx: number, heightPx: number) {
  const dataUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  const widthPt = Math.round(widthPx * 0.75);
  const heightPt = Math.round(heightPx * 0.75);
  const orientation = widthPt >= heightPt ? "landscape" : "portrait";
  const doc = new jsPDF({ unit: "pt", format: [widthPt, heightPt], orientation });
  doc.addImage(dataUrl, "PNG", 0, 0, widthPt, heightPt);
  return doc.output("datauristring");
}

export function buildWhatsAppLink(phone: string, text: string) {
  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${normalizedPhone}?text=${encodedText}`;
}
