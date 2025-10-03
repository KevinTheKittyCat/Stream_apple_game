import { defineRecipe } from "@chakra-ui/react"

const baseContainerOverwriteStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "start",
  width: "fit-content",
  height: "fit-content",
  margin: 0,
  gap: 1,
  p: 2,
  paddingInline: 2,
  backdropFilter: "{blurs.menu}"
}

export const containerRecipe = defineRecipe({
  base: {
    display: "flex",
  },
  variants: {
    variant: {
      gold: {
        ...baseContainerOverwriteStyles,
        bg: "baseBackground",
        border: "1px solid rgba(255, 187, 29, 0.2)",
        borderRadius: "md",
      },
      normal: {
        ...baseContainerOverwriteStyles,
        bg: "baseBackground",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "md",
      },
    },
  },
})
