import { Button, Dialog as DialogSlider } from "@chakra-ui/react";

type DialogProps = React.ComponentProps<typeof DialogSlider.Root> & {
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    content?: React.ReactNode;
    cancelable?: boolean;
};

export default function Dialog({ title, children, actions, content, cancelable, ...props }: DialogProps) {
    return (
        <DialogSlider.Root {...props}>
            <DialogSlider.Trigger asChild>
                {children}
            </DialogSlider.Trigger>
            <DialogSlider.Backdrop />
            <DialogSlider.Positioner>
                <DialogSlider.Content>
                    <DialogSlider.CloseTrigger />
                    <DialogSlider.Header>
                        {title && <DialogSlider.Title>{title}</DialogSlider.Title>}
                    </DialogSlider.Header>
                    <DialogSlider.Body>{content}</DialogSlider.Body>
                    <DialogSlider.Footer>
                        {actions}
                        {cancelable && <DialogSlider.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogSlider.ActionTrigger>
                        }
                    </DialogSlider.Footer>
                </DialogSlider.Content>
            </DialogSlider.Positioner>
        </DialogSlider.Root>
    )
}