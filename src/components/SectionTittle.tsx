import { Typography } from "@mui/material";

interface SectionTitleProps {
    title: string;
    color: string;
    fontSize: string;
    fontWeight: number;
}

export function SectionTitle(props: SectionTitleProps) {
    return (
        <Typography variant="h2" sx={{ color: props.color, fontSize: props.fontSize, fontWeight: props.fontWeight}}>
            {props.title}
        </Typography>
    );
}