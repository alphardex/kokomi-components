uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vNormal;
varying vec4 vMvPosition;
varying vec3 vPosition;

uniform vec2 uMouse;
uniform float uRandom;
uniform float uLayerId;

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

vec3 distort(vec3 p){
    vec3 tx1=vec3(-uMouse.x*uRandom*.05,-uMouse.y*uRandom*.02,0.);
    p+=tx1;
    
    float angle=iTime*uRandom;
    p=rotate(p,vec3(0.,1.,0.),angle);
    
    vec3 tx2=vec3(-uMouse.x*uRandom*.5,-uMouse.y*uRandom*.2,0.);
    p+=tx2;
    
    p*=(.6-uLayerId*.5);
    
    return p;
}

void main(){
    vec3 p=position;
    vec3 N=normal;
    
    p=distort(p);
    N=distort(N);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
    
    vNormal=N;
    vMvPosition=modelViewMatrix*vec4(p,1.);
    vPosition=p;
}