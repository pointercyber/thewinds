import {useEffect,useRef} from 'react'
// Full-screen WebGL (OpenGL ES) shader: slow mist driven by time + scroll.
const V='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
const F=`precision mediump float;uniform vec2 r;uniform float t,s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){vec2 u=gl_FragCoord.xy/r.y;u.y-=s*.5;
float q=fbm(u*1.5+vec2(t*.03,0.));float w=fbm(u*1.5+q*2.+vec2(0.,t*.04));
vec3 c=vec3(.945,.933,.91);
c=mix(c,vec3(.80,.88,.82),w*.6);
c=mix(c,vec3(.82,.90,.93),smoothstep(.45,.9,q)*.5);
gl_FragColor=vec4(c,1.);}`
export default function GL(){
  const ref=useRef()
  useEffect(()=>{
    const c=ref.current,g=c.getContext('webgl');if(!g)return
    const sh=(k,src)=>{const o=g.createShader(k);g.shaderSource(o,src);g.compileShader(o);return o}
    const pr=g.createProgram();g.attachShader(pr,sh(g.VERTEX_SHADER,V));g.attachShader(pr,sh(g.FRAGMENT_SHADER,F))
    g.linkProgram(pr);g.useProgram(pr)
    g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW)
    const l=g.getAttribLocation(pr,'p');g.enableVertexAttribArray(l);g.vertexAttribPointer(l,2,g.FLOAT,false,0,0)
    const ur=g.getUniformLocation(pr,'r'),ut=g.getUniformLocation(pr,'t'),us=g.getUniformLocation(pr,'s')
    const still=matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf,cur=0,t0=performance.now()
    const size=()=>{c.width=innerWidth*.5;c.height=innerHeight*.5;g.viewport(0,0,c.width,c.height)}
    const draw=now=>{
      const target=scrollY/innerHeight;cur+=(target-cur)*.06
      g.uniform2f(ur,c.width,c.height);g.uniform1f(ut,(now-t0)/1000);g.uniform1f(us,cur)
      g.drawArrays(g.TRIANGLES,0,3)
      if(!still)raf=requestAnimationFrame(draw)
    }
    size();addEventListener('resize',size);raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',size)}
  },[])
  return <canvas ref={ref} className="gl" aria-hidden="true"/>
}
