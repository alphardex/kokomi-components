uniform vec2 uMouse1;
uniform vec2 uMouse2;
uniform float uSize;
uniform vec2 uAspect;

uniform samplerCube uCubemap;

#define SHOW_ISOLINE 0

// consts
const float PI=3.14159265359;

const float TWO_PI=6.28318530718;

// utils
float map(float value,float min1,float max1,float min2,float max2){
    return min2+(value-min1)*(max2-min2)/(max1-min1);
}

// sdf ops
float opUnion(float d1,float d2)
{
    return min(d1,d2);
}

vec2 opUnion(vec2 d1,vec2 d2)
{
    return(d1.x<d2.x)?d1:d2;
}

float opSmoothUnion(float d1,float d2,float k)
{
    float h=max(k-abs(d1-d2),0.);
    return min(d1,d2)-h*h*.25/k;
}

// ray
vec2 normalizeScreenCoords(vec2 screenCoord,vec2 resolution,vec2 aspect)
{
    vec2 uv=screenCoord/resolution.xy;
    uv-=vec2(.5);
    uv*=aspect;
    return uv;
}

mat3 setCamera(in vec3 ro,in vec3 ta,float cr)
{
    vec3 cw=normalize(ta-ro);
    vec3 cp=vec3(sin(cr),cos(cr),0.);
    vec3 cu=normalize(cross(cw,cp));
    vec3 cv=(cross(cu,cw));
    return mat3(cu,cv,cw);
}

vec3 getRayDirection(vec2 p,vec3 ro,vec3 ta,float fl){
    mat3 ca=setCamera(ro,ta,0.);
    vec3 rd=ca*normalize(vec3(p,fl));
    return rd;
}

// lighting
// https://learnopengl.com/Lighting/Basic-Lighting

float saturate(float a){
    return clamp(a,0.,1.);
}

float diffuse(vec3 n,vec3 l){
    float diff=saturate(dot(n,l));
    return diff;
}

float specular(vec3 n,vec3 l,float shininess){
    float spec=pow(saturate(dot(n,l)),shininess);
    return spec;
}

float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

// rotate
mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

mat4 rotation3d(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
    
    return mat4(
        oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
        0.,0.,0.,1.
    );
}

vec2 rotate(vec2 v,float angle){
    return rotation2d(angle)*v;
}

vec3 rotate(vec3 v,vec3 axis,float angle){
    return(rotation3d(axis,angle)*vec4(v,1.)).xyz;
}

mat3 rotation3dX(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat3(
        1.,0.,0.,
        0.,c,s,
        0.,-s,c
    );
}

vec3 rotateX(vec3 v,float angle){
    return rotation3dX(angle)*v;
}

mat3 rotation3dY(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat3(
        c,0.,-s,
        0.,1.,0.,
        s,0.,c
    );
}

vec3 rotateY(vec3 v,float angle){
    return rotation3dY(angle)*v;
}

mat3 rotation3dZ(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat3(
        c,s,0.,
        -s,c,0.,
        0.,0.,1.
    );
}

vec3 rotateZ(vec3 v,float angle){
    return rotation3dZ(angle)*v;
}

// gamma
const float gamma=2.2;

float toGamma(float v){
    return pow(v,1./gamma);
}

vec2 toGamma(vec2 v){
    return pow(v,vec2(1./gamma));
}

vec3 toGamma(vec3 v){
    return pow(v,vec3(1./gamma));
}

vec4 toGamma(vec4 v){
    return vec4(toGamma(v.rgb),v.a);
}

// sdf
float sdSphere(vec3 p,float s)
{
    return length(p)-s;
}

// noise
//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
//

vec3 mod289(vec3 x)
{
    return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x)
{
    return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159-.85373472095314*r;
}

