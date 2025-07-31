import { Flex, Button, Image, type ButtonProps, useBreakpoint, type FlexProps } from "@chakra-ui/react"
import { useRouter } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"

import Logo from "../../assets/Logo.png"
import { useState } from "react"
import { useBreakpointValue } from "@chakra-ui/react"



export const Header = (props: FlexProps) => {
    return (
        <Flex padding={4} paddingInline={"20%"} justifyContent="space-between" alignItems="center" direction={{ base: "column", md: "row" }} {...props}>
            <HeaderLeft />
            <HeaderRight />
        </Flex>
    )
}

const HeaderLeft = () => {
    const router = useRouter()
    const goToPage = (path: string) => { router.navigate({ to: path }) }

    return (
        <Flex alignItems="center" gap={4} direction={{ base: "column", md: "row" }}>
            <Image src={Logo} alt="logo" onClick={() => goToPage('/')} cursor="pointer" />
            <Button visual={"headerButton"} onClick={() => goToPage('/')}>Home</Button>
            <Button visual={"headerButton"} onClick={() => goToPage('/community')}>Community</Button>
            <Button visual={"headerButton"} onClick={() => goToPage('/merch')}>Merch</Button>
        </Flex>
    )
}

const HeaderRight = () => {
    const router = useRouter()
    const goToPage = (path: string) => {
        router.navigate({ to: path })
    }

    return (
        <Flex alignItems="center" gap={4} direction={{ base: "column", md: "row" }}>
            <Button visual={"headerButton"} onClick={() => goToPage('/contact')}>Contact</Button>
        </Flex>
    )
}

export const HeaderButton = ({ children, ...props }: ButtonProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const isMobile = useBreakpointValue({
        base: true,
        md: false
    })

    if (!isMobile) return <Header />
    return (
        <>
            <Button m={2} p={5} bg={"whiteAlpha.200"} w={"fit-content"} h={"fit-content"} color={"white"} position={"fixed"} top={0} left={0} onClick={() => setOpen(!open)} {...props}>{children}</Button>
            <AnimatePresence mode="wait">
                {open && <motion.div
                    initial={{ opacity: 1, x: "-100%" }}
                    animate={{ opacity: 1, x: "0%" }}
                    exit={{ opacity: 1, x: "-100%" }}
                    transition={{ duration: 0.3 }}
                >
                    <Header />
                </motion.div>
                }
            </AnimatePresence>
        </>
    )
}