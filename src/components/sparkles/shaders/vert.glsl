uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uPixelRatio;
uniform float uPointSize;

attribute float pIndex;

uniform float uSpeed;

float random(float n){
    return fract(sin(n)*43758.5453123);
}

vec3 distort(vec3 p,float seed){
    float t=iTime;
    p.y+=sin(t+p.x*100.)*seed*.2*uSpeed;
    return p;
}

void main(){
    vec3 p=position;
    
    float randVal=random(pIndex);
    
    p=distort(p,randVal);
    
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    
    gl_Position=projectionMatrix*mvPosition;
    
    vUv=uv;
    
    gl_PointSize=uPointSize*uPixelRatio*randVal;
    gl_PointSize*=(1./-mvPosition.z);
}