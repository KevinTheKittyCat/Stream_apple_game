import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5em 1em",
        bg: "baseBackground",
        borderRadius: "0.375rem",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontSize: "large",
        width: "fit-content",
        height: "fit-content",
        transition: "all 0.2s ease-in-out",
        color: "white",
        backdropFilter: "{blurs.menu}"
    },
    variants: {
        variant: {
            baseButton: {
                _hover: { bg: "whiteAlpha.100" },
            },
            menuButton: {
                _hover: { bg: "whiteAlpha.100" },
                width: "100%",
                fontSize: "md",
                padding: "0.75em 1em",
                minHeight: "5em",
            },
            iconButton: {
                _icon: { width: "6", height: "6" },
                padding: "1.5em",
                paddingInline: "1.5em",
                minW: "fit-content",
                minH: "fit-content",
                _hover: { bg: "whiteAlpha.100" },
            },
        },
    },
    defaultVariants: {
        variant: "baseButton",
    },
})
