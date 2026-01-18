import { Box } from "@mui/material";

interface SectionProps{
    backgroundColor?: string;
    padding?: string;
   children: React.ReactNode;
   sx: React.CSSProperties;
}

export function Section(props: SectionProps){

  return(
    <>
    <Box sx={{
        backgroundColor: props.backgroundColor || 'transparent',
        padding: props.padding || 0,}}>
        {props.children}
    </Box>
    </>
  )
}