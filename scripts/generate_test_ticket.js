const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

async function detectWhiteRegionsJS(imageBuffer) {
  const probe = sharp(imageBuffer).resize({ width: 600, withoutEnlargement: true }).greyscale();
  const { data, info } = await probe.raw().toBuffer({ resolveWithObject: true });
  const origMeta = await sharp(imageBuffer).metadata();
  const probeWidth = info.width;
  const probeHeight = info.height;
  const w = probeWidth;
  const h = probeHeight;
  const threshold = 240;

  const visited = new Uint8Array(w * h);
  const components = [];

  function idx(x, y) { return y * w + x; }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      if (visited[i]) continue;
      const brightness = data[i];
      if (brightness < threshold) {
        visited[i] = 1; continue;
      }
      const stack = [i]; visited[i] = 1;
      let minX = x, maxX = x, minY = y, maxY = y, area = 0;
      while (stack.length) {
        const cur = stack.pop();
        const cx = cur % w; const cy = Math.floor(cur / w);
        area++;
        if (cx < minX) minX = cx; if (cx > maxX) maxX = cx; if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
        const neighbors = [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]];
        for (const [nx, ny] of neighbors) {
          if (nx<0||nx>=w||ny<0||ny>=h) continue;
          const ni = idx(nx,ny);
          if (visited[ni]) continue;
          if (data[ni] >= threshold) { visited[ni]=1; stack.push(ni); } else { visited[ni]=1; }
        }
      }
      components.push({ x0:minX, y0:minY, x1:maxX, y1:maxY, area });
    }
  }
  const scaleX = (origMeta.width || probeWidth) / probeWidth;
  const scaleY = (origMeta.height || probeHeight) / probeHeight;
  return { components, scaleX, scaleY };
}

async function generateTest() {
  const templatePath = path.join(process.cwd(), 'public', 'tickets', 'ticket-template.png');
  const outDir = path.join(process.cwd(), 'public', 'tickets', 'debug');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const buf = fs.readFileSync(templatePath);
  const meta = await sharp(buf).metadata();
  const origW = meta.width; const origH = meta.height;

  const det = await detectWhiteRegionsJS(buf);
  const comps = det.components.map(c => ({ x0: Math.round(c.x0*det.scaleX), y0: Math.round(c.y0*det.scaleY), x1: Math.round(c.x1*det.scaleX), y1: Math.round(c.y1*det.scaleY), area: c.area }));
  let qrBox = null, nameBox = null;
  for (const c of comps.sort((a,b)=>b.area-a.area)) {
    const w = c.x1 - c.x0 +1; const h = c.y1 - c.y0 +1; const ar = w/h;
    if (!qrBox && ar>0.7 && ar<1.4 && Math.min(w,h) > Math.min(origW,origH)*0.08) qrBox = { left:c.x0, top:c.y0, width:w, height:h };
    if (!nameBox && ar>2 && w > origW*0.4) nameBox = { left:c.x0, top:c.y0, width:w, height:h };
  }
  if (!qrBox) { const size = Math.round(Math.min(origW,origH)*0.22); qrBox={left:origW-size-60, top:origH-size-60, width:size, height:size}; }
  if (!nameBox) { nameBox={left:80, top:Math.round(origH*0.25), width:Math.round(origW*0.6), height:60}; }

  // create QR
  const participant = { fullName: 'Test User Example', uuid: 'test-uuid-1234' };
  const qrPayload = `ticket:${participant.uuid}`;
  const qrPng = await QRCode.toBuffer(qrPayload, { type:'png', width: Math.max(qrBox.width, qrBox.height)*3, margin:4, errorCorrectionLevel:'H' });
  const qrInner = Math.max(8, Math.round(Math.min(qrBox.width, qrBox.height)*0.92));
  const qrLeft = qrBox.left + Math.round((qrBox.width - qrInner)/2);
  const qrTop = qrBox.top + Math.round((qrBox.height - qrInner)/2);
  const qrResized = await sharp(qrPng).resize(qrInner, qrInner, { fit:'contain' }).png().toBuffer();

  const nameInnerWidth = Math.max(32, Math.round(nameBox.width*0.95));
  const nameInnerHeight = Math.max(16, Math.round(nameBox.height*0.85));
  const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let fontSize = Math.min(48, Math.floor(nameInnerHeight*0.6));
  while (fontSize>10) {
    if (participant.fullName.length * fontSize * 0.55 < nameInnerWidth) break;
    fontSize -=2;
  }
  const nameSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='${nameInnerWidth}' height='${nameInnerHeight}'><style>.name{font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; font-weight:700; fill:#000; }</style><rect width='100%' height='100%' fill='transparent' /><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' class='name'>${escape(participant.fullName)}</text></svg>`;
  const namePng = await sharp(Buffer.from(nameSvg)).png().toBuffer();
  const nameLeft = nameBox.left + Math.round((nameBox.width - nameInnerWidth)/2);
  const nameTop = nameBox.top + Math.round((nameBox.height - nameInnerHeight) * 0.75);

  // composite
  const composed = await sharp(buf).composite([
    { input: qrResized, left: qrLeft, top: qrTop },
    { input: namePng, left: nameLeft, top: nameTop }
  ]).png().toBuffer();

  const outPng = path.join(outDir, 'test_ticket.png');
  fs.writeFileSync(outPng, composed);

  const widthPt = Math.round(origW * 0.75);
  const heightPt = Math.round(origH * 0.75);
  const orientation = widthPt >= heightPt ? 'landscape' : 'portrait';
  const doc = new jsPDF({ unit:'pt', format:[widthPt, heightPt], orientation });
  const dataUrl = `data:image/png;base64,${composed.toString('base64')}`;
  doc.addImage(dataUrl, 'PNG', 0, 0, widthPt, heightPt);
  const outPdf = path.join(outDir, 'test_ticket.pdf');
  const pdfData = doc.output('arraybuffer');
  fs.writeFileSync(outPdf, Buffer.from(pdfData));

  console.log('WROTE', outPng);
  console.log('WROTE', outPdf);
}

generateTest().catch(err => { console.error(err); process.exit(1); });
