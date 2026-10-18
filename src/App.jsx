import {useEffect,useState} from 'react'
import GL from './GL.jsx'
import HeroGL from './HeroGL.jsx'
import Loader from './Loader.jsx'

const PHONE='919990815181'
const wa=(m='Hi! I would like to check availability at The Winds Homestay.')=>`https://wa.me/${PHONE}?text=${encodeURIComponent(m)}`
const L=e=>e.currentTarget.classList.add('ld')
const img=n=>`/images/${n}.jpg`

const NAV=[['story','Our Story'],['why','Why Stay'],['rooms','Rooms & Rates'],['gallery','Gallery'],['experiences','Experiences'],['reviews','Reviews'],['book','Book Your Stay']]
const ROOMS=[
 {n:'Deluxe Mountain Mist Room',p:'4,500',g:'Up to 3 guests',b:'1 king bed, rollaway on request',i:'bedroom',d:'A private wooden sit-out facing misty tea valleys, cedar-inspired interiors and crisp white bedding.',a:['High-speed Wi-Fi','24/7 hot water','Valley views','Attached bathroom','Smart TV','Free parking']},
 {n:'Grand Valley Family Suite',p:'6,500',g:'Up to 5 guests',b:'2 queen beds + living lounge',i:'suite',d:'Space for families and small groups: a spacious lounge, panoramic windows and tea garden views.',a:['High-speed Wi-Fi','24/7 hot water','Panoramic views','Deluxe bathroom','Smart TV & lounge','Free parking']},
 {n:'Heritage Plantation Cottage',p:'5,200',g:'2 adults + 1 child',b:'1 king bed, garden verandah',i:'desk',d:'Stone-and-timber architecture among cardamom groves and silver oaks. Private and quiet.',a:['High-speed Wi-Fi','24/7 hot water','Garden sit-out','En-suite bathroom','Coffee & tea brewer','Free parking']}]
const PICS=[['home','The Home','Homestay surrounded by trees'],['hills','Green Views','Tea hills from the sit-out'],['living','Interiors','Living area'],['bedroom','Interiors','Bedroom'],['kitchen','Interiors','Kitchen'],['bath','Interiors','Bathroom'],['suite','Interiors','Bedroom doorway'],['desk','Interiors','Lounge and work nook']]
const EXP=[['Off-Road Mountain Jeep Safari','4x4 trails, stream stops and sunset viewpoints, with drivers arranged by the host.','3–4 hours · starts at the homestay'],
['Wayanad 900 Kandi Glass Bridge','Glass skywalk above the forest, zip-lining, giant swings and canopy views.','8.5 km · 18 min drive · half day'],
['Tea Estate & Aromatics Walks','Walk through tea, cardamom and pepper with birdwatching and a lesson in tea making.','1–2 hours · around the homestay'],
['Soochipara & Meenmutty Waterfalls','Forest trails, freshwater pools and viewpoints in the Western Ghats.','14 km · 25 min drive · 3–5 hours']]
const SEAS=[['Winter Mist','Oct – Feb','16–25°C. Trekking and misty hills. Carry a light fleece or shawl.'],['Pleasant Summer','Mar – May','Green hills and outdoor days.'],['Verdant Monsoon','Jun – Sep','Waterfalls and rain. Bring waterproofs and grippy shoes.']]
const FAQ=[['Check-in and check-out times?','Check-in from 1:00 PM, check-out by 11:00 AM. Early or late arrivals are possible with prior notice.'],
['Is food available?','Home-cooked Kerala food and homemade breakfast. Confirm meals with the host when booking.'],
['Is parking available?','Yes, free secure parking.'],
['How close are the attractions?','900 Kandi Glass Bridge is about 8.5 km away, Soochipara and Meenmutty Waterfalls about 14 km. Chembra trekking is also nearby.'],
['How do I book?','Message or call +91 99908 15181 with check-in, check-out, guests and preferred room.'],
['Cancellation policy?','Ask the host before booking about cancellations, date changes and charges.']]

function useReveal(ready){
  useEffect(()=>{
    if(!ready)return
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12})
    document.querySelectorAll('.rv').forEach(el=>io.observe(el))
    let r;const sy=()=>{cancelAnimationFrame(r);r=requestAnimationFrame(()=>document.documentElement.style.setProperty('--sy',scrollY))}
    addEventListener('scroll',sy,{passive:true});sy()
    return()=>{io.disconnect();removeEventListener('scroll',sy)}
  },[ready])
}
const Tag=({children})=><span className="tag">{children}</span>
const Sec=({id,tag,title,children,aside})=>(
  <section id={id} className="sec"><div className="wrap">
    <div className="rv"><Tag>{tag}</Tag></div>
    <div className="sec-h"><h2 className="rv">{title}</h2>{aside&&<p className="rv aside">{aside}</p>}</div>
    {children}
  </div></section>)

