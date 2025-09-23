precision mediump float;
varying vec2 vUvs;
uniform float limit;
uniform sampler2D noise;
uniform vec3 galaxyColor;
uniform float galaxyAlpha;

void main()
{
    float color = texture2D(noise, vUvs).r;
    float mask = smoothstep(limit - 0.1, limit + 0.1, color);
    gl_FragColor = vec4(0.05, 0.03, 0.03, mask * galaxyAlpha);
}