




export default function Text({ children, ...props }: any) {
    return (
        <pixiText
            text={children}
            {...props}
        />
    )
}