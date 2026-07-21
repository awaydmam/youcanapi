// YouCam API service
// Docs: https://developer.youcam.com/

const API_KEY = import.meta.env.VITE_YOUCAM_API_KEY || ''
const API_SECRET = import.meta.env.VITE_YOUCAM_SECRET || ''
const BASE_URL = 'https://openapi.youcam.com'

async function apiCall(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`YouCam API error: ${res.status}`)
  return res.json()
}

// Convert file/blob to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 1. Skin Analysis — 14 skin concerns
export async function analyzeSkin(imageBase64) {
  if (!API_KEY) return getMockSkinAnalysis()
  return apiCall('/v1/skin/analysis', { image: imageBase64 })
}

// 2. Fitzpatrick Skin Type (I-VI)
export async function getFitzpatrickType(imageBase64) {
  if (!API_KEY) return getMockFitzpatrick()
  return apiCall('/v1/skin/fitzpatrick', { image: imageBase64 })
}

// 3. Facial Color Tones (undertone, lip, eye, hair colors)
export async function getColorTones(imageBase64) {
  if (!API_KEY) return getMockColorTones()
  return apiCall('/v1/face/color-tones', { image: imageBase64 })
}

// 4. Apparel Virtual Try-On
export async function virtualTryOn(personBase64, garmentBase64) {
  if (!API_KEY) return getMockVTO()
  return apiCall('/v1/apparel/virtual-tryon', {
    person_image: personBase64,
    garment_image: garmentBase64,
  })
}

// ─── Mock Data (for demo / no API key) ───

function getMockSkinAnalysis() {
  return {
    concerns: {
      acne: { score: 25, severity: 'mild', areas: ['chin', 'forehead'] },
      wrinkles: { score: 10, severity: 'minimal', areas: ['eyes'] },
      dark_spots: { score: 15, severity: 'minimal', areas: ['cheeks'] },
      redness: { score: 20, severity: 'low', areas: ['cheeks'] },
      oiliness: { score: 45, severity: 'moderate', areas: ['t-zone'] },
      dryness: { score: 15, severity: 'minimal', areas: [] },
      pores: { score: 35, severity: 'moderate', areas: ['nose', 'cheeks'] },
      dark_circles: { score: 30, severity: 'moderate', areas: ['under-eye'] },
      firmness: { score: 85, severity: 'good', areas: [] },
      radiance: { score: 70, severity: 'good', areas: [] },
      texture: { score: 65, severity: 'moderate', areas: ['cheeks'] },
      moisture: { score: 72, severity: 'good', areas: [] },
      sensitivity: { score: 40, severity: 'moderate', areas: ['cheeks'] },
      pigmentation: { score: 20, severity: 'low', areas: ['forehead'] },
    },
    overall_score: 68,
  }
}

function getMockFitzpatrick() {
  return {
    type: 4,
    label: 'Type IV',
    description: 'Medium Brown — Burns minimally, tans easily',
    hex: '#b07850',
  }
}

function getMockColorTones() {
  return {
    undertone: 'warm',
    season: 'autumn',
    skin_hex: '#c8a882',
    lip_hex: '#b5706a',
    eye_hex: '#6b4226',
    eyebrow_hex: '#3d2b1f',
    hair_hex: '#2c1b0e',
    best_colors: ['#8B4513', '#654321', '#556B2F', '#191970', '#CC5500', '#36454F'],
    best_color_names: ['Terracotta', 'Chocolate', 'Olive', 'Navy', 'Burnt Orange', 'Charcoal'],
    avoid_colors: ['#FFB6C1', '#FFFF00', '#FFFFFF'],
    avoid_color_names: ['Baby Pink', 'Neon Yellow', 'Stark White'],
  }
}

function getMockVTO() {
  return {
    result_image: null, // In mock mode, we'll use a placeholder
    status: 'mock',
  }
}

export default {
  analyzeSkin,
  getFitzpatrickType,
  getColorTones,
  virtualTryOn,
  fileToBase64,
}
