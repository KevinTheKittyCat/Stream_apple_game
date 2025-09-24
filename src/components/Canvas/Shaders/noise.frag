precision mediump float;
varying vec2 vUvs;
uniform float limit;
uniform sampler2D noise;
uniform vec3 customColor;
uniform float alpha;

void main() {
    float color = texture2D(noise, vUvs).r;
    color = step(limit, color);
    gl_FragColor = vec4(customColor, color * alpha);
}