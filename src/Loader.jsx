import {useEffect,useState} from 'react'
// Preloads fonts + hero photos, shows progress, then lifts away. Never blocks longer than 8s.
const IMGS=['home','hills','living','bedroom','logo']
export default function Loader({onReveal,onDone}){
  const [pct,setPct]=useState(0),[out,setOut]=useState(false)
  useEffect(()=>{
    let done=0,dead=false;const total=IMGS.length+1,t0=performance.now()
    const step=()=>{done++;if(!dead)setPct(Math.round(done/total*100))}
    const jobs=IMGS.map(n=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>{step();r()};i.src=`/images/${n}.jpg`}))
    jobs.push(Promise.all([document.fonts.load('400 16px "Inter Tight"'),document.fonts.load('500 16px "Inter Tight"')]).catch(()=>{}).then(step))
    Promise.race([Promise.all(jobs),new Promise(r=>setTimeout(r,8000))]).then(()=>{
      setTimeout(()=>{if(dead)return;setPct(100);setOut(true);onReveal();setTimeout(onDone,950)},Math.max(0,1500-(performance.now()-t0)))
    })
    return()=>{dead=true}
  },[])
  return(<div className={'loader'+(out?' out':'')} role="status" aria-live="polite" aria-label="Loading The Winds Homestay">
    <div className="ld-top"><span>Meppadi, Wayanad</span><span>Kerala, India</span></div>
    <h1 className="ld-t"><span><i>THE WINDS</i></span><span><i>HOMESTAY</i></span></h1>
    <div><div className="ld-bar"><b style={{transform:`scaleX(${pct/100})`}}/></div>
      <div className="ld-top"><span>Stay with us. Feel at home.</span><span className="ld-n">{pct}%</span></div></div>
  </div>)
}
