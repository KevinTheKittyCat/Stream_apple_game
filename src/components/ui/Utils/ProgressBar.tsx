import { Progress } from "@chakra-ui/react"

export function ProgressBar({ value }: { value: number }) {
    return (
        <Progress.Root size={"md"} value={value} w={"100%"} >
            <Progress.Track>
                <Progress.Range/>
            </Progress.Track>
        </Progress.Root>
    )
}