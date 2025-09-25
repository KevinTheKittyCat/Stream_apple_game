precision mediump float;
varying vec2 vUvs;
uniform float limit;
uniform sampler2D noise;
uniform vec3 customColor;
uniform float alpha;

void main() {
    float color = texture2D(noise, vUvs).r;
    float mask = step(limit, color); // For non-black areas (bright areas in noise)
    
    // Discard fragments where mask is 0 (black areas in noise)
    if (mask < 0.5) {
        discard;
    }
    
    // Use customColor with proper alpha blending
    gl_FragColor = vec4(customColor * alpha, alpha);
}