import '../App.css'
import { Section } from '../components/Section'
import { SectionTitle } from '../components/SectionTittle'
import { Box,Typography ,useTheme, useMediaQuery } from '@mui/material'
import { Theme } from '../assets/constants/colors'
import { typography } from '../assets/constants/typography'
import { GlassyButton } from '../components/GlassyButton'
import { useNavigate } from 'react-router-dom'
import BounceCards from '@/components/BounceCards'


export function GallerySection(){

    const images = [
  './public/pictures/pic1.jpeg',
  "./public/pictures/pic45.jpeg",
  "./public/pictures/pic89.jpeg",
  "./public/pictures/pic3.jpeg",
  "./public/pictures/pic4.jpeg"
];

const transformStyles = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)"
];

    const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down('md'));
     const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
     const navigate = useNavigate();

      const handleViewMore = () =>{
           navigate('/viewgallery',{
            replace: true
           }) 
        }

    return(
        <div id='gallery'>
        <Section backgroundColor={Theme.wheat[100]} padding="60px 50px" sx={{
                height: '100vh' }}>
       
       <Box sx={{
        alignItems: 'center',
        textAlign: 'center'
       }}>
      <SectionTitle
              title='Our Gallery'
            color={Theme['olive-wood'][300]}
            fontSize={typography.heroSubtitle.fontSize}
            fontWeight={typography.inputText.fontWeight}
              />

              <SectionTitle
                    title='Our Travel Memories'
                    color={Theme.bronze[500]}
                    fontSize={
                      isMobile ? typography.sectionTitle.fontSize : 
                      isSmallScreen ? typography.inputText.fontSize : 
                      typography.heroTitle.fontSize
                    }
                    fontWeight={typography.heroSubtitle.fontWeight}
                    
                  />

       </Box>

       <Box  sx={{
        background: 'rgba(223, 172, 121, 0.28)',
        padding:'15px 15px',
        margin: isMobile? '10px 10px':'50px 50px',
        borderRadius: '20px',
        display:'flex',
        justifyContent: 'space-between',
        flexDirection:isMobile? 'column': 'row',
       marginTop: isMobile?'40px':'100px'
       }}>
        <BounceCards
  className="custom-bounceCards"
  images={images}
  containerWidth={isMobile? 300:500}
  containerHeight={isMobile? 150:250}
  animationDelay={1}
  animationStagger={0.08}
  easeType="elastic.out(1, 0.5)"
  transformStyles={transformStyles}
  enableHover={false}
/>

<Box sx={{
    justifyContent: 'center',
    display: 'block',
    width: isMobile?'260px':'400px',
    color: Theme.bronze[600],
    mb: 2
}}>
    <Typography sx={{
        textAlign: 'center'
    }}>
       <span style={{fontWeight: typography.heroTitle.fontWeight}}> Adventure, Captured</span>. Browse through a curated collection of our most unforgettable journeys. 
        From wildlife encounters to cultural immersions, each photo is a window into the experiences that define us.
         Your inspiration for exploration starts here."
    </Typography>

   <Box sx={{
    ml: isMobile?'50px':'80px',
    mt: 5
   }}>
     <GlassyButton 
         title="View"
         highlight=" More"
         onClick={() => handleViewMore()}
         height='20px'
         width='200px'
         background={Theme.bronze[700]}/>
   </Box>
</Box>
       </Box>

      
        
        

        </Section>
        
        </div>
    )
}










