import "../App.css";
import { Theme } from "../assets/constants/theme";
import { typography } from "../assets/constants/typography";
import { Box, Typography, Button } from "@mui/material";
import NavBar from "../components/NavBar";
import GroupAvatars from "../components/GroupedAvatars";
import { CgArrowLongRight } from "react-icons/cg";

export function HomePage() {
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
          marginBottom: 12
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
            gap: '10px'
          }}>
            <Typography
            sx={{
              mt: 2,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.heroSubtitle.fontWeight,
              color: Theme.wheat[100],
              opacity: 0.9,
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: typography.heroSubtitle.fontSize,
                backgroundColor: 'rgba(199, 204, 153, 0.27)',
                borderRadius: 10,
                padding: '5px 10px'
              },
            }}
          >
            epic safari adventures 
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.heroSubtitle.fontWeight,
              color: Theme.wheat[100],
              opacity: 0.9,
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: typography.heroSubtitle.fontSize,
                backgroundColor: 'rgba(199, 204, 153, 0.27)',
                borderRadius: 10,
                padding: '5px 10px'
              },
            }}
          >
            unforgettable journeys
          </Typography>
          
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
          }}
        >
          <GroupAvatars />
          <Typography
            sx={{
              mt: 1.5,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.bodyText.fontWeight,
              color: Theme.wheat[200],
              fontSize: '12px',
              lineHeight: 1.6,
            }}
          >
            At Travauni, we craft affordable yet exclusive travel experiences
            designed around you. From curated getaways to fully customized trips,
          </Typography>
        </Box>

        {/* RIGHT CTA */}
        <Button
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            px: "1.8rem",
            py: "0.5rem",
            borderRadius: "999px",
            border: `1px solid ${Theme.wheat[100]}`,
            color: Theme.wheat[100],
            fontFamily: typography.fontFamily.primary,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            alignSelf: { xs: "flex-start", md: "center" },
            "&:hover": {
              backgroundColor: Theme.bronze[100],
             color: Theme["dark-khakhi"][400]
            },
          }}
        >
          Check it out...
          <CgArrowLongRight style={{ backgroundColor: Theme.wheat[100],
            color: Theme.bronze[700],
            padding: '10px',
            borderRadius: '50%',
           }} />
        </Button>
      </Box>
    </Box>
  );
}
