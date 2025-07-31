import { defineRecipe } from "@chakra-ui/react";


export const buttonRecipe = defineRecipe({
    base: {
        // Base styles for all buttons
    },
    variants: {
        visual: {
            headerButton: {
                bg: "transparent",
                color: "white",
                _hover: { backdropBlur: "10px", bg: "whiteAlpha.200" },
                _active: { backdropBlur: "10px" },
                h: 14,
                px: 8,
                fontSize: "lg",
            },
        },
        size: {
            xxl: {
                h: 14,
                px: 8,
                fontSize: "xl",
            },
        },
    },

});