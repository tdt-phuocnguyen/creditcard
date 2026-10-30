"use client";

import * as THREE from "three";

/** ID-1 card aspect ratio (85.60 × 53.98 mm). */
export const CARD_ASPECT = 85.6 / 53.98;

/**
 * Procedurally drawn card face (transparent background) — chip, contactless
 * mark, fine guilloché lines and a masked number. Deliberately generic: no
 * bank, no network logo, no real card number or security data.
 */
export function createCardFaceTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = Math.round(w / CARD_ASPECT);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const family = getComputedStyle(document.body).fontFamily || "sans-serif";

  // Guilloché: fine concentric arcs, cyan → violet, very low alpha.
  ctx.save();
  for (let i = 0; i < 26; i++) {
    const r = 180 + i * 22;
    const grad = ctx.createLinearGradient(w * 0.4, 0, w, h);
    grad.addColorStop(0, `rgba(85, 214, 232, ${0.07 - i * 0.0018})`);
    grad.addColorStop(1, `rgba(139, 124, 255, ${0.06 - i * 0.0016})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(w * 1.02, h * 1.12, r, Math.PI * 0.98, Math.PI * 1.52);
    ctx.stroke();
  }
  ctx.restore();

  // EMV chip — cool brushed silver to stay within the palette.
  const cx = 96;
  const cy = h * 0.42;
  const cw = 132;
  const ch = 100;
  const chipGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  chipGrad.addColorStop(0, "#e9eef6");
  chipGrad.addColorStop(0.45, "#a9b4c4");
  chipGrad.addColorStop(1, "#d7dde8");
  ctx.fillStyle = chipGrad;
  roundRect(ctx, cx, cy, cw, ch, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(40, 50, 66, 0.55)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(cx + cw * 0.36, cy);
  ctx.lineTo(cx + cw * 0.36, cy + ch);
  ctx.moveTo(cx + cw * 0.64, cy);
  ctx.lineTo(cx + cw * 0.64, cy + ch);
  ctx.moveTo(cx, cy + ch * 0.5);
  ctx.lineTo(cx + cw * 0.36, cy + ch * 0.5);
  ctx.moveTo(cx + cw * 0.64, cy + ch * 0.5);
  ctx.lineTo(cx + cw, cy + ch * 0.5);
  ctx.moveTo(cx + cw * 0.36, cy + ch * 0.32);
  ctx.lineTo(cx + cw * 0.64, cy + ch * 0.32);
  ctx.moveTo(cx + cw * 0.36, cy + ch * 0.68);
  ctx.lineTo(cx + cw * 0.64, cy + ch * 0.68);
  ctx.stroke();

  // Contactless mark.
  ctx.strokeStyle = "rgba(244, 247, 251, 0.75)";
  ctx.lineCap = "round";
  ctx.lineWidth = 7;
  for (let i = 0; i < 4; i++) {
    const r = 18 + i * 17;
    ctx.beginPath();
    ctx.arc(cx + cw + 60, cy + ch / 2, r, -Math.PI / 4.2, Math.PI / 4.2);
    ctx.stroke();
  }

  // Wordmark (generic, not a brand).
  ctx.fillStyle = "rgba(244, 247, 251, 0.92)";
  ctx.font = `600 34px ${family}`;
  ctx.textBaseline = "alphabetic";
  drawSpaced(ctx, "CREDIT", 96, 108, 9);

  // Masked number — evokes a card without any real data.
  ctx.fillStyle = "rgba(244, 247, 251, 0.55)";
  for (let group = 0; group < 4; group++) {
    for (let d = 0; d < 4; d++) {
      ctx.beginPath();
      ctx.arc(104 + group * 178 + d * 30, h - 120, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Thin cyan accent line along the bottom edge.
  const line = ctx.createLinearGradient(96, 0, w - 96, 0);
  line.addColorStop(0, "rgba(78, 161, 255, 0)");
  line.addColorStop(0.5, "rgba(85, 214, 232, 0.7)");
  line.addColorStop(1, "rgba(139, 124, 255, 0)");
  ctx.fillStyle = line;
  ctx.fillRect(96, h - 64, w - 192, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + spacing;
  }
}

/** Rounded-rectangle outline centred on the origin. */
export function roundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - radius);
  shape.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + height);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
  return shape;
}

/**
 * Thin card body: extruded rounded rectangle with a fine bevel, so the edges
 * catch rim light like machined metal. Returns the geometry and the z of the
 * front surface.
 */
export function createCardBody(width: number, height: number, radius: number, depth = 0.03, bevel = 0.012) {
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(width, height, radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 40,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return { geometry, frontZ: depth / 2 + bevel };
}

/** Flat rounded face with UVs spanning 0–1 across the card. */
export function createCardFaceGeometry(width: number, height: number, radius: number): THREE.ShapeGeometry {
  const geometry = new THREE.ShapeGeometry(roundedRectShape(width, height, radius), 40);
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + width / 2) / width;
    uv[i * 2 + 1] = (pos.getY(i) + height / 2) / height;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geometry;
}
