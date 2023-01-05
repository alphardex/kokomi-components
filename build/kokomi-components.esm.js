import*as e from"kokomi.js";import*as t from"three";import o from"gsap";import i from"lodash";class a extends e.Component{mg;textColor;textSpacing;font;constructor(o,i={}){super(o);const{scroller:a=new e.NormalScroller,shadowColor:r="#03D8F3",textColor:n="#ffffff",textSpacing:s=.05,grid:c=[3,6],font:l="",elList:v=[...document.querySelectorAll(".ct")]}=i;this.textColor=n,this.textSpacing=s,this.font=l;const f=new e.MojiGroup(o,{vertexShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;void main(){vec3 p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);vUv=uv;}",fragmentShader:"#define GLSLIFY 1\nfloat rand(float n){return fract(sin(n)*43758.5453123);}float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}float noise(float p){float fl=floor(p);float fc=fract(p);return mix(rand(fl),rand(fl+1.),fc);}float noise(vec2 n){const vec2 d=vec2(0.,1.);vec2 b=floor(n),f=smoothstep(vec2(0.),vec2(1.),fract(n));return mix(mix(rand(b),rand(b+d.yx),f.x),mix(rand(b+d.xy),rand(b+d.yy),f.x),f.y);}float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}float saturate(float a){return clamp(a,0.,1.);}varying vec2 vUv;uniform float uProgress;uniform float uProgress1;uniform vec2 uGrid;uniform float uGridSize;uniform vec3 uTextColor;uniform vec3 uShadowColor;float getMixer(vec2 p,float pr,float pattern){float width=.5;pr=map(pr,0.,1.,-width,1.);pr=smoothstep(pr,pr+width,p.x);float mixer=1.-saturate(pr*2.-pattern);return mixer;}void main(){vec2 p=vUv;vec2 grid=uGrid;grid.x*=uGridSize;vec2 gridP=vec2(floor(grid.x*p.x),floor(grid.y*p.y));float pattern=noise(gridP);vec4 col=vec4(0.);vec4 l0=vec4(uShadowColor,1.);float pr0=uProgress;float m0=getMixer(p,pr0,pattern);col=mix(col,l0,m0);vec4 l1=vec4(uTextColor,1.);float pr1=uProgress1;float m1=getMixer(p,pr1,pattern);col=mix(col,l1,m1);gl_FragColor=col;}",scroller:a,uniforms:{uProgress:{value:0},uProgress1:{value:0},uGrid:{value:new t.Vector2(c[0],c[1])},uGridSize:{value:1},uShadowColor:{value:new t.Color(r)}},elList:v});this.mg=f}addExisting(){this.mg.addExisting(),this.mg.mojis.forEach((e=>{e.textMesh.mesh.material.uniforms.uGridSize.value=e.textMesh.mesh._private_text.length,e.textMesh.mesh.letterSpacing=this.textSpacing;const o=e.el.dataset.webglTextColor||this.textColor;e.textMesh.mesh.material.uniforms.uTextColor.value=new t.Color(o),this.font&&(e.textMesh.mesh.font=this.font)}))}fadeIn(e,t={}){const{duration:i=1.6,stagger:a=.05,delay:r=0}=t;this.mg.mojis&&this.mg.mojis.forEach((t=>{if(!t.el.classList.contains(e))return;const n=i,s=o.timeline(),c=t.textMesh.mesh.material.uniforms;s.to(c.uProgress,{value:1,duration:n}),s.to(c.uProgress1,{value:1,duration:n,delay:r},a)}))}fadeOut(e,t={}){const{duration:i=1.6,stagger:a=.05,delay:r=0}=t;this.mg.mojis&&this.mg.mojis.forEach((t=>{if(!t.el.classList.contains(e))return;const n=i,s=o.timeline(),c=t.textMesh.mesh.material.uniforms;s.to(c.uProgress1,{value:0,duration:n,delay:r}),s.to(c.uProgress,{value:0,duration:n,delay:r},a)}))}}const r=new t.ShaderMaterial({vertexShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;varying vec3 vNormal;varying vec4 vMvPosition;varying vec3 vPosition;uniform vec2 uMouse;uniform float uRandom;uniform float uLayerId;mat2 rotation2d(float angle){float s=sin(angle);float c=cos(angle);return mat2(c,-s,s,c);}mat4 rotation3d(vec3 axis,float angle){axis=normalize(axis);float s=sin(angle);float c=cos(angle);float oc=1.-c;return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,0.,0.,0.,1.);}vec2 rotate(vec2 v,float angle){return rotation2d(angle)*v;}vec3 rotate(vec3 v,vec3 axis,float angle){return(rotation3d(axis,angle)*vec4(v,1.)).xyz;}vec3 distort(vec3 p){vec3 tx1=vec3(-uMouse.x*uRandom*.05,-uMouse.y*uRandom*.02,0.);p+=tx1;float angle=iTime*uRandom;p=rotate(p,vec3(0.,1.,0.),angle);vec3 tx2=vec3(-uMouse.x*uRandom*.5,-uMouse.y*uRandom*.2,0.);p+=tx2;p*=(.6-uLayerId*.5);return p;}void main(){vec3 p=position;vec3 N=normal;p=distort(p);N=distort(N);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);vUv=uv;vNormal=N;vMvPosition=modelViewMatrix*vec4(p,1.);vPosition=p;}",fragmentShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;varying vec3 vNormal;varying vec4 vMvPosition;varying vec3 vPosition;uniform sampler2D uTexture;uniform vec3 uLightPosition;uniform vec3 uLightColor;uniform float uRandom;uniform vec2 uMouse;mat2 rotation2d(float angle){float s=sin(angle);float c=cos(angle);return mat2(c,-s,s,c);}mat4 rotation3d(vec3 axis,float angle){axis=normalize(axis);float s=sin(angle);float c=cos(angle);float oc=1.-c;return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,0.,0.,0.,1.);}vec2 rotate(vec2 v,float angle){return rotation2d(angle)*v;}vec3 rotate(vec3 v,vec3 axis,float angle){return(rotation3d(axis,angle)*vec4(v,1.)).xyz;}float saturate(float a){return clamp(a,0.,1.);}float diffuse(vec3 n,vec3 l){float diff=saturate(dot(n,l));return diff;}float specular(vec3 n,vec3 l,float shininess){float spec=pow(saturate(dot(n,l)),shininess);return spec;}float blendSoftLight(float base,float blend){return(blend<.5)?(2.*base*blend+base*base*(1.-2.*blend)):(sqrt(base)*(2.*blend-1.)+2.*base*(1.-blend));}vec3 blendSoftLight(vec3 base,vec3 blend){return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));}vec2 distort(vec2 p){vec2 m=uMouse;p.x-=(uRandom-m.x*.8)*.5;p.y-=uRandom*.1-iTime*.1;p.x-=.25;p.y-=.5;p=rotate(p,uRandom);p*=2.;return p;}vec3 distortNormal(vec3 p){p*=vec3(-1.*uRandom*15.,-1.*uRandom*15.,30.5);return p;}vec4 lighting(vec3 tex,vec3 normal){vec4 viewLightPosition=viewMatrix*vec4(uLightPosition,0.);vec3 N=normalize(normal);vec3 L=normalize(viewLightPosition.xyz);vec3 dif=tex*uLightColor*diffuse(N,L);vec3 C=-normalize(vMvPosition.xyz);vec3 R=reflect(-L,N);vec3 spe=uLightColor*specular(R,C,500.);vec4 lightingColor=vec4(dif+spe,.5);vec3 softlight=blendSoftLight(tex,spe);float dotRC=dot(R,C);float theta=acos(dotRC/length(R)*length(C));float a=1.-theta*.3;vec4 col=vec4(tex,a*.01)+vec4(softlight,.02)+(lightingColor*a);return col;}void main(){vec2 p=vUv;vec3 N=vNormal;p=distort(p);N=distortNormal(N);vec4 tex=texture(uTexture,p);vec4 col=tex;col=lighting(tex.xyz,N);gl_FragColor=col;}",side:t.DoubleSide,transparent:!0,uniforms:{uTexture:{value:null},uLightPosition:{value:new t.Vector3(-.2,-.2,3)},uLightColor:{value:new t.Color("#eeeeee")},uRandom:{value:t.MathUtils.randFloat(.1,1.1)},uMouse:{value:new t.Vector2(.5,.5)},uLayerId:{value:0}}});class n extends e.Component{points;mesh;uj;constructor(o,i={}){super(o);const{material:a,points:r=[]}=i;this.points=e.polySort(r);const n=e.createPolygonShape(this.points,{scale:.01}),s=new t.ExtrudeGeometry(n,{steps:1,depth:1e-4,bevelEnabled:!0,bevelThickness:5e-4,bevelSize:5e-4,bevelSegments:1});s.center();const c=a?.clone();c&&(c.uniforms.uRandom.value=t.MathUtils.randFloat(.1,1.1));const l=new t.Mesh(s,c);this.mesh=l;const v=new e.UniformInjector(this.base);this.uj=v}addExisting(){this.base.scene.add(this.mesh)}update(){const e=this.mesh.material;this.uj.injectShadertoyUniforms(e.uniforms),o.to(e.uniforms.uMouse.value,{x:this.base.interactionManager.mouse.x}),o.to(e.uniforms.uMouse.value,{y:this.base.interactionManager.mouse.y});const i=.01*this.base.clock.elapsedTime;e.uniforms.uLightPosition.value.copy(new t.Vector3(Math.cos(i),Math.sin(i),10))}}class s extends e.Component{g;frags;constructor(e,o={}){super(e);const{material:i,layerId:a=0,polygons:r}=o,s=new t.Group;this.g=s;const c=r?.map(((e,o)=>{const r=new n(this.base,{material:i,points:e});r.addExisting();const c=r.points[0];return r.mesh.position.set(.01*c.x,-.01*c.y,t.MathUtils.randFloat(-3,-1)),r.mesh.material.uniforms.uLayerId.value=a,s.add(r.mesh),r}));this.g.position.z=2-1.5*a,this.frags=c}addExisting(){this.base.scene.add(this.g)}}class c extends e.Component{material;uj;isShadertoyUniformInjected;fgs;totalG;floatDistance;floatSpeed;floatMaxDistance;isDashing;constructor(o,i={}){super(o);const{material:a=r,isShadertoyUniformInjected:n=!0}=i;this.material=a,this.uj=new e.UniformInjector(this.base),this.isShadertoyUniformInjected=n,n&&(a.uniforms={...a.uniforms,...this.uj.shadertoyUniforms});const c=new t.Group;this.base.scene.add(c),c.position.copy(new t.Vector3(-.36,.36,.1));const l=((e={})=>{const{gridX:o=10,gridY:i=20,maxX:a=9,maxY:r=9}=e,n=[];for(let e=0;e<o;e++)for(let o=0;o<i;o++){const i=[];let s=3;const c=Math.random();c>0&&c<=.2?s=3:c>.2&&c<=.55?s=4:c>.55&&c<=.9?s=5:c>.9&&c<=.95?s=6:c>.95&&c<=1&&(s=7);let l={x:0,y:0},v=t.MathUtils.randFloat(0,2*Math.PI);for(let n=0;n<s;n++)if(0===n)l={x:e%a*10,y:o%r*10},i.push(l);else{const e=10;v+=t.MathUtils.randFloat(0,Math.PI/2);const o={x:l.x+e*Math.cos(v),y:l.y+e*Math.sin(v)};i.push(o)}n.push(i)}return n})(),v=[...Array(2).keys()].map(((e,t)=>{const o=new s(this.base,{material:a,layerId:t,polygons:l});return o.addExisting(),c.add(o.g),o}));this.fgs=v;const f=(new t.Group).copy(c.clone());f.position.y=c.position.y-1;const d=new t.Group;d.add(c),d.add(f),this.totalG=d,this.floatDistance=0,this.floatSpeed=1,this.floatMaxDistance=1,this.isDashing=!1}addExisting(){this.base.scene.add(this.totalG)}update(){this.isShadertoyUniformInjected&&this.uj.injectShadertoyUniforms(this.material.uniforms),this.floatDistance+=this.floatSpeed;const e=.001*this.floatDistance;e>this.floatMaxDistance&&(this.floatDistance=0),this.totalG&&(this.totalG.position.y=e)}speedUp(){o.to(this,{floatSpeed:50,duration:4,ease:"power2.in"})}speedDown(){o.to(this,{floatSpeed:1,duration:6,ease:"power3.inOut"})}async dash(t=5e3,o){this.isDashing||(this.isDashing=!0,this.speedUp(),await e.sleep(t),o&&o(),this.speedDown())}changeTexture(e){this.fgs.forEach((o=>{o.frags.forEach((o=>{e.wrapS=t.RepeatWrapping,e.wrapT=t.RepeatWrapping,o.mesh.material.uniforms.uTexture.value=e}))}))}}class l extends e.Component{uj;ico;materialShape;materialEdge;shapeMesh;edgeMesh;constructor(o,i){super(o),this.uj=new e.UniformInjector(this.base);const a=new t.Group;this.container.add(a),this.ico=a,i.wrapS=i.wrapT=t.MirroredRepeatWrapping;const r=new t.IcosahedronGeometry(1,1),n=new t.ShaderMaterial({vertexShader:"#define GLSLIFY 1\n#define GLSLIFY 1\nvec4 getWorldPosition(mat4 modelMat,vec3 pos){vec4 worldPosition=modelMat*vec4(pos,1.);return worldPosition;}vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){vec4 worldPosition=getWorldPosition(modelMat,pos);vec3 eyeVector=normalize(worldPosition.xyz-camPos);return eyeVector;}vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod289(Pi0);Pi1=mod289(Pi1);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0*(1./7.);vec4 gy0=fract(floor(gx0)*(1./7.))-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1*(1./7.);vec4 gy1=fract(floor(gx1)*(1./7.))-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}varying vec2 vUv;varying vec3 vNormal;varying vec3 vEyeVector;uniform float uNoiseDensity;vec3 distort(vec3 p){vec3 noise=pow(cnoise(normal),3.)*normal*uNoiseDensity;vec3 dp=p+noise;return dp;}void main(){vec3 p=position;vec3 dp=distort(p);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);vUv=uv;vNormal=normalize(normalMatrix*normal);vEyeVector=getEyeVector(modelMatrix,p,cameraPosition);}",fragmentShader:"#define GLSLIFY 1\n#define GLSLIFY 1\nvec3 computeNormal(vec3 normal){vec3 X=dFdx(normal);vec3 Y=dFdy(normal);vec3 cNormal=normalize(cross(X,Y));return cNormal;}float fresnel(float bias,float scale,float power,vec3 I,vec3 N){return bias+scale*pow(1.+dot(I,N),power);}vec2 hash22(vec2 p){p=fract(p*vec2(5.3983,5.4427));p+=dot(p.yx,p.xy+vec2(21.5351,14.3137));return fract(vec2(p.x*p.y*95.4337,p.x*p.y*97.597));}uniform sampler2D uTexture;uniform float uRefractionStrength;uniform float uRandomEnabled;varying vec2 vUv;varying vec3 vNormal;varying vec3 vEyeVector;void main(){vec2 newUv=vUv;vec3 cNormal=computeNormal(vNormal);float diffuse=dot(cNormal,vec3(1.));vec2 rand=hash22(vec2(floor(diffuse*10.)));vec2 strength=vec2(sign((rand.x-.5))+(rand.x-.5)*.6,sign((rand.y-.5))+(rand.y-.5)*.6);vec2 s=vec2(1.);if(uRandomEnabled==1.){s*=strength;}newUv=s*gl_FragCoord.xy/vec2(1000.);vec3 refraction=.3*refract(vEyeVector,cNormal,1./3.);newUv+=refraction.xy;vec4 tex=texture(uTexture,newUv);vec4 color=tex;float F=fresnel(0.,1.,2.,vEyeVector,cNormal);gl_FragColor=color;}",side:t.DoubleSide,uniforms:{...this.uj.shadertoyUniforms,uTexture:{value:i},uRefractionStrength:{value:0},uRandomEnabled:{value:1},uNoiseDensity:{value:0}}});this.materialShape=n;const s=new t.Mesh(r,n);this.shapeMesh=s;const c=new t.IcosahedronGeometry(1.001,1);e.getBaryCoord(c);const l=new t.ShaderMaterial({vertexShader:"#define GLSLIFY 1\n#define GLSLIFY 1\nvec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod289(Pi0);Pi1=mod289(Pi1);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0*(1./7.);vec4 gy0=fract(floor(gx0)*(1./7.))-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1*(1./7.);vec4 gy1=fract(floor(gx1)*(1./7.))-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}varying vec2 vUv;varying vec3 vCenter;attribute vec3 aCenter;uniform float uNoiseDensity;vec3 distort(vec3 p){vec3 noise=pow(cnoise(normal),3.)*normal*uNoiseDensity;vec3 dp=p+noise;return dp;}void main(){vec3 p=position;vec3 dp=distort(p);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);vUv=uv;vCenter=aCenter;}",fragmentShader:"#define GLSLIFY 1\n#define GLSLIFY 1\nfloat edgeFactorTri(vec3 center,float width){vec3 d=fwidth(center);vec3 a3=smoothstep(d*(width-.5),d*(width+.5),center);return min(min(a3.x,a3.y),a3.z);}uniform float uWidth;varying vec2 vUv;varying vec3 vCenter;void main(){float line=1.-edgeFactorTri(vCenter,uWidth);if(line<.1){discard;}vec3 color=vec3(vec2(line),1.);gl_FragColor=vec4(color,1.);}",side:t.DoubleSide,uniforms:{...this.uj.shadertoyUniforms,uWidth:{value:1},uNoiseDensity:{value:0}}});this.materialEdge=l;const v=new t.Mesh(c,l);this.edgeMesh=v}addExisting(){this.ico.add(this.shapeMesh),this.ico.add(this.edgeMesh)}update(e){this.uj&&(this.uj.injectShadertoyUniforms(this.materialShape.uniforms),this.uj.injectShadertoyUniforms(this.materialEdge.uniforms))}autoRotate(){const e=this.base.clock.elapsedTime;this.ico.rotation.x=e/15,this.ico.rotation.y=e/15}}class v extends e.Component{urls;speed;imageSize;mat;geo;meshs;isRunning;constructor(e,o={}){super(e);const{urls:i=[],speed:a=1,imageSize:r=5}=o;this.urls=i,this.speed=a,this.imageSize=r;const n=new t.MeshBasicMaterial({side:t.DoubleSide});this.mat=n;const s=new t.CircleGeometry(this.imageSize,64);this.geo=s,this.meshs=[],this.isRunning=!1}addMesh(){const e=this.mat.clone(),o=new t.Mesh(this.geo,e);return this.container.add(o),o}addImage(e){return new Promise((o=>{(new t.TextureLoader).load(e,(e=>{const t=this.addMesh();this.meshs.push(t),t.material.map=e,o(t)}),(()=>{}),(()=>{o(!0)}))}))}async addImages(e){await Promise.all(e.map((e=>this.addImage(e))))}async addExisting(){await this.addImages(this.urls),this.emit("ready"),this.randomizeMeshesPos(),this.run()}update(){if(this.mat&&this.meshs){if(!this.isRunning)return;this.meshs.forEach((e=>{e.position.z=(e.position.z-2*this.speed)%2e3}))}}getRandomXY(){const e=t.MathUtils.randFloat(0,360),o=t.MathUtils.randFloat(10,50);return{x:o*Math.cos(e),y:o*Math.sin(e)}}getRandomPos(){const{x:e,y:o}=this.getRandomXY(),i=t.MathUtils.randFloat(-1e3,1e3);return new t.Vector3(e,o,i)}randomizeMeshesPos(){this.meshs&&this.meshs.forEach((e=>{const t=this.getRandomPos();e.position.copy(t)}))}run(){this.isRunning=!0}stop(){this.isRunning=!1}async addImageAtRandXY(e){const o=await this.addImage(e),{x:i,y:a}=this.getRandomXY(),r=new t.Vector3(i,a,-900);o.position.copy(r)}}class f extends e.Component{sq;mouse1Lerp;mouse2Lerp;offsetX1;offsetY1;offsetX2;offsetY2;constructor(o,i,a={}){super(o);const{size:r=.28,glow:n=.005,mouse1Lerp:s=.1,mouse2Lerp:c=.09}=a;this.mouse1Lerp=s,this.mouse2Lerp=c;const l=new e.ScreenQuad(this.base,{shadertoyMode:!0,fragmentShader:"#define GLSLIFY 1\nuniform vec2 uMouse1;uniform vec2 uMouse2;uniform float uSize;uniform vec2 uAspect;uniform samplerCube uCubemap;\n#define SHOW_ISOLINE 0\nconst float PI=3.14159265359;const float TWO_PI=6.28318530718;float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}float opUnion(float d1,float d2){return min(d1,d2);}vec2 opUnion(vec2 d1,vec2 d2){return(d1.x<d2.x)?d1:d2;}float opSmoothUnion(float d1,float d2,float k){float h=max(k-abs(d1-d2),0.);return min(d1,d2)-h*h*.25/k;}vec2 normalizeScreenCoords(vec2 screenCoord,vec2 resolution,vec2 aspect){vec2 uv=screenCoord/resolution.xy;uv-=vec2(.5);uv*=aspect;return uv;}mat3 setCamera(in vec3 ro,in vec3 ta,float cr){vec3 cw=normalize(ta-ro);vec3 cp=vec3(sin(cr),cos(cr),0.);vec3 cu=normalize(cross(cw,cp));vec3 cv=(cross(cu,cw));return mat3(cu,cv,cw);}vec3 getRayDirection(vec2 p,vec3 ro,vec3 ta,float fl){mat3 ca=setCamera(ro,ta,0.);vec3 rd=ca*normalize(vec3(p,fl));return rd;}float saturate(float a){return clamp(a,0.,1.);}float diffuse(vec3 n,vec3 l){float diff=saturate(dot(n,l));return diff;}float specular(vec3 n,vec3 l,float shininess){float spec=pow(saturate(dot(n,l)),shininess);return spec;}float fresnel(float bias,float scale,float power,vec3 I,vec3 N){return bias+scale*pow(1.+dot(I,N),power);}mat2 rotation2d(float angle){float s=sin(angle);float c=cos(angle);return mat2(c,-s,s,c);}mat4 rotation3d(vec3 axis,float angle){axis=normalize(axis);float s=sin(angle);float c=cos(angle);float oc=1.-c;return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,0.,0.,0.,1.);}vec2 rotate(vec2 v,float angle){return rotation2d(angle)*v;}vec3 rotate(vec3 v,vec3 axis,float angle){return(rotation3d(axis,angle)*vec4(v,1.)).xyz;}mat3 rotation3dX(float angle){float s=sin(angle);float c=cos(angle);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}vec3 rotateX(vec3 v,float angle){return rotation3dX(angle)*v;}mat3 rotation3dY(float angle){float s=sin(angle);float c=cos(angle);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}vec3 rotateY(vec3 v,float angle){return rotation3dY(angle)*v;}mat3 rotation3dZ(float angle){float s=sin(angle);float c=cos(angle);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}vec3 rotateZ(vec3 v,float angle){return rotation3dZ(angle)*v;}const float gamma=2.2;float toGamma(float v){return pow(v,1./gamma);}vec2 toGamma(vec2 v){return pow(v,vec2(1./gamma));}vec3 toGamma(vec3 v){return pow(v,vec3(1./gamma));}vec4 toGamma(vec4 v){return vec4(toGamma(v.rgb),v.a);}float sdSphere(vec3 p,float s){return length(p)-s;}vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod289(Pi0);Pi1=mod289(Pi1);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0*(1./7.);vec4 gy0=fract(floor(gx0)*(1./7.))-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1*(1./7.);vec4 gy1=fract(floor(gx1)*(1./7.))-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}float blendScreen(float base,float blend){return 1.-((1.-base)*(1.-blend));}vec3 blendScreen(vec3 base,vec3 blend){return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));}vec3 saturation(vec3 rgb,float adjustment){const vec3 W=vec3(.2125,.7154,.0721);vec3 intensity=vec3(dot(rgb,W));return mix(intensity,rgb,adjustment);}vec4 RGBShift(sampler2D t,vec2 rUv,vec2 gUv,vec2 bUv){vec4 color1=texture(t,rUv);vec4 color2=texture(t,gUv);vec4 color3=texture(t,bUv);vec4 color=vec4(color1.r,color2.g,color3.b,color2.a);return color;}vec3 distort(vec3 p){float t=iTime*.5;float distortStr=1.6;vec3 distortP=p+cnoise(vec3(p*PI*distortStr+t));float perlinStr=cnoise(vec3(distortP*PI*distortStr*.1));vec3 dispP=p;dispP+=(p*perlinStr*.1);return dispP;}vec2 map(in vec3 pos){vec2 res=vec2(1e10,0.);pos=distort(pos);vec2 m1=uMouse1.xy;m1*=uAspect;vec2 m2=uMouse2.xy;m2*=uAspect;{float r=uSize;vec3 d1p=pos;d1p-=vec3(m1*2.,0.);float d1=sdSphere(d1p,r);vec3 d2p=pos;d2p-=vec3(m2*2.,0.);float d2=sdSphere(d2p,r-.05);d2=opSmoothUnion(d2,d1,.2);res=opUnion(res,vec2(d2,114514.));}return res;}vec2 raycast(in vec3 ro,in vec3 rd,in float tMax){vec2 res=vec2(0.,-1.);float t=0.;for(int i=0;i<4;i++){vec3 p=ro+t*rd;vec2 h=map(p);if(h.x<.001||t>(tMax+GLOW)){break;};t+=h.x;res=vec2(t,h.y);}return res;}vec3 calcNormal(vec3 pos,float eps){const vec3 v1=vec3(1.,-1.,-1.);const vec3 v2=vec3(-1.,-1.,1.);const vec3 v3=vec3(-1.,1.,-1.);const vec3 v4=vec3(1.,1.,1.);return normalize(v1*map(pos+v1*eps).x+v2*map(pos+v2*eps).x+v3*map(pos+v3*eps).x+v4*map(pos+v4*eps).x);}vec3 calcNormal(vec3 pos){return calcNormal(pos,.002);}vec3 drawIsoline(vec3 col,vec3 pos){float d=map(pos).x;col*=1.-exp(-6.*abs(d));col*=.8+.2*cos(150.*d);col=mix(col,vec3(1.),1.-smoothstep(0.,.01,abs(d)));return col;}vec3 material(in vec3 col,in vec3 pos,in float m,in vec3 nor){col=vec3(0.);if(m==114514.){if(SHOW_ISOLINE==1){col=drawIsoline(col,vec3(pos.x*1.,pos.y*0.,pos.z*1.));}}return col;}vec3 lighting(in vec3 col,in vec3 pos,in vec3 rd,in vec3 nor,in float t,in vec2 screenUv){vec3 lin=col;vec3 m=vec3(uMouse1*iResolution.xy,0.);vec3 viewDir=normalize(vec3(0.)-vec3(m.x/(iResolution.x*.25),m.y/(iResolution.y*.25),-2.));vec3 I=normalize(nor.xyz-viewDir);float distanceMouse=distance(uMouse1,vec2(0.))*.1;float fOffset=-1.4*(1.-distanceMouse*2.);float f=fOffset+fresnel(0.,1.,1.,I,nor)*1.44;float f2=fOffset+fresnel(1.,1.,1.,rd,nor)*1.44;vec3 fCol=vec3(saturate(pow(f-.8,3.)));lin=blendScreen(lin,fCol);vec3 cubeTex=texture(uCubemap,vec3(screenUv,0.)).rgb;vec3 cubeTexSat=saturation(cubeTex,6.);vec3 cubeTexF=blendScreen(mix(vec3(0.),cubeTexSat,fCol),fCol);lin=blendScreen(lin,cubeTexF);vec3 iri=vec3(0.);float iriSrength=10.;iri.r=smoothstep(cubeTexF.r*iriSrength,0.,.5);iri.g=smoothstep(cubeTexF.g*iriSrength,0.,.5);iri.b=smoothstep(cubeTexF.b*iriSrength,0.,.5);lin=blendScreen(lin,iri);vec3 iri2=vec3(0.);iri2.r=smoothstep(0.,.25,cubeTexF.r);iri2.g=smoothstep(0.,.25,cubeTexF.r);iri2.b=smoothstep(0.,.25,cubeTexF.r);lin=blendScreen(lin,iri2);vec3 mf=vec3(0.);float fFactor=pow(f+f2,1.24);float invertFFactor=-fFactor+3.;mf=vec3(invertFFactor);mf*=.1;lin=blendScreen(lin,mf);return lin;}vec4 render(in vec3 ro,in vec3 rd,in vec2 screenUv){vec4 col=vec4(0.);float tMax=2.15;vec2 res=raycast(ro,rd,tMax);float t=res.x;float m=res.y;if(t<tMax){vec3 pos=ro+t*rd;vec3 nor=calcNormal(pos);vec3 result=vec3(0.);result=material(result,pos,m,nor);result=lighting(result,pos,rd,nor,t,screenUv);col=vec4(result,1.);}if(t>tMax&&t<(tMax+GLOW)){vec3 glowColor=vec3(1.);float glowAlpha=map(t,tMax,tMax+GLOW,1.,0.);col=vec4(glowColor,glowAlpha);}return col;}vec4 getSceneColor(vec2 fragCoord){vec2 p=normalizeScreenCoords(fragCoord,iResolution.xy,uAspect);vec3 ro=vec3(0.,0.,2.);vec3 rd=normalize(vec3(p,-1.));vec2 screenUv=fragCoord.xy/iResolution.xy;vec4 col=render(ro,rd,screenUv);return col;}void mainImage(out vec4 fragColor,in vec2 fragCoord){vec4 tot=vec4(0.);float AA_size=1.;float count=0.;for(float aaY=0.;aaY<AA_size;aaY++){for(float aaX=0.;aaX<AA_size;aaX++){tot+=getSceneColor(fragCoord+vec2(aaX,aaY)/AA_size);count+=1.;}}tot/=count;fragColor=tot;}",uniforms:{uMouse1:{value:new t.Vector2(0,0)},uMouse2:{value:new t.Vector2(0,0)},uSize:{value:r},uAspect:{value:new t.Vector2(1,1)},uCubemap:{value:null}}});this.sq=l,l.material.transparent=!0,l.material.defines={GLOW:n},l.material.uniforms.uCubemap.value=i,this.offsetX1=0,this.offsetY1=0,this.offsetX2=0,this.offsetY2=0}addExisting(){this.sq.addExisting()}update(e){window.innerHeight/window.innerWidth>1?this.sq.material.uniforms.uAspect.value=new t.Vector2(window.innerWidth/window.innerHeight,1):this.sq.material.uniforms.uAspect.value=new t.Vector2(1,window.innerHeight/window.innerWidth)}followMouse(){const e=new t.Vector2(this.base.iMouse.mouseScreen.x/window.innerWidth,this.base.iMouse.mouseScreen.y/window.innerHeight),o=this.mouse1Lerp,i=this.mouse2Lerp;this.offsetX1=t.MathUtils.lerp(this.offsetX1,e.x,o),this.offsetY1=t.MathUtils.lerp(this.offsetY1,e.y,o),this.offsetX2=t.MathUtils.lerp(this.offsetX2,this.offsetX1,i),this.offsetY2=t.MathUtils.lerp(this.offsetY2,this.offsetY1,i),this.sq.material.uniforms.uMouse1.value=new t.Vector2(this.offsetX1,this.offsetY1),this.sq.material.uniforms.uMouse2.value=new t.Vector2(this.offsetX2,this.offsetY2)}}class d extends e.Component{ce;constructor(t,o={}){super(t);const{intensity:i=1}=o,a=new e.CustomEffect(t,{vertexShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;void main(){vec3 p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);vUv=uv;}",fragmentShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;uniform sampler2D tDiffuse;varying vec2 vUv;uniform float uIntensity;vec4 RGBShift(sampler2D t,vec2 rUv,vec2 gUv,vec2 bUv){vec4 color1=texture(t,rUv);vec4 color2=texture(t,gUv);vec4 color3=texture(t,bUv);vec4 color=vec4(color1.r,color2.g,color3.b,color2.a);return color;}highp float random(vec2 co){highp float a=12.9898;highp float b=78.233;highp float c=43758.5453;highp float dt=dot(co.xy,vec2(a,b));highp float sn=mod(dt,3.14);return fract(sin(sn)*c);}void main(){vec2 p=vUv;vec4 col=vec4(0.);float n=random(p+mod(iTime,1.))*.1+.5;vec2 offset=vec2(cos(n),sin(n))*.0025*uIntensity;vec2 rUv=p+offset;vec2 gUv=p;vec2 bUv=p-offset;col=RGBShift(tDiffuse,rUv,gUv,bUv);gl_FragColor=col;}",uniforms:{uIntensity:{value:i}}});this.ce=a}addExisting(){this.ce.addExisting()}}var u="#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;uniform float uPixelRatio;uniform float uPointSize;attribute float pIndex;uniform float uSpeed;float random(float n){return fract(sin(n)*43758.5453123);}vec3 distort(vec3 p,float seed){float t=iTime;p.y+=sin(t+p.x*100.)*seed*.2*uSpeed;return p;}void main(){vec3 p=position;float randVal=random(pIndex);p=distort(p,randVal);vec4 mvPosition=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mvPosition;vUv=uv;gl_PointSize=uPointSize*uPixelRatio*randVal;gl_PointSize*=(1./-mvPosition.z);}",m="#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;uniform float uOpacity;uniform vec3 uColor;float spot(vec2 p,float r,float offset){float center=distance(p,vec2(.5));float strength=r/center-offset;return strength;}void main(){vec2 p=vUv;vec3 col=uColor;float alpha=spot(gl_PointCoord,.05,.1)*uOpacity;gl_FragColor=vec4(col,alpha);}";class g extends e.Component{uj;sparkles;constructor(o,i={}){super(o);const{count:a=30,size:r=100,xRange:n=[-2,2],yRange:s=[0,1.5],zRange:c=[-2,2],speed:l=1,opacity:v=1,color:f=new t.Color("#ffffff"),vertexShader:d=u,fragmentShader:g=m}=i,x=new t.BufferGeometry,p=e.makeBuffer(a,(e=>4*Math.random()));e.iterateBuffer(p,p.length,((e,o)=>{e[o.x]=t.MathUtils.randFloat(n[0],n[1]),e[o.y]=t.MathUtils.randFloat(s[0],s[1]),e[o.z]=t.MathUtils.randFloat(c[0],c[1])})),x.setAttribute("position",new t.BufferAttribute(p,3));const h=e.makeBuffer(a/3,(e=>e));x.setAttribute("pIndex",new t.BufferAttribute(h,1));const y=new e.UniformInjector(this.base);this.uj=y;const z=new t.ShaderMaterial({vertexShader:d,fragmentShader:g,uniforms:{...y.shadertoyUniforms,uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uPointSize:{value:r},uSpeed:{value:l},uOpacity:{value:v},uColor:{value:f}},transparent:!0,blending:t.AdditiveBlending,depthWrite:!1}),P=new t.Points(x,z);this.sparkles=P,window.addEventListener("resize",(()=>{P.material.uniforms.uPixelRatio.value=Math.min(window.devicePixelRatio,2)}))}addExisting(){this.container.add(this.sparkles)}update(e){if(this.sparkles){const e=this.sparkles.material;this.uj.injectShadertoyUniforms(e.uniforms)}}}class x extends e.Component{points;positions;htmls;lines;lineOpacity;lineColor;baseClassName;constructor(e,o={}){super(e);const{radius:i=.5,segment:a=8,pointSize:r=.01,pointOpacity:n=1,pointColor:s="white",lineOpacity:c=1,lineColor:l="white",baseClassName:v="point"}=o;this.lineOpacity=c,this.lineColor=l,this.baseClassName=v;const f=new t.SphereGeometry(i,a,a),d=new t.PointsMaterial({color:s,size:r,transparent:!0,opacity:n,depthWrite:!1}),u=new t.Points(f,d);this.points=u,this.positions=[],this.htmls=[],this.lines=[],this.getPositions()}addExisting(){const{base:e,points:t}=this,{scene:o}=e;o.add(t)}getPositions(){const t=this.points.geometry.attributes.position,o=e.convertBufferAttributeToVector(t),a=i.uniqWith(o,i.isEqual);this.positions=a}removeSomePositions(){this.positions=this.positions.filter((e=>!(0===Math.abs(e.x)||0===e.z||.5===Math.abs(e.y))))}randomizePositions(){this.positions=this.positions.map((e=>{const o=t.MathUtils.randFloat(.4,1),i=new t.Vector3(o,o,o);return e.multiply(i)}))}addHtmls(){const{positions:t}=this,o=t.map(((t,o)=>{const i=o+1,a=document.querySelector(`.${this.baseClassName}-${i}`);return new e.Html(this.base,a,t)}));this.htmls=o}addLines(){const{positions:e}=this,o=new t.LineBasicMaterial({color:this.lineColor,transparent:!0,opacity:this.lineOpacity,depthWrite:!1}),i=e.map((e=>{const i=[this.points.position,e],a=(new t.BufferGeometry).setFromPoints(i),r=new t.Line(a,o);return this.container.add(r),r}));this.lines=i}listenForHoverHtml(e,t){const{htmls:o}=this;o.forEach((e=>{e.el?.addEventListener("mouseover",(()=>{this.emitter.emit("mouseover",e.el)})),e.el?.addEventListener("mouseleave",(()=>{this.emitter.emit("mouseleave",e.el)}))})),this.emitter.on("mouseover",(t=>{e(t)})),this.emitter.on("mouseleave",(e=>{t(e)}))}}var p="#define GLSLIFY 1\n#define GLSLIFY 1\nhighp float random(vec2 co){highp float a=12.9898;highp float b=78.233;highp float c=43758.5453;highp float dt=dot(co.xy,vec2(a,b));highp float sn=mod(dt,3.14);return fract(sin(sn)*c);}uniform float iTime;uniform float iVelocity;attribute vec2 aSeed;attribute float aSize;varying float vRandColor;void main(){vec3 p=position;float t=iTime*1000.;float v=iVelocity;float s=v*t;p.z=mod(p.z+s,2000.);vec4 mvPosition=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mvPosition;float pSize=aSize*(200./-mvPosition.z);gl_PointSize=pSize;float randColor=random(aSeed);vRandColor=randColor;}",h="#define GLSLIFY 1\n#define GLSLIFY 1\nfloat circle(vec2 st,float r){vec2 dist=st-vec2(.5);return 1.-smoothstep(r-(r*1.15),r,dot(dist,dist)*4.);}uniform vec3 iColor1;uniform vec3 iColor2;varying float vRandColor;void main(){vec2 p=gl_PointCoord-.5+.5;vec3 color=iColor1;if(vRandColor>0.&&vRandColor<.5){color=iColor2;}float shape=circle(p,1.);vec3 col=color*shape;gl_FragColor=vec4(col,1.);}";class y extends e.Component{count;pointColor1;pointColor2;pointSize;angularVelocity;velocity;vertexShader;fragmentShader;uj;geometry;material;points;constructor(t,o={}){super(t);const{count:i=1e4,pointColor1:a="#ff6030",pointColor2:r="#1b3984",pointSize:n=3,angularVelocity:s=0,velocity:c=.01,vertexShader:l=p,fragmentShader:v=h}=o;this.count=i,this.pointColor1=a,this.pointColor2=r,this.pointSize=n,this.angularVelocity=s,this.velocity=c,this.vertexShader=l,this.fragmentShader=v,this.uj=new e.UniformInjector(this.base),this.geometry=null,this.material=null,this.points=null,this.create()}create(){this.dispose();const o=new t.BufferGeometry;this.geometry=o;const i=e.makeBuffer(this.count,(()=>50*t.MathUtils.randFloat(-.5,.5)));o.setAttribute("position",new t.BufferAttribute(i,3));const a=e.makeBuffer(this.count,(()=>t.MathUtils.randFloat(0,1)),2);o.setAttribute("aSeed",new t.BufferAttribute(a,2));const r=e.makeBuffer(this.count,(()=>this.pointSize+t.MathUtils.randFloat(0,1)),1);o.setAttribute("aSize",new t.BufferAttribute(r,1));const n=new t.ShaderMaterial({vertexShader:this.vertexShader,fragmentShader:this.fragmentShader,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,uniforms:{...this.uj.shadertoyUniforms,iColor1:{value:new t.Color(this.pointColor1)},iColor2:{value:new t.Color(this.pointColor2)},iVelocity:{value:this.velocity}}});this.material=n;const s=new t.Points(o,n);this.points=s,this.changePos()}addExisting(){this.points&&this.container.add(this.points)}update(e){this.points&&(this.points.rotation.z+=.01*this.angularVelocity),this.uj&&this.material&&this.uj.injectShadertoyUniforms(this.material.uniforms)}changePos(){if(this.geometry){const o=this.geometry.attributes.position;e.iterateBuffer(o.array,this.count,((e,o)=>{const i=t.MathUtils.randFloat(0,360),a=t.MathUtils.randFloat(10,50),r=a*Math.cos(i),n=a*Math.sin(i),s=t.MathUtils.randFloat(0,2e3);e[o.x]=r,e[o.y]=n,e[o.z]=s}))}}dispose(){this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.points&&this.container.remove(this.points)}}class z extends e.Component{ce;progress;constructor(t,o={}){super(t);const{intensity:i=1}=o,a=new e.CustomEffect(t,{vertexShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;varying vec2 vUv;void main(){vec3 p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);vUv=uv;}",fragmentShader:"#define GLSLIFY 1\nuniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;uniform sampler2D tDiffuse;varying vec2 vUv;uniform float uProgress;uniform float uIntensity;vec2 centerUv(vec2 uv){uv=uv*2.-1.;return uv;}vec2 distort(vec2 p){vec2 cp=centerUv(p);float center=distance(p,vec2(.5));vec2 offset=cp*(1.-center)*uProgress*uIntensity;p-=offset;return p;}void main(){vec2 p=vUv;p=distort(p);vec4 tex=texture(tDiffuse,p);vec4 col=tex;gl_FragColor=col;}",uniforms:{uProgress:{value:0},uIntensity:{value:i}}});this.ce=a,this.progress=0}addExisting(){this.ce.addExisting()}update(){const e=this.progress;this.ce.customPass.material.uniforms.uProgress.value=e}linkScroll(e){const o=Math.abs(e/50);this.progress=t.MathUtils.lerp(this.progress,o,.1)}}export{a as CheckerboardText,c as FragmentWorld,l as GridIcosahedron,v as ImageTunnel,f as LiquidCrystal,d as RGBShiftFilter,g as Sparkles,x as SphereWordCloud,y as StarTunnel,z as SwellFilter};
