precision mediump float;

varying vec2 vUvs;

uniform sampler2D uTexture;
uniform sampler2D uBackdropTexture;
uniform vec4 uOverlayColor;
uniform float uOpacity;
uniform float uMixRatio;

void main() {
    vec2 uv = vUvs;
    
    // Sample the original content
    vec4 contentColor = texture2D(uTexture, uv);
    
    // Sample the blurred backdrop
    vec4 backdropColor = texture2D(uBackdropTexture, uv);
    
    // Mix the backdrop with overlay color
    vec4 mixedBackdrop = mix(backdropColor, uOverlayColor, uOverlayColor.a);
    
    // Combine content with backdrop using alpha blending
    vec4 finalColor = mix(mixedBackdrop, contentColor, contentColor.a);
    
    // Apply overall opacity
    finalColor.a *= uOpacity;
    
    gl_FragColor = finalColor;
}
