import {useEffect,useState} from 'react'
import HeroGL from './HeroGL.jsx'
import {IMG,logo,PHONE,wa,ROOMS,GALLERY,CATS,WHY,EXP,SEASONS,FAQ} from './data.js'
const Pill=({children})=><span className="pill">{children}</span>
const money=n=>'₹'+n.toLocaleString('en-IN')
export default function App(){
  const [cat,setCat]=useState('All photos'),[lb,setLb]=useState(null)
  useEffect(()=>{const k=e=>e.key==='Escape'&&setLb(null);addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[])
  const shots=GALLERY.filter(g=>cat==='All photos'||g.cat===cat)
  return(<>
  <header className="top"><a className="brand" href="#top"><img src={logo} alt="" width="26" height="26"/>The Winds Homestay</a>
    <nav aria-label="Main"><a href="#about">About us</a><a href="#rooms">Rooms</a><a href="#gallery">Gallery</a><a href="#experiences">Experiences</a><a href="#contact">Contact</a></nav>
    <a className="tel" href="tel:+919990815181">{PHONE}</a></header>
  <main id="top">
  <section className="hero">
    <h1><span className="ln"><span>Homestay in the</span></span><span className="ln r"><span>hills of Wayanad</span></span></h1>
    <div className="heroRow"><p>A family-run home in Meppadi, among tea estates and cool mountain air. Green views, cozy rooms and a slower kind of stay, from ₹4,500 per day.</p>
      <div className="btns"><a className="pillbtn" href={wa()} target="_blank" rel="noopener">Book on WhatsApp<i/></a><a className="pillbtn dark" href="#rooms">View rooms<i/></a></div></div>
  </section>
  <HeroGL src={IMG.ext} alt="The Winds Homestay among trees in Meppadi"/>

  <section id="about" className="sec">
    <div className="head"><div><Pill>About us</Pill><h2>A home in the hills, made for slow days</h2></div>
      <p>Light-filled rooms, warm wooden interiors and an open terrace create space for unhurried mornings and relaxing evenings.</p>
      <p>Clean rooms, home-cooked food and hosts who are there when you need them. Book directly with us, with no middlemen and no commission.</p></div>
    <div className="stats">{[['6','rooms and cozy corners'],['4.9','guest rating'],['24/7','host support'],['₹4,500','starting price per day']].map(s=><div key={s[1]}><b>{s[0]}</b><span>{s[1]}</span></div>)}</div>
    <div className="why">{WHY.map(w=><div key={w[0]}><h3>{w[0]}</h3><p>{w[1]}</p></div>)}</div>
  </section>

  <section id="rooms" className="sec">
    <div className="head"><div><Pill>Rooms</Pill><h2>Rooms and rates</h2></div><p>Starting prices per room per day, with morning tea. Please confirm rates for your dates, guests and meals.</p></div>
    <div className="rooms">{ROOMS.map(r=>
      <article key={r.name} className="room"><img src={IMG[r.img]} alt={r.name} loading="lazy"/>
        <div className="cap"><span>{r.name}</span><a className="view" href={wa(r.name)} target="_blank" rel="noopener">Book</a></div>
        <div className="info"><b>{money(r.price)} <small>per day</small></b><span>{r.guests} · {r.bed}</span><p>{r.text}</p><ul>{r.am.map(a=><li key={a}>{a}</li>)}</ul></div></article>)}</div>
  </section>

  <section id="gallery" className="sec">
    <div className="head"><div><Pill>Gallery</Pill><h2>Inside and around</h2></div>
      <div className="tabs" role="group" aria-label="Filter photos">{CATS.map(c=><button key={c} aria-pressed={c===cat} onClick={()=>setCat(c)}>{c}</button>)}</div></div>
    <div className="gal">{shots.map(g=><button key={g.k} onClick={()=>setLb(g)}><img src={IMG[g.k]} alt={g.t} loading="lazy"/><span>{g.t}</span></button>)}</div>
  </section>

  <section id="experiences" className="sec">
    <div className="head"><div><Pill>Experiences</Pill><h2>Nearby, and worth the trip</h2></div><p>Distances and timings are approximate. Please confirm with your host.</p></div>
    <div className="list">{EXP.map(e=><div key={e[0]}><h3>{e[0]}</h3><p>{e[1]}</p><span>{e[2]}</span></div>)}</div>
    <div className="seasons">{SEASONS.map(s=><div key={s[0]}><h3>{s[0]}</h3><small>{s[1]}</small><p>{s[2]}</p></div>)}</div>
  </section>

  <section className="sec quote"><Pill>Reviews</Pill>
    <blockquote>Peaceful atmosphere, balcony views of misty hills, and a home-cooked Kerala breakfast of appam and stew. The hosts even helped with our 900 Kandi passes.</blockquote>
    <p>Aditya Nair, Bangalore · Couple’s getaway · 5 stars</p></section>

  <section className="sec"><div className="head"><div><Pill>Good to know</Pill><h2>Questions</h2></div></div>
    <div className="faq">{FAQ.map(f=><details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</div></section>

  <section id="contact" className="sec cta">
    <h2>Come as a guest. Feel like you’re home.</h2>
    <div className="ctaRow"><div><p>Meppadi, Wayanad District, Kerala 673577, India</p>
      <p>Calicut Airport (CCJ) is about 85 km away, around 2.5 hours. Kozhikode station is about 78 km. From Bangalore it is about 280 km via Mysore, Gundlupet, Bandipur and Sultan Bathery.</p></div>
      <div className="btns"><a className="pillbtn dark" href={wa()} target="_blank" rel="noopener">Book on WhatsApp<i/></a>
      <a className="pillbtn" href="https://www.google.com/maps/search/?api=1&query=Meppadi+Wayanad+Kerala+673577" target="_blank" rel="noopener">Open in Maps<i/></a></div></div>
  </section>
  </main>
  <footer><span>© 2026 The Winds Homestay, Meppadi, Wayanad, Kerala</span><a href="tel:+919990815181">{PHONE}</a><a href="mailto:windshomestay@gmail.com">windshomestay@gmail.com</a></footer>
  {lb&&<div className="lb" role="dialog" aria-modal="true" aria-label={lb.t} onClick={()=>setLb(null)}><img src={IMG[lb.k]} alt={lb.t}/></div>}
  </>)
}
