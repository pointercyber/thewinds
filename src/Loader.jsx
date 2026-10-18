import {useEffect,useState} from 'react'
// Preloads fonts + hero photos, shows progress, then lifts away. Never blocks longer than 8s.
const IMGS=['home','hills','living','bedroom','logo']
export default function Loader({onReveal,onDone,title,location,region,tagline}){
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
  return(<div className={'loader'+(out?' out':'')} role="status" aria-live="polite" aria-label={`Loading ${title.replace('\n',' ')}`}>
    <div className="ld-top"><span>{location}</span><span>{region}</span></div>
    <h1 className="ld-t">{title.split('\n').map((line,index)=><span key={`${index}-${line}`}><i>{line}</i></span>)}</h1>
    <div><div className="ld-bar"><b style={{transform:`scaleX(${pct/100})`}}/></div>
      <div className="ld-top"><span>{tagline}</span><span className="ld-n">{pct}%</span></div></div>
  </div>)
}
