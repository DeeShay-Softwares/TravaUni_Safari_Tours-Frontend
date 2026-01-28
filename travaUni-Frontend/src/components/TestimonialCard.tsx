import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
  Button,
  Fade,
} from "@mui/material";
import { IoArrowForwardCircle, IoArrowBackCircle } from "react-icons/io5";
import {  FaPhoneAlt } from "react-icons/fa";
import { Theme } from "../assets/constants/colors";

interface Testimonial {
  name: string;
  title: string;
  image: string;
  feedback: string;
  contact?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Rumbidzai V Nyagura",
    title: "UniTours Client",
    contact: "+263 71 031 8339",
    image: "./public/pictures/Rumbidzai.jpeg",
    feedback: `"I've attended all the UniTours trips — Kafue (Hippo View), Siavonga, Mainess Game Ranch, and Twaala Village Farm in Rufunsa — and I can confidently say every single trip was worth it. Each destination offered a different experience, but what stayed consistent was the great organization, good accommodation, reliable transport, and amazing vibes. The team always made sure everything ran smoothly, allowing us to fully enjoy the trips without stress. From game drives and nature views to relaxing moments by the water and bonding with students from different universities, every trip came with unforgettable memories. UniTours doesn't just organize trips; they create experiences. I'll definitely continue traveling with UniTours and highly recommend them to any student looking for safe, fun, and well-planned trips."`,
  },
   {
    name: "Dexter and Malvin",
    title: "UniTours Clients",
    contact: "+260 570 969 506 & +263 78 697 6628",
    image: "./public/pictures/Dexter&Malvin.jpeg",
    feedback: `"We attended the last UniTours trip to Rufunsa (Twaala Village Farm) together, and honestly, it was an amazing experience. The bonfire night was our favorite part — great vibes, good music, fun games, and lots of laughter. Everything was well organized, and the environment made it easy to relax, bond, and just enjoy the moment. The games brought everyone together, and by the end of the night, it felt like one big family. As two close friends, this trip gave us memories we'll always talk about. UniTours really knows how to create fun and unforgettable experiences, and we're definitely looking forward to the next trip."`,
  },
  {
    name: "Nokutenda R Mupaya",
    title: "UniTours Client",
    contact: "+263 773 557 629",
    image: "./public/pictures/nokutenda.jpeg",
    feedback: `"When I first heard about UniTours, they were about to go to Siavonga, but unfortunately I missed the trip due to some personal reasons. I promised myself that I wouldn't miss the next ones. I later joined the trips to Mainess Game Ranch and Twaala Village Farm in Rufunsa, and I'm so glad I did. Everything was well organized, the experience was fun, and the vibes were amazing. I met great people and truly enjoyed every moment. Missing Siavonga turned out to be a lesson — UniTours trips are not to be missed. I'll definitely be attending the next ones."`,
  },
  {
    name: "Loice V Foya",
    title: "UniTours Client",
    contact: "+263 777 026 865",
    image: "./public/pictures/Loice.jpeg",
    feedback: `"I had been hearing so many good things about UniTours trips from friends and on social media. At first, I wasn't sure if it was really worth it, but after seeing how people kept talking about the experience, I decided to attend the last trip of the year. Honestly, it turned out to be one of the best decisions I made. Everything was well organized — from transport, accommodation, and meals to the activities planned. The team was friendly, professional, and always made sure everyone was comfortable and safe. The trip to Rufunsa (Twaala Village Farm) was absolutely amazing. The environment was peaceful, beautiful, and perfect for relaxing and bonding. I met amazing people from different universities, explored new places, and created unforgettable memories. As a student from the University of Lusaka, this trip gave me a great break from school stress and allowed me to enjoy nature and adventure at the same time. It didn't feel like just a trip; it felt like a family experience. If you're still doubting like I was, don't think twice. UniTours really delivers what they promise. I'll definitely be attending more trips and recommending them to other students."`,
  },
];

const MAX_LINES = 5; // Show only 5 lines initially
const LINE_HEIGHT = 1.8; // Increased line height
const FEEDBACK_FONT_WEIGHT = 400; // Can be 400, 500, 600, etc.

const TestimonialCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setExpanded(false); // Collapse when changing testimonials
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
    setExpanded(false); // Collapse when changing testimonials
  };

  const currentTestimonial = testimonials[currentIndex];

  // Function to count lines in the feedback text
  const getFeedbackLines = (text: string): number => {
    // This is a simplified calculation - in production you might want to use
    // a more accurate method with refs and getComputedStyle
    const words = text.split(" ");
    const avgWordsPerLine = isMobile ? 8 : 15;
    return Math.ceil(words.length / avgWordsPerLine);
  };

  const shouldShowReadMore = getFeedbackLines(currentTestimonial.feedback) > MAX_LINES;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, md: 0 },
        mb: 4,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          gap: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: Theme.wheat[100],
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 400, sm: 300, md: 280 },
        }}
      >
        {/* Opening Quote */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "5rem", sm: "6rem", md: "7rem" },
            lineHeight: 1,
            color: Theme.bronze[200],
            position: "absolute",
            top: { xs: -20, sm: -30, md: -60 },
            left: { xs: 10, sm: -20, md: -35 },
            opacity: 0.8,
            userSelect: "none",
          }}
        >
          "
        </Typography>

        {/* Left Section - Avatar & Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: { xs: "100%", sm: 120 },
            order: { xs: 2, sm: 1 },
          }}
        >
          <Avatar
            src={currentTestimonial.image}
            alt={currentTestimonial.name}
            sx={{
              width: { xs: 90, sm: 100, md: 110 },
              height: { xs: 90, sm: 100, md: 110 },
              mb: 2,
              border: `3px solid ${Theme.bronze[300]}`,
              boxShadow: 2,
            }}
          />
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color={Theme["dark-khakhi"][700]}
            textAlign="center"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
          >
            {currentTestimonial.name}
          </Typography>
          <Typography
            variant="body2"
            color={Theme.bronze[500]}
            textAlign="center"
            sx={{ 
              mb: 0.5,
              fontWeight: 600,
              fontSize: { xs: "0.9rem", sm: "1rem" }
            }}
          >
            {currentTestimonial.title}
          </Typography>
          
          {/* Phone Number Section with Interactive Icon */}
          {currentTestimonial.contact && (
            <Box sx={{ mt: 1, textAlign: "center" }}>
              <IconButton
                onClick={() => setShowPhone(!showPhone)}
                sx={{
                  p: 0.5,
                  mb: 0.5,
                  color: Theme.bronze[500],
                  "&:hover": {
                    color: Theme.bronze[700],
                    transform: "scale(1.1)",
                    transition: "all 0.2s",
                  },
                }}
                aria-label={showPhone ? "Hide phone number" : "Show phone number"}
              >
                <FaPhoneAlt size={20} />
              </IconButton>
              
              <Collapse in={showPhone} timeout={300}>
                <Fade in={showPhone}>
                  <Typography
                    variant="body2"
                    color={Theme.bronze[700]}
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      p: 1,
                      borderRadius: 1,
                      mt: 0.5,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: Theme.wheat[300],
                      },
                    }}
                    onClick={() => {
                      // Copy to clipboard functionality
                      navigator.clipboard.writeText(
                        currentTestimonial.contact!.replace(/\s/g, "")
                      );
                    }}
                  >
                    {currentTestimonial.contact}
                  </Typography>
                </Fade>
              </Collapse>
            </Box>
          )}
        </Box>

        {/* Middle Section - Feedback with Read More */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            order: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Box sx={{ position: "relative" }}>
            {/* Feedback Text with Limited Lines */}
            <Typography
              variant="body1"
              color={Theme["dark-khakhi"][600]}
              sx={{
                pl: { xs: 0, sm: 4 },
                lineHeight: LINE_HEIGHT,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontStyle: "italic",
                fontWeight: FEEDBACK_FONT_WEIGHT,
                // Limit to 5 lines when not expanded
                display: "-webkit-box",
                WebkitLineClamp: expanded ? "unset" : MAX_LINES,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxHeight: expanded ? "none" : `calc(${LINE_HEIGHT}em * ${MAX_LINES})`,
                transition: "max-height 0.3s ease",
              }}
            >
              {currentTestimonial.feedback}
            </Typography>

            {/* Read More/Less Button */}
            {shouldShowReadMore && (
              <Button
                onClick={() => setExpanded(!expanded)}
                sx={{
                  mt: 1,
                  color: Theme.bronze[600],
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  "&:hover": {
                    color: Theme.bronze[800],
                    bgcolor: "transparent",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {expanded ? (
                  <>
                    Read Less
                    <Box sx={{ transform: "rotate(180deg)" }}>▼</Box>
                  </>
                ) : (
                  <>
                    Read More
                    <Box>▼</Box>
                  </>
                )}
              </Button>
            )}
          </Box>

          {/* Closing Quote */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "5rem", sm: "6rem", md: "7rem" },
              lineHeight: 1,
              color: Theme.bronze[200],
              position: "absolute",
              bottom: { xs: -50, sm: -80, md: -100 },
              right: { xs: 10, sm: -20, md: -30 },
              opacity: 0.8,
              userSelect: "none",
            }}
          >
            "
          </Typography>
        </Box>

        {/* Navigation Dots for Mobile */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mt: 2,
              order: 3,
            }}
          >
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setExpanded(false);
                }}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor:
                    index === currentIndex
                      ? Theme.bronze[400]
                      : Theme.bronze[200],
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: Theme.bronze[400],
                    transform: "scale(1.2)",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Navigation Buttons - Desktop/Tablet */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
            aria-label="Previous testimonial"
          >
            <IoArrowBackCircle
              fontSize="2.5rem"
              style={{
                color: Theme.bronze[400],
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
              }}
            />
          </IconButton>

          {/* Dots Indicator */}
          <Box sx={{ display: "flex", gap: 1.5, mx: 3 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setExpanded(false);
                }}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor:
                    index === currentIndex
                      ? Theme.bronze[400]
                      : Theme.bronze[200],
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: Theme.bronze[400],
                    transform: "scale(1.3)",
                  },
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
            aria-label="Next testimonial"
          >
            <IoArrowForwardCircle
              fontSize="2.5rem"
              style={{
                color: Theme.bronze[400],
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
              }}
            />
          </IconButton>
        </Box>
      )}

      {/* Mobile Navigation Arrows */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            px: 2,
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
            aria-label="Previous testimonial"
          >
            <IoArrowBackCircle
              fontSize="2rem"
              style={{
                color: Theme.bronze[400],
              }}
            />
          </IconButton>

          <Typography
            variant="body2"
            color={Theme.bronze[500]}
            fontWeight={700}
            sx={{ fontSize: "1rem" }}
          >
            {currentIndex + 1} / {testimonials.length}
          </Typography>

          <IconButton
            onClick={handleNext}
            sx={{
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
            aria-label="Next testimonial"
          >
            <IoArrowForwardCircle
              fontSize="2rem"
              style={{
                color: Theme.bronze[400],
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TestimonialCard;