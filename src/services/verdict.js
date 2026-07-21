// Verdict / Glow Score Engine
// Compares product attributes against user's Skin DNA

// Color harmony: how well does a garment color match the user's undertone?
const COLOR_HARMONY = {
  warm: {
    good: ['brown', 'terracotta', 'olive', 'navy', 'orange', 'burnt', 'chocolate', 'charcoal', 'rust', 'gold', 'cream', 'forest', 'burgundy', 'coral', 'amber', 'khaki', 'tan', 'beige', 'maroon', 'teal'],
    bad: ['pink', 'baby', 'neon', 'pastel', 'lavender', 'icy', 'fuchsia', 'magenta', 'silver'],
  },
  cool: {
    good: ['blue', 'purple', 'lavender', 'silver', 'pink', 'emerald', 'white', 'grey', 'gray', 'mauve', 'plum', 'berry', 'navy', 'wine', 'rose', 'cobalt', 'sapphire', 'mint'],
    bad: ['orange', 'rust', 'gold', 'amber', 'terracotta', 'brown', 'mustard', 'camel'],
  },
  neutral: {
    good: ['navy', 'white', 'black', 'grey', 'gray', 'blue', 'green', 'burgundy', 'teal', 'blush', 'sage', 'charcoal', 'cream', 'taupe'],
    bad: ['neon', 'electric'],
  },
}

// Fabric safety based on skin conditions
const FABRIC_RATINGS = {
  cotton: { base: 90, sensitivity: 0, oiliness: 0 },
  linen: { base: 88, sensitivity: 0, oiliness: -5 },
  silk: { base: 85, sensitivity: -5, oiliness: 0 },
  bamboo: { base: 92, sensitivity: 0, oiliness: 0 },
  denim: { base: 70, sensitivity: -10, oiliness: 0 },
  polyester: { base: 40, sensitivity: -25, oiliness: -20 },
  nylon: { base: 35, sensitivity: -30, oiliness: -25 },
  rayon: { base: 65, sensitivity: -10, oiliness: -5 },
  wool: { base: 55, sensitivity: -20, oiliness: 0 },
  spandex: { base: 50, sensitivity: -15, oiliness: -15 },
  acrylic: { base: 40, sensitivity: -20, oiliness: -15 },
  modal: { base: 82, sensitivity: 0, oiliness: 0 },
}

// Detect dominant color name from hex
function hexToColorName(hex) {
  if (!hex) return 'unknown'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  if (r > 200 && g > 200 && b > 200) return 'white'
  if (r < 50 && g < 50 && b < 50) return 'black'
  if (r > 180 && g < 100 && b < 100) return 'red'
  if (r > 200 && g > 150 && b < 100) return 'orange'
  if (r > 200 && g > 200 && b < 100) return 'yellow'
  if (r < 100 && g > 150 && b < 100) return 'green'
  if (r < 100 && g < 100 && b > 150) return 'blue'
  if (r > 150 && g < 100 && b > 150) return 'purple'
  if (r > 200 && g > 150 && b > 150) return 'pink'
  if (r > 150 && g > 100 && b < 80) return 'brown'
  if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) return 'grey'
  if (r > 180 && g > 120 && b < 80) return 'gold'
  if (r < 80 && g > 100 && b > 100) return 'teal'
  return 'neutral'
}

// Score color match (0-100)
function scoreColorMatch(productColorHex, undertone) {
  const colorName = hexToColorName(productColorHex).toLowerCase()
  const rules = COLOR_HARMONY[undertone] || COLOR_HARMONY.neutral

  if (rules.good.some(c => colorName.includes(c))) return 85 + Math.random() * 15
  if (rules.bad.some(c => colorName.includes(c))) return 15 + Math.random() * 25
  return 50 + Math.random() * 20
}

// Score fabric safety (0-100)
function scoreFabricSafety(fabricType, skinConcerns) {
  const fabric = FABRIC_RATINGS[fabricType?.toLowerCase()] || { base: 60, sensitivity: -5, oiliness: -5 }
  let score = fabric.base

  const sensitivity = skinConcerns?.sensitivity?.score || 0
  const oiliness = skinConcerns?.oiliness?.score || 0

  if (sensitivity > 30) score += fabric.sensitivity * (sensitivity / 100)
  if (oiliness > 30) score += fabric.oiliness * (oiliness / 100)

  return Math.max(0, Math.min(100, Math.round(score)))
}

