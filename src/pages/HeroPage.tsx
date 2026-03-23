import { useState } from "react";
import "../App.css";
import { Theme } from "../assets/constants/colors";
import { typography } from "../assets/constants/typography";
import { Box, Typography, Button,useTheme,useMediaQuery, } from "@mui/material";
import NavBar from "../components/NavBar";
import GroupAvatars from "../components/GroupedAvatars";
import { CgArrowLongRight } from "react-icons/cg";
import { GlassyButton } from "../components/GlassyButton";
import ImageGallery from "../components/HerominiGallery";
import ContactModal from "@/components/ContactModal";




export function HeroPage() {

const dissolveBackgroundStyle = {
  background: 'radial-gradient(circle at right, rgba(0, 0, 0, 0.6) 0%, transparent 70%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}

const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const whatsappUrl = 'https://wa.me/0780264423'

  return (
    
    <Box
      className="homepagecontainer"
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* NAVBAR */}
      <NavBar
        logoText="TravaUni"
        tabBackground="rgba(247, 235, 212, 0.16)"
        tabBorderRadius={30}
        textColor="rgb(247 235 212)"
        hoverColor="#ffffff"
      />

      {/* HERO CENTER CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          mb: isMobile? 30: 10,
        }}
      >
        <Box className="heroTittle">
          <Typography
            sx={{
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.heroTitle.fontWeight,
              color: Theme.wheat[100],
              lineHeight: 1.2,
              fontSize: {
                xs: "2rem",
                sm: "2.8rem",
                md: typography.heroTitle.fontSize,
                lg: typography.heroTitle.fontSize,
              },
            }}
          >
            Extraordinary{" "} <br />
            <span className="herosecondaryFont">cultural </span>and{" "}
            <span className="herosecondaryFont">natural</span> <br />charm.
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: '10px',
            marginTop: 2
          }}>
            

          <GlassyButton 
  title="Contact"
  highlight="Us"
  onClick={() => setIsContactModalOpen(true)}
  height= {isMobile? '10px': '20px'}
  width={isMobile? '180px': '200px'}
  sx={{
      
    position: 'relative',
    zIndex: 1000,
    pointerEvents: 'auto',
  }}
/>

{/* <Button
        endIcon={<CgArrowLongRight size={20} />}
        onClick={() => setIsContactModalOpen(true)}
          sx={{
            backgroundColor: Theme["dark-khakhi"][800],
            px: isMobile? '1rem':"1.8rem",
            width: isMobile? '180px': '200px',
            py: isMobile?'0.8rem':"0.8rem",
            borderRadius: "999px",
            border: `1px solid ${Theme.wheat[100]}`,
            color: Theme.wheat[100],
            fontFamily: typography.fontFamily.primary,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            
    position: 'relative',
    zIndex: 1000,
    pointerEvents: 'auto',
            alignSelf: { xs: "flex-start", md: "center" },
            "&:hover": {
              backgroundColor: Theme.bronze[500],
             color: Theme.bronze[100]
            },
          }}
        >
         Contact <span style={{color: Theme.bronze[400]}}>Us</span>
         
        </Button>  */}


 
     <Button
        endIcon={<CgArrowLongRight size={20} />}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            px: isMobile? '1rem':"1.8rem",
            width: isMobile? '180px': '200px',
            py: isMobile?'0.8rem':"0.8rem",
            borderRadius: "999px",
            border: `1px solid ${Theme.wheat[100]}`,
            color: Theme.wheat[100],
            fontFamily: typography.fontFamily.primary,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
              
    position: 'relative',
    zIndex: 1000,
    pointerEvents: 'auto',
            alignSelf: { xs: "flex-start", md: "center" },
            "&:hover": {
              backgroundColor: Theme.bronze[500],
             color: Theme.bronze[100]
            },
          }}
        >
          Check it out...
         
        </Button>     
         



          
          </Box>
        </Box>
      </Box>

      {/* BOTTOM HERO FOOTER */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "16px", md: "32px" },
          left: 0,
          right: 0,
          px: { xs: 2, md: 4 },

          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        {/* LEFT CONTENT */}
        <Box
          sx={{
            width: { xs: "100%", md: "26rem" },
            textAlign: "left",
            height: isMobile? '0':'5px'
          }}
        >
          <Box
          sx={{
            marginLeft: 5
          }}
          >
            <Typography
            component={'span'}
          sx={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.sectionTitle.fontSize,
            fontWeight: typography.sectionLabel.fontWeight,
            color: Theme.wheat[100],
          }}
          >
            15{''}
            <Typography
            component={'span'}
            sx={{
              fontFamily: typography.fontFamily.primary,
            fontSize: typography.statNumber.fontSize,
            fontWeight: typography.inputText.fontWeight
            }}
            >
             +
            </Typography>
          </Typography>
          </Box>
          <GroupAvatars />
          <Typography
            sx={{
              mt: 1.5,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.bodyText.fontWeight,
              color: Theme.wheat[200],
              fontSize: '12px',
              lineHeight: 1.6,
              borderRadius: 2,
               ...dissolveBackgroundStyle
            }}
          >
            At Travauni, we craft affordable yet exclusive travel experiences
            designed around you. From curated getaways to fully customized trips,
          </Typography>
        </Box>

     <Box>
       <ImageGallery/>   
      </Box>    

       
        
      </Box>
      <ContactModal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        whatsappUrl={whatsappUrl}
      />
    </Box>
    
  );
}
