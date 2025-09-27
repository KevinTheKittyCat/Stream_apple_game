precision mediump float;

varying vec2 vUvs;

uniform sampler2D uTexture;
uniform vec2 uBlurDirection;
uniform float uBlurRadius;
uniform vec2 uTextureSize;

// Gaussian blur implementation
vec4 gaussianBlur(sampler2D tex, vec2 uv, vec2 direction, float radius) {
    vec4 color = vec4(0.0);
    vec2 texelSize = 1.0 / uTextureSize;
    
    // Gaussian weights for a more natural blur
    float weights[9];
    weights[0] = 0.227027;
    weights[1] = 0.1945946;
    weights[2] = 0.1216216;
    weights[3] = 0.054054;
    weights[4] = 0.016216;
    weights[5] = 0.016216;
    weights[6] = 0.054054;
    weights[7] = 0.1216216;
    weights[8] = 0.1945946;
    
    color += texture2D(tex, uv) * weights[0];
    
    for (int i = 1; i < 9; i++) {
        vec2 offset = direction * texelSize * float(i) * radius;
        color += texture2D(tex, uv + offset) * weights[i];
        color += texture2D(tex, uv - offset) * weights[i];
    }
    
    return color;
}

// Box blur - faster alternative
vec4 boxBlur(sampler2D tex, vec2 uv, vec2 direction, float radius) {
    vec4 color = vec4(0.0);
    vec2 texelSize = 1.0 / uTextureSize;
    int samples = int(radius * 2.0 + 1.0);
    float weight = 1.0 / float(samples * 2 + 1);
    
    color += texture2D(tex, uv) * weight;
    
    for (int i = 1; i <= int(radius); i++) {
        vec2 offset = direction * texelSize * float(i);
        color += texture2D(tex, uv + offset) * weight;
        color += texture2D(tex, uv - offset) * weight;
    }
    
    return color;
}

void main() {
    vec2 uv = vUvs;
    
    // Use Gaussian blur for better quality
    vec4 blurredColor = gaussianBlur(uTexture, uv, uBlurDirection, uBlurRadius);
    
    gl_FragColor = blurredColor;
}
