// generate-icons.mjs — pure Node, no dependencies
import { writeFileSync } from 'fs'
import { deflateSync } from 'zlib'

function makePNG(size) {
  const bg = { r: 122, g: 158, b: 135 }   // --sage #7a9e87
  const fg = { r: 255, g: 255, b: 255 }   // white

  // Build raw RGBA pixel data
  const pixels = new Uint8Array(size * size * 4)
  const cx = size / 2, cy = size / 2, r = size / 2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const dx = x - cx, dy = y - cy
      const inCircle = dx * dx + dy * dy <= r * r

      if (!inCircle) {
        // transparent outside circle
        pixels[i] = pixels[i+1] = pixels[i+2] = pixels[i+3] = 0
        continue
      }

      // Leaf shape: two arcs forming a leaf centred in the circle
      // Normalise coords to [-1,1]
      const nx = dx / r, ny = dy / r
      // Leaf: point up — intersection of two circles offset vertically
      const leafR = 0.62
      const inLeaf =
        (nx * nx + (ny - leafR) * (ny - leafR) <= leafR * leafR) &&
        (nx * nx + (ny + leafR) * (ny + leafR) <= leafR * leafR)

      const col = inLeaf ? fg : bg
      pixels[i]   = col.r
      pixels[i+1] = col.g
      pixels[i+2] = col.b
      pixels[i+3] = 255
    }
  }

  // ── PNG encoding ──────────────────────────────────────────────
  const SIGNATURE = Buffer.from([137,80,78,71,13,10,26,10])

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii')
    const dataBuf = Buffer.isBuffer(data) ? data : Buffer.from(data)
    const len = Buffer.alloc(4); len.writeUInt32BE(dataBuf.length)
    const crcBuf = Buffer.concat([typeBuf, dataBuf])
    const crc = crc32(crcBuf)
    const crcOut = Buffer.alloc(4); crcOut.writeInt32BE(crc)
    return Buffer.concat([len, typeBuf, dataBuf, crcOut])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // RGBA
  ihdr[10] = ihdr[11] = ihdr[12] = 0

  // IDAT — filter byte 0 (None) before each row
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4
      const dst = y * (size * 4 + 1) + 1 + x * 4
      raw[dst]   = pixels[src]
      raw[dst+1] = pixels[src+1]
      raw[dst+2] = pixels[src+2]
      raw[dst+3] = pixels[src+3]
    }
  }
  const compressed = deflateSync(raw, { level: 9 })

  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// CRC-32 table
const crcTable = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return c ^ -1
}

writeFileSync('public/icon-192.png', makePNG(192))
writeFileSync('public/icon-512.png', makePNG(512))
console.log('✓ icon-192.png and icon-512.png written to public/')
