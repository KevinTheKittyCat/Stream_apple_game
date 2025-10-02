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
            container: containerRecipe,
        },
    },
})

export const system = createSystem(defaultConfig, config)