vec3 fade(vec3 t){
    return t*t*t*(t*(t*6.-15.)+10.);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
    vec3 Pi0=floor(P);// Integer part for indexing
    vec3 Pi1=Pi0+vec3(1.);// Integer part + 1
    Pi0=mod289(Pi0);
    Pi1=mod289(Pi1);
    vec3 Pf0=fract(P);// Fractional part for interpolation
    vec3 Pf1=Pf0-vec3(1.);// Fractional part - 1.0
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 iz0=Pi0.zzzz;
    vec4 iz1=Pi1.zzzz;
    
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+iz0);
    vec4 ixy1=permute(ixy+iz1);
    
    vec4 gx0=ixy0*(1./7.);
    vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
    gx0=fract(gx0);
    vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.));
    gx0-=sz0*(step(0.,gx0)-.5);
    gy0-=sz0*(step(0.,gy0)-.5);
    
    vec4 gx1=ixy1*(1./7.);
    vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
    gx1=fract(gx1);
    vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.));
    gx1-=sz1*(step(0.,gx1)-.5);
    gy1-=sz1*(step(0.,gy1)-.5);
    
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
    
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000*=norm0.x;
    g010*=norm0.y;
    g100*=norm0.z;
    g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001*=norm1.x;
    g011*=norm1.y;
    g101*=norm1.z;
    g111*=norm1.w;
    
    float n000=dot(g000,Pf0);
    float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
    float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
    float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
    float n111=dot(g111,Pf1);
    
    vec3 fade_xyz=fade(Pf0);
    vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
    vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
    float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
    return 2.2*n_xyz;
}

// blend

float blendScreen(float base,float blend){
    return 1.-((1.-base)*(1.-blend));
}

