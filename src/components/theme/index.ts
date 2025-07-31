import { defaultConfig, defineConfig, createSystem } from "@chakra-ui/react";
import { buttonRecipe } from "./Common/Button";


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
            },
        },
        semanticTokens: {
            colors: {
                danger: { value: "{colors.red}" },
            },
        },
        keyframes: {
            spin: {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
            },
        },
        recipes: {
            button: buttonRecipe,
            
        },
    },
})

export const system = createSystem(defaultConfig, config)