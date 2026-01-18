import '../App.css';
import { Theme } from '../assets/constants/theme';
import { typography } from '../assets/constants/typography';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTittle';
import { Box , Typography, useMediaQuery, useTheme as useMuiTheme} from '@mui/material';
import {DestinationCards} from '../components/DestinationCards';

export function ToursSection(){

  const muiTheme = useMuiTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    return(
        <>
       <Section backgroundColor={Theme.wheat[100]} padding="60px 50px" sx={{
        height: '100vh'
       }}>

 <SectionTitle
        title='Best Destinations'
      color={Theme['olive-wood'][300]}
      fontSize={typography.heroSubtitle.fontSize}
      fontWeight={typography.inputText.fontWeight}
        />

      <Box sx={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: isMobile ? 'flex-start' : isSmallScreen ? 'center' : 'flex-start',
  gap: isMobile ? 2 : isSmallScreen ? 3 : 4,
  flexWrap: 'wrap',
}}>

  {/* Title - Takes more space on larger screens */}
  <Box sx={{
    flex: isMobile ? '0 0 100%' : isSmallScreen ? '0 0 100%' : '0 0 40%',
    maxWidth: isMobile ? '100%' : isSmallScreen ? '100%' : '40%',
  }}>
    <SectionTitle
      title='TravaUni tours'
      color={Theme.bronze[500]}
      fontSize={
        isMobile ? typography.sectionTitle.fontSize : 
        isSmallScreen ? typography.inputText.fontSize : 
        typography.heroTitle.fontSize
      }
      fontWeight={typography.heroSubtitle.fontWeight}
      
    />
  </Box>

  {/* Description - Takes remaining space */}
  <Box sx={{
    flex: isMobile ? '0 0 100%' : isSmallScreen ? '0 0 100%' : '0 0 55%',
    maxWidth: isMobile ? '100%' : isSmallScreen ? '100%' : '55%',
    display: 'flex',
    alignItems: 'center',
  }}>
    <Typography
      sx={{
        color: Theme['olive-wood'][300],
        fontSize: 
          isMobile ? typography.inputText.fontSize : 
          isSmallScreen ? typography.inputText.fontSize : 
          typography.heroSubtitle.fontSize,
        fontWeight: typography.inputText.fontWeight,
        textAlign: isMobile ? 'left' : 'left',
        width: '80%',
        lineHeight: 1.6,
      }}
    >
      Explore our curated tours to breathtaking destinations. From serene beaches to vibrant cities, find your perfect getaway with TravaUni Safari Tours.
    </Typography>
  </Box>
</Box>

<DestinationCards/>

 
       </Section>

       

        </>
    )
}