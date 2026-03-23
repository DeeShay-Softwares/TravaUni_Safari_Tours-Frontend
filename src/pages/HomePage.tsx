import TripsSection from './TripsSection'
import { ToursSection } from './ToursSection'
import { BookingSection } from './BookingSection'
import { HeroPage } from './HeroPage'
import { TestimonialSection } from './TestimonialSection'
import { GallerySection } from './GallerySection'
import Footer from './Footer'


export function HomePage(){

    return(
        <>
        <HeroPage/>
        <ToursSection/>
        <BookingSection/>
        <TripsSection/>
        <TestimonialSection/>
        <GallerySection/>
        <Footer/>
        </>
    )
}