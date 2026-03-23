import { Theme } from "../../assets/constants/Theme";
import { typography } from "../../assets/constants/typography";
import { SectionTitle } from "../../components/SectionTittle";
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';


export  default function BookYourTicket(){

const muiTheme = useMuiTheme();
  //const isMediumScreen = useMediaQuery(muiTheme.breakpoints.between('md', 'lg'));
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    return(
        <>
        <SectionTitle
                title='Book Your Ticket'
                color={Theme.bronze[500]}
                fontSize={isMobile ? typography.sectionTitle.fontSize : isSmallScreen ? typography.inputText.fontSize : typography.heroTitle.fontSize}
                fontWeight={typography.heroSubtitle.fontWeight}
              />
        
        </>
    )
}