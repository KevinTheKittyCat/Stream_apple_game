precision mediump float;
varying vec2 vUvs;
uniform float limit;
uniform sampler2D noise;
uniform vec3 customColor;
uniform float alpha;

void main() {
    float color = texture2D(noise, vUvs).r;
    float mask = smoothstep(limit - 0.1, limit + 0.1, color);
    
    // Discard fragments where mask is 0 (non-black areas)
    if (mask < 0.5) {
        discard;
    }
    // Only output color where mask is 1.0 (black areas)
    gl_FragColor = vec4(customColor, alpha * mask);
}
