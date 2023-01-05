uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

varying vec2 vUv;

uniform float uProgress;
uniform float uIntensity;

vec2 centerUv(vec2 uv){
    uv=uv*2.-1.;
    return uv;
}

vec2 distort(vec2 p){
    vec2 cp=centerUv(p);
    float center=distance(p,vec2(.5));
    vec2 offset=cp*(1.-center)*uProgress*uIntensity;
    p-=offset;
    return p;
}

void main(){
    vec2 p=vUv;
    
    p=distort(p);
    
    vec4 tex=texture(tDiffuse,p);
    
    vec4 col=tex;
    
    gl_FragColor=col;
}