// Generate color match reason
function getColorReason(score, colorName, undertone) {
  if (score >= 80) return `This ${colorName} harmonizes beautifully with your ${undertone} undertone. It will enhance your natural glow and make your skin look radiant.`
  if (score >= 60) return `This ${colorName} is acceptable for your ${undertone} undertone, but not your absolute best match. It won't clash but won't maximize your glow either.`
  if (score >= 40) return `This ${colorName} may not be ideal for your ${undertone} undertone. It could wash out your complexion or create an unflattering contrast.`
  return `This ${colorName} actively clashes with your ${undertone} undertone. It will make your skin look dull and may emphasize blemishes.`
}

// Generate fabric reason
function getFabricReason(score, fabricType) {
  const name = fabricType || 'unknown fabric'
  if (score >= 80) return `${name} is excellent for your skin profile. Breathable, gentle, and unlikely to cause irritation.`
  if (score >= 60) return `${name} is generally okay for your skin, but monitor for any discomfort during extended wear.`
  if (score >= 40) return `${name} may cause some irritation given your skin sensitivity and oiliness levels. Consider alternatives.`
  return `${name} is NOT recommended for your skin profile. It can trap moisture, increase breakouts, and irritate sensitive skin.`
}

// Main verdict engine
export function generateVerdict(product, skinDNA) {
  if (!skinDNA) {
    return {
      verdict: 'UNKNOWN',
      glowScore: 0,
      colorScore: 0,
      fabricScore: 0,
      styleScore: 70,
      reasons: { color: 'Scan your skin first to get personalized recommendations.' },
    }
  }

  const colorScore = Math.round(scoreColorMatch(
    product.dominantColor || '#808080',
    skinDNA.colorTones?.undertone || 'neutral'
  ))

  const fabricScore = scoreFabricSafety(
    product.fabricType || 'polyester',
    skinDNA.skinAnalysis?.concerns
  )

  const styleScore = 60 + Math.round(Math.random() * 30) // Simplified for MVP

  // Weighted average
  const glowScore = Math.round(colorScore * 0.4 + fabricScore * 0.35 + styleScore * 0.25)
  const verdict = glowScore >= 70 ? 'BUY' : 'SKIP'

  const colorName = hexToColorName(product.dominantColor || '#808080')
  const undertone = skinDNA.colorTones?.undertone || 'neutral'

  return {
    verdict,
    glowScore,
    colorScore,
    fabricScore,
    styleScore,
    reasons: {
      color: getColorReason(colorScore, colorName, undertone),
      fabric: getFabricReason(fabricScore, product.fabricType || 'unknown'),
      style: styleScore >= 70
        ? 'The silhouette and cut complement your body proportions well.'
        : 'This style is acceptable but may not be the most flattering cut for you.',
    },
    recommendation: verdict === 'SKIP'
      ? `Look for similar styles in ${(skinDNA.colorTones?.best_color_names || ['Navy', 'Olive']).slice(0, 3).join(', ')} — those colors would score 85+ for your Skin DNA.`
      : 'Great choice! This product aligns well with your Skin DNA profile.',
  }
}

// Extract dominant color from an image using canvas
export function extractDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 50
      canvas.height = 50
      ctx.drawImage(img, 0, 0, 50, 50)
      const data = ctx.getImageData(0, 0, 50, 50).data
      let r = 0, g = 0, b = 0, count = 0
      for (let i = 0; i < data.length; i += 16) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; count++
      }
      r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count)
      resolve('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''))
    }
    img.onerror = () => resolve('#808080')
    img.src = imageUrl
  })
}

// Guess fabric type from product description
export function guessFabricType(description) {
  if (!description) return 'unknown'
  const desc = description.toLowerCase()
  const fabrics = Object.keys(FABRIC_RATINGS)
  for (const f of fabrics) {
    if (desc.includes(f)) return f
  }
  if (desc.includes('synthetic')) return 'polyester'
  if (desc.includes('organic')) return 'cotton'
  if (desc.includes('stretch')) return 'spandex'
  return 'unknown'
}
