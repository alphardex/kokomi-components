uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform vec3 uColors[4];
uniform float uBrightnessThresholds[3];
uniform vec3 uLightPosition;

float diffuse(vec3 n,vec3 l){
    float diff=saturate(dot(n,l));
    return diff;
}

float lighting(){
    vec3 N=vNormal;
    vec3 I=normalize(uLightPosition-vWorldPosition);
    
    float diff=diffuse(N,I);
    return diff;
}

void main(){
    vec3 col=vec3(0.);
    
    float brightness=lighting();
    // col=vec3(brightness);
    
    col=uColors[0];
    if(brightness>uBrightnessThresholds[0]){
        col=uColors[1];
    }else if(brightness>uBrightnessThresholds[1]){
        col=uColors[2];
    }else if(brightness>uBrightnessThresholds[2]){
        col=uColors[3];
    }
    
    gl_FragColor=vec4(col,1.);
}