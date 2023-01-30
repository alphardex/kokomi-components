#define iTime time
#define iResolution resolution
#define iChannel0 inputBuffer

uniform float uProgress;
uniform vec3 uGlowColor;
uniform float uGlowColorStrength;

#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x){
    return x-floor(x*(1./289.))*289.;
}

vec2 mod289(vec2 x){
    return x-floor(x*(1./289.))*289.;
}

vec3 permute(vec3 x){
    return mod289(((x*34.)+1.)*x);
}

float snoise(vec2 v)
{
    const vec4 C=vec4(.211324865405187,// (3.0-sqrt(3.0))/6.0
    .366025403784439,// 0.5*(sqrt(3.0)-1.0)
    -.577350269189626,// -1.0 + 2.0 * C.x
.024390243902439);// 1.0 / 41.0
// First corner
vec2 i=floor(v+dot(v,C.yy));
vec2 x0=v-i+dot(i,C.xx);

// Other corners
vec2 i1;
//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
//i1.y = 1.0 - i1.x;
i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
// x0 = x0 - 0.0 + 0.0 * C.xx ;
// x1 = x0 - i1 + 1.0 * C.xx ;
// x2 = x0 - 1.0 + 2.0 * C.xx ;
vec4 x12=x0.xyxy+C.xxzz;
x12.xy-=i1;

// Permutations
i=mod289(i);// Avoid truncation effects in permutation
vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))
+i.x+vec3(0.,i1.x,1.));

vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
m=m*m;
m=m*m;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

vec3 x=2.*fract(p*C.www)-1.;
vec3 h=abs(x)-.5;
vec3 ox=floor(x+.5);
vec3 a0=x-ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);

// Compute final noise value at P
vec3 g;
g.x=a0.x*x0.x+h.x*x0.y;
g.yz=a0.yz*x12.xz+h.yz*x12.yw;
return 130.*dot(m,g);
}

// https://www.shadertoy.com/view/XdS3RW
vec3 luminosity(vec3 s,vec3 d)
{
float dLum=dot(d,vec3(.3,.59,.11));
float sLum=dot(s,vec3(.3,.59,.11));
float lum=sLum-dLum;
vec3 c=d+lum;
float minC=min(min(c.x,c.y),c.z);
float maxC=max(max(c.x,c.y),c.z);
if(minC<0.)return sLum+((c-sLum)*sLum)/(sLum-minC);
else if(maxC>1.)return sLum+((c-sLum)*(1.-sLum))/(maxC-sLum);
else return c;
}

void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor)
{
vec4 diffuseBase=texture(iChannel0,uv);

vec2 p=uv;

float interval=4.;
float dir=mod((p.y-iTime*.04)*iResolution.y,interval)<(interval*.5)?-1.:1.;

float n1=snoise(vec2(iTime*5.,10.));
float lineOffset=(4.+8.*n1)/iResolution.x;
p.x+=dir*lineOffset;

vec4 hologramColor=texture(iChannel0,p);

float n2=snoise(vec2(iTime*2.,1.));
float strength=.1+.3*(1.+n2);
vec3 combinedColor=diffuseBase.rgb+hologramColor.rgb*strength;

vec3 bgColor=uGlowColor*uGlowColorStrength;
vec3 lumiColor=luminosity(combinedColor,bgColor);

vec3 col=mix(diffuseBase.rgb,lumiColor,uProgress);

outputColor=vec4(col,1.);
}