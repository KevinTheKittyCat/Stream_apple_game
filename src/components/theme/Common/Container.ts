import { defineRecipe } from "@chakra-ui/react";


export const containerRecipe = defineRecipe({
    base: {
        // Base styles for all containers
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
            goldContainer: {
                p: 4,
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