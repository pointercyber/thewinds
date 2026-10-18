import {useEffect,useRef,useState} from 'react'
// WebGL hero slideshow: noise-driven dissolve + slow Ken Burns zoom between photos.
const V='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
const F=`precision mediump float;uniform sampler2D a,b;uniform vec2 r,ia;uniform float p,t;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
vec2 cv(vec2 u,float ar,float z){float s=r.x/r.y;vec2 k=s>ar?vec2(1.,ar/s):vec2(s/ar,1.);return (u-.5)*k/z+.5;}
void main(){vec2 u=gl_FragCoord.xy/r;
float q=n(u*vec2(3.,3.*r.y/r.x)+t*.05)*.6+n(u*7.+t*.08)*.4;
float m=smoothstep(0.,.3,p*1.3-(u.x*.5+q*.3));
float z=1.08+.03*sin(t*.12);vec2 d=vec2(q-.5,0.)*.14;
vec4 A=texture2D(a,cv(u,ia.x,z)+d*m),B=texture2D(b,cv(u,ia.y,z)-d*(1.-m));
gl_FragColor=mix(A,B,m);}`
export default function HeroGL({slides}){
  const box=useRef(),cv=useRef(),go=useRef(()=>{}),[idx,setIdx]=useState(0)
  useEffect(()=>{
    setIdx(0)
    if(!slides.length)return
    const c=cv.current,g=c.getContext('webgl');if(!g)return
    const sh=(k,s)=>{const o=g.createShader(k);g.shaderSource(o,s);g.compileShader(o);return o}
    const pr=g.createProgram();g.attachShader(pr,sh(g.VERTEX_SHADER,V));g.attachShader(pr,sh(g.FRAGMENT_SHADER,F))
    g.linkProgram(pr);g.useProgram(pr)
    g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW)
    const l=g.getAttribLocation(pr,'p');g.enableVertexAttribArray(l);g.vertexAttribPointer(l,2,g.FLOAT,false,0,0)
    const U=k=>g.getUniformLocation(pr,k);g.uniform1i(U('a'),0);g.uniform1i(U('b'),1)
    const still=matchMedia('(prefers-reduced-motion: reduce)').matches
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true)
    const T=slides.map(({image})=>{
      const o={t:g.createTexture(),ar:1.5,ok:false}
      g.bindTexture(g.TEXTURE_2D,o.t);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,1,1,0,g.RGBA,g.UNSIGNED_BYTE,new Uint8Array([40,50,45,255]))
      ;[[g.TEXTURE_MIN_FILTER,g.LINEAR],[g.TEXTURE_MAG_FILTER,g.LINEAR],[g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE],[g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE]].forEach(([k,v])=>g.texParameteri(g.TEXTURE_2D,k,v))
      const im=new Image();im.onload=()=>{g.bindTexture(g.TEXTURE_2D,o.t);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,im);o.ar=im.width/im.height;o.ok=true;if(still)draw(performance.now())}
      im.src=`/images/${image}.jpg`;return o})
    let cur=0,nxt=0,prog=0,anim=false,last=performance.now(),raf,vis=true
    go.current=i=>{if(anim||i===cur||!T[i].ok)return;nxt=i;anim=true;prog=0;setIdx(i)}
    const size=()=>{const d=Math.min(devicePixelRatio,1.5);c.width=box.current.clientWidth*d;c.height=box.current.clientHeight*d;g.viewport(0,0,c.width,c.height)}
    function draw(now){
      raf=requestAnimationFrame(draw)
      const dt=Math.min((now-last)/1000,.1);last=now
      if(!vis&&!still)return
      if(anim){prog+=dt/1.8;if(prog>=1){cur=nxt;anim=false;prog=0}}
      const e=prog<.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2
      g.activeTexture(g.TEXTURE0);g.bindTexture(g.TEXTURE_2D,T[cur].t)
      g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,T[anim?nxt:cur].t)
      g.uniform2f(U('r'),c.width,c.height);g.uniform2f(U('ia'),T[cur].ar,T[anim?nxt:cur].ar)
      g.uniform1f(U('p'),anim?e:0);g.uniform1f(U('t'),now/1000)
      g.drawArrays(g.TRIANGLES,0,3)
      if(still)cancelAnimationFrame(raf)
    }
    size();addEventListener('resize',size);raf=requestAnimationFrame(draw)
    const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting});io.observe(box.current)
    const iv=still?0:setInterval(()=>go.current((cur+1)%slides.length),6000)
    return()=>{cancelAnimationFrame(raf);clearInterval(iv);io.disconnect();removeEventListener('resize',size)}
  },[slides])
  if(!slides.length)return null
  return(<div ref={box} className="hero-gl">
    <canvas ref={cv} aria-hidden="true"/>
    <div className="wrap dots" role="tablist" aria-label="Hero photos">
      {slides.map(({title},i)=><button key={`${i}-${title}`} role="tab" aria-selected={i===idx} aria-label={title} className={i===idx?'on':''} onClick={()=>go.current(i)}/>)}
      <span>{slides[idx]?.title}</span>
    </div></div>)
}
