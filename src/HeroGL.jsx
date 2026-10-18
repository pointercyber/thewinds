import {useEffect,useRef} from 'react'
const V='attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}'
const F=`precision highp float;varying vec2 v;uniform sampler2D T;uniform vec2 m,k;uniform float t;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
void main(){vec2 uv=(v-.5)*k*.94+.5;uv+=(m-.5)*.025;
uv+=vec2(n(uv*5.+t*.12)-.5,n(uv*5.+9.-t*.1)-.5)*.007;
vec3 c=texture2D(T,uv).rgb;
float mist=n(v*vec2(2.5,4.)+vec2(t*.05,0.));
c=mix(c,vec3(.95,.94,.9),mist*.2*smoothstep(.7,0.,v.y));
gl_FragColor=vec4(c,1.);}`
/* Photo rendered with WebGL: slow heat-haze warp, drifting mist and pointer parallax. */
export default function HeroGL({src,alt}){
  const box=useRef(null),cv=useRef(null)
  useEffect(()=>{
    const c=cv.current,gl=c.getContext('webgl');if(!gl)return
    const mk=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
    const p=gl.createProgram();gl.attachShader(p,mk(gl.VERTEX_SHADER,V));gl.attachShader(p,mk(gl.FRAGMENT_SHADER,F));gl.linkProgram(p)
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))return
    gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW)
    const a=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0)
    const U=n=>gl.getUniformLocation(p,n);const um=U('m'),uk=U('k'),ut=U('t')
    const still=matchMedia('(prefers-reduced-motion:reduce)').matches
    let raf,ready=false,ia=1.5,mx=.5,tx=.5,my=.5,ty=.5,vis=true
    const size=()=>{const d=Math.min(devicePixelRatio||1,1.5),r=box.current.getBoundingClientRect();c.width=r.width*d;c.height=r.height*d;gl.viewport(0,0,c.width,c.height)}
    const draw=ms=>{
      if(ready&&vis){mx+=(tx-mx)*.05;my+=(ty-my)*.05;const ca=c.width/c.height
        gl.uniform2f(um,mx,my);gl.uniform2f(uk,ca>ia?1:ca/ia,ca>ia?ia/ca:1);gl.uniform1f(ut,ms/1000);gl.drawArrays(gl.TRIANGLES,0,3)}
      if(!still)raf=requestAnimationFrame(draw)}
    const img=new Image();img.onload=()=>{
      const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true)
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img)
      ;[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(w=>gl.texParameteri(gl.TEXTURE_2D,w,gl.CLAMP_TO_EDGE))
      ;[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(f=>gl.texParameteri(gl.TEXTURE_2D,f,gl.LINEAR))
      ia=img.width/img.height;ready=true;size();c.style.opacity=1;if(still)draw(0)}
    img.src=src
    const ro=new ResizeObserver(()=>{size();if(still&&ready)draw(0)});ro.observe(box.current)
    const mv=e=>{const r=box.current.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height}
    const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting});io.observe(box.current)
    addEventListener('pointermove',mv);raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('pointermove',mv)}
  },[src])
  return(<div className="band" ref={box}><img src={src} alt={alt}/><canvas ref={cv} aria-hidden="true"/></div>)
}
