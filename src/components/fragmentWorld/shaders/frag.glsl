uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vNormal;
varying vec4 vMvPosition;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uRandom;
uniform vec2 uMouse;

// transform
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

// lighting
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

float blendSoftLight(float base,float blend){
    return(blend<.5)?(2.*base*blend+base*base*(1.-2.*blend)):(sqrt(base)*(2.*blend-1.)+2.*base*(1.-blend));
}

vec3 blendSoftLight(vec3 base,vec3 blend){
    return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

// distort
vec2 distort(vec2 p){
    vec2 m=uMouse;
    
    p.x-=(uRandom-m.x*.8)*.5;
    p.y-=uRandom*.1-iTime*.1;
    
    p.x-=.25;
    p.y-=.5;
    p=rotate(p,uRandom);
    p*=2.;
    return p;
}

vec3 distortNormal(vec3 p){
    p*=vec3(-1.*uRandom*15.,-1.*uRandom*15.,30.5);
    return p;
}

// lighting
vec4 lighting(vec3 tex,vec3 normal){
    vec4 viewLightPosition=viewMatrix*vec4(uLightPosition,0.);
    vec3 N=normalize(normal);
    vec3 L=normalize(viewLightPosition.xyz);
    
    vec3 dif=tex*uLightColor*diffuse(N,L);
    
    vec3 C=-normalize(vMvPosition.xyz);
    vec3 R=reflect(-L,N);
    
    vec3 spe=uLightColor*specular(R,C,500.);
    
    vec4 lightingColor=vec4(dif+spe,.5);
    
    vec3 softlight=blendSoftLight(tex,spe);
    float dotRC=dot(R,C);
    float theta=acos(dotRC/length(R)*length(C));
    float a=1.-theta*.3;
    
    vec4 col=vec4(tex,a*.01)+vec4(softlight,.02)+(lightingColor*a);
    return col;
}

void main(){
    vec2 p=vUv;
    vec3 N=vNormal;
    
    p=distort(p);
    
    N=distortNormal(N);
    
    vec4 tex=texture(uTexture,p);
    
    vec4 col=tex;
    
    col=lighting(tex.xyz,N);
    
    gl_FragColor=col;
}