export default function App(){
  const [open,setOpen]=useState(false)
  const [cat,setCat]=useState('All Photos')
  const [ready,setReady]=useState(false),[gone,setGone]=useState(false)
  useReveal(ready)
  const [top,setTop]=useState(true)
  useEffect(()=>{
    const s=()=>setTop(scrollY<60),k=e=>e.key==='Escape'&&setOpen(false),z=()=>innerWidth>=1040&&setOpen(false)
    addEventListener('scroll',s,{passive:true});addEventListener('keydown',k);addEventListener('resize',z);s()
    return()=>{removeEventListener('scroll',s);removeEventListener('keydown',k);removeEventListener('resize',z)}
  },[])
  useEffect(()=>{document.body.style.overflow=(open||!ready)?'hidden':''},[open,ready])
  const go=()=>setOpen(false)
  return(<>
    {!gone&&<Loader onReveal={()=>setReady(true)} onDone={()=>setGone(true)}/>}
    <GL/>
    <header className={'nav'+(top&&!open?' top':'')+(open?' open':'')}><div className="wrap nav-in">
      <a href="#top" className="brand" onClick={go}><img src={img('logo')} alt=""/>The Winds</a>
      <nav className="dnav" aria-label="Main">{NAV.slice(0,6).map(([id,l])=><a key={id} href={'#'+id}>{l}</a>)}</nav>
      <a className="pill dark nav-cta" href="#book">Book Your Stay</a>
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(!open)}><i/><i/></button>
    </div></header>
    <nav className={open?'menu open':'menu'} aria-label="Menu">{NAV.map(([id,l])=><a key={id} href={'#'+id} onClick={go}>{l}</a>)}<a className="pill dark" href={wa()}>Book on WhatsApp</a></nav>

    <main id="top">
      <section className="hero"><HeroGL/>
        <div className="wrap hero-in">
          <h1 className="rv">THE WINDS<br/>HOMESTAY</h1>
          <div className="hero-row rv">
            <p>A peaceful home in the hills of Wayanad. Green views, cozy rooms and a slower kind of stay. Rates from ₹4,500 per day.</p>
            <div className="btns"><a className="pill" href="#rooms">Rooms & Rates</a><a className="pill dark" href={wa()}>Book on WhatsApp</a></div>
          </div>
        </div></section>

      <section className="sec"><div className="wrap stats rv">
        {[['6','rooms and cozy corners'],['4.9','guest rating'],['24/7','host support'],['₹4,500','starting price per day']].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}
      </div></section>

      <Sec id="story" tag="Our Story" title={<>A HOME IN THE HILLS,<br/>MADE FOR SLOW DAYS.</>}>
        <div className="two">
          <p className="rv">Tucked among the greenery of Meppadi, The Winds Homestay is a family-run stay surrounded by tea estates and cool mountain air. Light-filled rooms, warm wooden interiors and an open terrace make room for unhurried mornings and quiet evenings.</p>
          <p className="rv">Clean, comfortable rooms, home-cooked food and hosts who are there whenever you need them. Stay with us. Feel at home.</p>
        </div>
        <div className="frame rv"><img src={img('hills')} alt="Tea hills of Meppadi" style={{transform:'translateY(calc(var(--sy)*-0.03px))'}}/></div>
      </Sec>

      <Sec id="why" tag="Why Stay" title="WHY STAY WITH US">
        <div className="grid3">
          {[['Cozy and airy rooms','Wooden furnishings, warm lighting, orthopedic mattresses and private valley sit-outs.'],['Clean and comfortable','Daily housekeeping, fresh linen and hot showers through the day.'],['Scenic surroundings','Tea plantations, misty valleys and the Western Ghats.'],['Warm, caring hosts','Local guidance, bonfire arrangements and help planning activities.'],['Easy access','Base for the 900 Kandi Glass Bridge, Chembra and Soochipara Falls.'],['Value for money','Wi-Fi, spacious rooms and homemade breakfast at clear prices.']].map(([a,b])=><div className="cell rv" key={a}><h3>{a}</h3><p>{b}</p></div>)}
        </div>
      </Sec>

      <Sec id="rooms" tag="Rooms & Rates" title="ROOMS & RATES" aside="Starting rates per room per day, morning tea included. Confirm dates, guests and meals with the host.">
        <div className="rooms">{ROOMS.map(r=>(
          <article className="room rv" key={r.n}>
            <div className="ph"><img src={img(r.i)} alt={r.n} loading="lazy" decoding="async" onLoad={L} onError={L}/></div>
            <div className="room-b">
              <div className="room-t"><h3>{r.n}</h3><b>₹{r.p}<small> / day</small></b></div>
              <p className="meta">{r.g} · {r.b}</p><p>{r.d}</p>
              <ul>{r.a.map(x=><li key={x}>{x}</li>)}</ul>
              <a className="pill dark" href={wa(`Hi! I would like to book the ${r.n}. Check-in: , Check-out: , Guests: `)}>Book this room</a>
            </div></article>))}</div>
      </Sec>

      <Sec id="gallery" tag="Gallery" title="THE HOME & ITS VIEWS">
        <div className="chips rv">{['All Photos','The Home','Interiors','Green Views'].map(c=><button key={c} className={'pill'+(cat===c?' dark':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
        <div className="gal">{PICS.filter(p=>cat==='All Photos'||p[1]===cat).map(([f,,t],i)=>(
          <figure key={f} className={'rv'+(i%5===0?' wide':'')}><img src={img(f)} alt={t} loading="lazy" decoding="async" onLoad={L} onError={L}/><figcaption>{t}</figcaption></figure>))}</div>
      </Sec>

      <Sec id="experiences" tag="Experiences" title="THINGS TO DO NEARBY" aside="Distances and travel times are estimates. Ask the host for current access conditions.">
        <div className="list">{EXP.map(([a,b,c])=><div className="row rv" key={a}><h3>{a}</h3><p>{b}</p><span>{c}</span></div>)}</div>
        <div className="grid3 seas">{SEAS.map(([a,b,c])=><div className="cell rv" key={a}><span className="meta">{b}</span><h3>{a}</h3><p>{c}</p></div>)}</div>
        <p className="meta rv">Pack: light jacket or shawl, grippy walking shoes, mosquito repellent, waterproofs, a camera.</p>
      </Sec>

      <Sec id="reviews" tag="Reviews" title="GUEST WORDS">
        <blockquote className="rv"><p>A peaceful stay with balcony views of misty hills. Courteous hosts who helped with our 900 Kandi passes, and a home-cooked Kerala breakfast of appam and stew.</p><cite>Aditya Nair, Bangalore · Couple’s getaway · 5 stars</cite></blockquote>
      </Sec>

      <Sec id="faq" tag="FAQ" title="GOOD TO KNOW">
        <div className="list">{FAQ.map(([q,a])=><details className="rv" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </Sec>

      <Sec id="find" tag="Find Us" title="MEPPADI, WAYANAD">
        <div className="grid3">
          <div className="cell rv"><h3>Address</h3><p>Meppadi, Wayanad District, Kerala 673577, India</p><a className="pill" href="https://www.google.com/maps/search/?api=1&query=The+Winds+Homestay+Meppadi+Wayanad">Open in Maps</a></div>
          <div className="cell rv"><h3>By air and train</h3><p>Calicut Airport (CCJ) is about 85 km, roughly 2.5 hours via Thamarassery Churam. Kozhikode Railway Station is about 78 km.</p></div>
          <div className="cell rv"><h3>By road from Bangalore</h3><p>Mysore, Gundlupet, Bandipur, Sultan Bathery, Meppadi. About 280 km; time varies with road conditions.</p></div>
        </div>
      </Sec>

      <section id="book" className="cta"><div className="wrap">
        <h2 className="rv">COME AS A GUEST.<br/>FEEL LIKE YOU’RE HOME.</h2>
        <p className="rv">Plan your Wayanad getaway. Message the host with your dates and guests to check rooms and prices.</p>
        <a className="pill dark big rv" href={wa()}>Book on WhatsApp</a>
      </div></section>
    </main>

    <footer className="foot"><div className="wrap">
      <div><b>The Winds, Homestay · Wayanad</b><p>A family-run homestay in Meppadi, surrounded by tea estates and mountain air. Stay with us. Feel at home.</p></div>
      <div className="fl">{[['rooms','Rooms & Rates'],['gallery','Gallery'],['experiences','Experiences'],['reviews','Reviews'],['faq','FAQ'],['find','Find Us'],['book','Contact']].map(([id,l])=><a key={id} href={'#'+id}>{l}</a>)}</div>
      <div><a href="tel:+919990815181">+91 99908 15181</a><a href="mailto:windshomestay@gmail.com">windshomestay@gmail.com</a><p>Meppadi, Wayanad District, Kerala 673577, India</p></div>
      <small>© 2026 The Winds Homestay, Meppadi · Wayanad · Kerala.</small>
    </div></footer>
  </>)
}