vec3 blendScreen(vec3 base,vec3 blend){
    return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

// color
vec3 saturation(vec3 rgb,float adjustment){
    const vec3 W=vec3(.2125,.7154,.0721);
    vec3 intensity=vec3(dot(rgb,W));
    return mix(intensity,rgb,adjustment);
}

vec4 RGBShift(sampler2D t,vec2 rUv,vec2 gUv,vec2 bUv){
    vec4 color1=texture(t,rUv);
    vec4 color2=texture(t,gUv);
    vec4 color3=texture(t,bUv);
    vec4 color=vec4(color1.r,color2.g,color3.b,color2.a);
    return color;
}

// transforms

vec3 distort(vec3 p){
    float t=iTime*.5;
    
    float distortStr=1.6;
    vec3 distortP=p+cnoise(vec3(p*PI*distortStr+t));
    float perlinStr=cnoise(vec3(distortP*PI*distortStr*.1));
    
    vec3 dispP=p;
    dispP+=(p*perlinStr*.1);
    
    return dispP;
}

vec2 map(in vec3 pos)
{
    vec2 res=vec2(1e10,0.);
    
    // pos=rotate(pos,vec3(1.,1.,1.),iTime);
    
    pos=distort(pos);
    
    vec2 m1=uMouse1.xy;
    m1*=uAspect;
    vec2 m2=uMouse2.xy;
    m2*=uAspect;
    
    {
        float r=uSize;
        vec3 d1p=pos;
        d1p-=vec3(m1*2.,0.);
        float d1=sdSphere(d1p,r);
        vec3 d2p=pos;
        d2p-=vec3(m2*2.,0.);
        float d2=sdSphere(d2p,r-.05);
        d2=opSmoothUnion(d2,d1,.2);
        res=opUnion(res,vec2(d2,114514.));
    }
    
    return res;
}

vec2 raycast(in vec3 ro,in vec3 rd,in float tMax){
    vec2 res=vec2(0.,-1.);
    float t=0.;
    for(int i=0;i<4;i++)
    {
        vec3 p=ro+t*rd;
        vec2 h=map(p);
        if(h.x<.001||t>(tMax+GLOW))
        {
            break;
        };
        t+=h.x;
        res=vec2(t,h.y);
    }
    return res;
}

vec3 calcNormal(vec3 pos,float eps){
    const vec3 v1=vec3(1.,-1.,-1.);
    const vec3 v2=vec3(-1.,-1.,1.);
    const vec3 v3=vec3(-1.,1.,-1.);
    const vec3 v4=vec3(1.,1.,1.);
    
    return normalize(v1*map(pos+v1*eps).x+
    v2*map(pos+v2*eps).x+
    v3*map(pos+v3*eps).x+
    v4*map(pos+v4*eps).x);
}

vec3 calcNormal(vec3 pos){
    return calcNormal(pos,.002);
}

vec3 drawIsoline(vec3 col,vec3 pos){
    float d=map(pos).x;
    col*=1.-exp(-6.*abs(d));
    col*=.8+.2*cos(150.*d);
    col=mix(col,vec3(1.),1.-smoothstep(0.,.01,abs(d)));
    return col;
}

vec3 material(in vec3 col,in vec3 pos,in float m,in vec3 nor){
    // col=vec3(1.);
    col=vec3(0.);
    
    if(m==114514.){
        if(SHOW_ISOLINE==1){
            col=drawIsoline(col,vec3(pos.x*1.,pos.y*0.,pos.z*1.));
        }
    }
    
    return col;
}

vec3 lighting(in vec3 col,in vec3 pos,in vec3 rd,in vec3 nor,in float t,in vec2 screenUv){
    vec3 lin=col;
    
    // diffuse
    // vec3 lig=normalize(vec3(1.,2.,3.));
    // float dif=dot(nor,lig)*.5+.5;
    // lin=col*dif;
    
    vec3 m=vec3(uMouse1*iResolution.xy,0.);
    vec3 viewDir=normalize(vec3(0.)-vec3(m.x/(iResolution.x*.25),m.y/(iResolution.y*.25),-2.));
    vec3 I=normalize(nor.xyz-viewDir);
    float distanceMouse=distance(uMouse1,vec2(0.))*.1;
    
    // fresnel
    float fOffset=-1.4*(1.-distanceMouse*2.);
    float f=fOffset+fresnel(0.,1.,1.,I,nor)*1.44;
    float f2=fOffset+fresnel(1.,1.,1.,rd,nor)*1.44;
    vec3 fCol=vec3(saturate(pow(f-.8,3.)));
    lin=blendScreen(lin,fCol);
    
    // cube
    vec3 cubeTex=texture(uCubemap,vec3(screenUv,0.)).rgb;
    vec3 cubeTexSat=saturation(cubeTex,6.);
    vec3 cubeTexF=blendScreen(mix(vec3(0.),cubeTexSat,fCol),fCol);
    lin=blendScreen(lin,cubeTexF);
    
    // iridescence
    vec3 iri=vec3(0.);
    float iriSrength=10.;
    iri.r=smoothstep(cubeTexF.r*iriSrength,0.,.5);
    iri.g=smoothstep(cubeTexF.g*iriSrength,0.,.5);
    iri.b=smoothstep(cubeTexF.b*iriSrength,0.,.5);
    lin=blendScreen(lin,iri);
    
    vec3 iri2=vec3(0.);
    iri2.r=smoothstep(0.,.25,cubeTexF.r);
    iri2.g=smoothstep(0.,.25,cubeTexF.r);
    iri2.b=smoothstep(0.,.25,cubeTexF.r);
    lin=blendScreen(lin,iri2);
    
    // middle fresnel
    vec3 mf=vec3(0.);
    float fFactor=pow(f+f2,1.24);
    float invertFFactor=-fFactor+3.;
    mf=vec3(invertFFactor);
    mf*=.1;
    lin=blendScreen(lin,mf);
    
    return lin;
}

vec4 render(in vec3 ro,in vec3 rd,in vec2 screenUv){
    vec4 col=vec4(0.);
    
    float tMax=2.15;
    vec2 res=raycast(ro,rd,tMax);
    float t=res.x;
    float m=res.y;
    
    if(t<tMax){
        vec3 pos=ro+t*rd;
        
        vec3 nor=calcNormal(pos);
        
        vec3 result=vec3(0.);
        result=material(result,pos,m,nor);
        result=lighting(result,pos,rd,nor,t,screenUv);
        
        col=vec4(result,1.);
    }
    
    if(t>tMax&&t<(tMax+GLOW)){
        vec3 glowColor=vec3(1.);
        float glowAlpha=map(t,tMax,tMax+GLOW,1.,0.);
        col=vec4(glowColor,glowAlpha);
    }
    
    return col;
}

vec4 getSceneColor(vec2 fragCoord){
    vec2 p=normalizeScreenCoords(fragCoord,iResolution.xy,uAspect);
    
    vec3 ro=vec3(0.,0.,2.);
    vec3 rd=normalize(vec3(p,-1.));
    
    vec2 screenUv=fragCoord.xy/iResolution.xy;
    
    // render
    vec4 col=render(ro,rd,screenUv);
    
    // gamma
    // col=toGamma(col);
    
    return col;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec4 tot=vec4(0.);
    
    float AA_size=1.;
    float count=0.;
    for(float aaY=0.;aaY<AA_size;aaY++)
    {
        for(float aaX=0.;aaX<AA_size;aaX++)
        {
            tot+=getSceneColor(fragCoord+vec2(aaX,aaY)/AA_size);
            count+=1.;
        }
    }
    tot/=count;
    
    fragColor=tot;
}