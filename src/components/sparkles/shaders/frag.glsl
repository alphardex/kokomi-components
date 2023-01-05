uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uOpacity;
uniform vec3 uColor;

float spot(vec2 p,float r,float offset){
    float center=distance(p,vec2(.5));
    float strength=r/center-offset;
    return strength;
}

void main(){
    vec2 p=vUv;
    
    vec3 col=uColor;
    
    float alpha=spot(gl_PointCoord,.05,.1)*uOpacity;
    
    gl_FragColor=vec4(col,alpha);
}