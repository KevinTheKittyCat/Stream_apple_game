import { defaultConfig, defineConfig, createSystem } from "@chakra-ui/react";
import { containerRecipe } from "./Common/container.recipe";
import { buttonRecipe } from "./Common/button.recipe";



const config = defineConfig({
    theme: {
        breakpoints: {
            sm: "320px",
            md: "768px",
            lg: "960px",
            xl: "1200px",
            "2xl": "1536px",
        },
        tokens: {
            colors: {
                red: { value: "#EE0F0F" },
                baseBackground: { value: "rgba(255, 255, 255, 0.1)" },

                // Galaxy Colors
                galaxyBlue: { value: "#070B34" },
                galaxyPurple: { value: "#855988" },
                galaxyPink: { value: "#FF69B4" },
            },
            blurs: {
                sm: { value: "blur(10px)" },
                md: { value: "blur(20px)" },
                lg: { value: "blur(40px)" },
            },
        },
        semanticTokens: {
            colors: {
                danger: { value: "{colors.red}" },
            },
            blurs: {
                menu: { value: "{blurs.md}" },
            },
        },
        keyframes: {
            spin: {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
            },
            starMovement: {
                "0%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(5px)" },
                "100%": { transform: "translateY(0px)" },
            },
            starPulse: {
                "0%": { "--opacity": 0.8 },
                "50%": { "--opacity": 0 },
                "100%": { "--opacity": 0.8 },
            },
            becomeVisible: {
                to: { opacity: 1 },
            },
            twinkle: {
                "0%": { scale: 1 },
                "33%": { scale: 0.8 },
                "66%": { scale: 2.2 },
                "100%": { scale: 1 },
            },
            moveMask: {
                "0%": { maskPosition: "0% 0%" },
                "25%": { maskPosition: "0% 100%" },
                "50%": { maskPosition: "100% 100%" },
                "75%": { maskPosition: "100% 0%" },
                "100%": { maskPosition: "0% 0%" },
            },
        },
        recipes: {
            button: buttonRecipe,
            container: containerRecipe,
        },
    },
})

export const system = createSystem(defaultConfig, config)