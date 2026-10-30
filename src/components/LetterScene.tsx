import type { CSSProperties } from 'react'
import type { Theme } from '../content'
import { PawPrint } from './CatArt'
import { MascotFace } from './Mascot'
import { Leaf, SootSprite } from './TotoroArt'

// Posiciones pseudoaleatorias pero fijas, para que el render sea puro y estable.
const rand = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}
const make = <T,>(count: number, build: (index: number) => T) => Array.from({ length: count }, (_, index) => build(index))
const vars = (values: Record<string, string | number>) => values as unknown as CSSProperties

const STARS = make(26, i => vars({ left: `${rand(i, 1) * 100}%`, top: `${rand(i, 2) * 52}%`, '--s': `${5 + rand(i, 3) * 9}px`, '--d': `${-rand(i, 4) * 6}s`, '--t': `${2.2 + rand(i, 5) * 3}s` }))
const SNOW = make(46, i => vars({ left: `${rand(i, 6) * 100}%`, '--s': `${3 + rand(i, 7) * 7}px`, '--d': `${-rand(i, 8) * 18}s`, '--t': `${8 + rand(i, 9) * 9}s`, '--sw': `${20 + rand(i, 10) * 50}px` }))
const FIREFLIES = make(18, i => vars({ left: `${6 + rand(i, 11) * 88}%`, top: `${28 + rand(i, 12) * 56}%`, '--s': `${4 + rand(i, 13) * 5}px`, '--d': `${-rand(i, 14) * 12}s`, '--t': `${7 + rand(i, 15) * 8}s`, '--dx': `${(rand(i, 16) - 0.5) * 140}px`, '--dy': `${(rand(i, 17) - 0.5) * 100}px` }))
const LEAF_COLORS = ['#6fcf9e', '#8ee0b4', '#4fc29a', '#a7e8c3']
const LEAVES = make(12, i => vars({ left: `${rand(i, 18) * 100}%`, '--s': `${20 + rand(i, 19) * 18}px`, '--d': `${-rand(i, 20) * 20}s`, '--t': `${10 + rand(i, 21) * 9}s`, '--sw': `${30 + rand(i, 22) * 60}px`, color: LEAF_COLORS[i % LEAF_COLORS.length] }))
const FISH_COLORS = ['#ff9fc4', '#ffc58f', '#b79cf2', '#7fd8c2', '#ffd36b']
const FISH = make(7, i => vars({ top: `${14 + rand(i, 23) * 50}%`, '--s': `${42 + rand(i, 24) * 34}px`, '--d': `${-rand(i, 25) * 40}s`, '--t': `${15 + rand(i, 26) * 13}s`, color: FISH_COLORS[i % FISH_COLORS.length] }))
const BUBBLES = make(12, i => vars({ left: `${rand(i, 30) * 100}%`, '--s': `${16 + rand(i, 31) * 22}px`, '--d': `${-rand(i, 32) * 14}s`, '--t': `${9 + rand(i, 33) * 8}s`, '--sw': `${14 + rand(i, 34) * 30}px` }))
const PAWS = make(9, i => vars({ '--i': i, '--y': i % 2 ? '10px' : '-10px' }))

function Fish() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true">
      <path d="M4 15 Q18 -1 40 15 Q18 31 4 15Z" fill="currentColor" />
      <path d="M38 15 L58 3 L52 15 L58 27Z" fill="currentColor" />
      <path d="M22 8 Q27 15 22 22" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".6" />
      <circle cx="13" cy="13" r="2.2" fill="#fff" /><circle cx="13" cy="13" r="1" fill="#3a2a3f" />
    </svg>
  )
}

function Yarn({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="26" fill={color} />
      <g stroke="#fff" strokeWidth="2.2" fill="none" opacity=".55" strokeLinecap="round">
        <path d="M8 22 Q30 6 52 22" /><path d="M4 34 Q30 18 56 34" /><path d="M8 46 Q30 30 52 46" /><path d="M20 6 Q8 30 22 54" /><path d="M40 6 Q52 30 38 54" />
      </g>
      <path d="M52 44 q10 6 4 14" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const HILL = 'M0 120 C240 40 480 40 720 110 S1200 180 1440 100 V200 H0Z'
function Hills() {
  return (
    <div className="sc-hills">
      <svg className="sc-hill sc-hill--back" viewBox="0 0 1440 200" preserveAspectRatio="none"><path d={HILL} /></svg>
      <svg className="sc-hill sc-hill--front" viewBox="0 0 1440 200" preserveAspectRatio="none"><path d="M0 150 C300 70 560 100 800 140 S1250 170 1440 120 V200 H0Z" /></svg>
    </div>
  )
}

// Cada carta tiene su propio mundo de fondo: casita de gatitos, polo norte de noche o bosque de Totoro.
function LetterScene({ theme }: { theme: Theme }) {
  if (theme.critter === 'penguin') {
    return (
      <div className="scene sc--penguin" aria-hidden="true">
        <div className="sc-sky" />
        {STARS.map((style, index) => <i key={index} className="sc-star" style={style} />)}
        <div className="sc-aurora sc-aurora--a" /><div className="sc-aurora sc-aurora--b" /><div className="sc-aurora sc-aurora--c" />
        {SNOW.map((style, index) => <i key={index} className="sc-flake" style={style} />)}
        <Hills />
        <div className="sc-slider"><MascotFace theme={theme} /></div>
      </div>
    )
  }
  if (theme.critter === 'totoro') {
    return (
      <div className="scene sc--totoro" aria-hidden="true">
        <div className="sc-sky" />
        <div className="sc-shaft sc-shaft--a" /><div className="sc-shaft sc-shaft--b" /><div className="sc-shaft sc-shaft--c" />
        <div className="sc-trees sc-trees--back" /><div className="sc-trees sc-trees--front" />
        <div className="sc-mist" />
        {LEAVES.map((style, index) => <span key={index} className="sc-leaf" style={style}><Leaf /></span>)}
        {FIREFLIES.map((style, index) => <i key={index} className="sc-firefly" style={style} />)}
        {[0, 1, 2].map(index => <span key={index} className="sc-hopper" style={vars({ '--d': `${-index * 7}s`, '--t': `${18 + index * 4}s` })}><SootSprite /></span>)}
      </div>
    )
  }
  return (
    <div className="scene sc--cat" aria-hidden="true">
      <div className="sc-sky" />
      <div className="sc-blob sc-blob--a" /><div className="sc-blob sc-blob--b" /><div className="sc-blob sc-blob--c" />
      {STARS.slice(0, 14).map((style, index) => <i key={index} className="sc-star" style={style} />)}
      {BUBBLES.map((style, index) => <i key={index} className="sc-heart" style={style}>♥</i>)}
      {FISH.map((style, index) => <span key={index} className="sc-fish" style={style}><Fish /></span>)}
      <Hills />
      <div className="sc-pawwalk">{PAWS.map((style, index) => <span key={index} style={style}><PawPrint /></span>)}</div>
      <span className="sc-yarn" style={vars({ '--t': '22s', '--d': '-4s', '--s': '64px' })}><Yarn color="#ff8fc0" /></span>
      <span className="sc-yarn" style={vars({ '--t': '30s', '--d': '-17s', '--s': '48px' })}><Yarn color="#b79cf2" /></span>
    </div>
  )
}

export default LetterScene
