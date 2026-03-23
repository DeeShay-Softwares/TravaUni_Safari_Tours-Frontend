import '../App.css'
import { Section } from '../components/Section'
import TestimonialCard from '../components/TestimonialCard'
import { Theme } from '../assets/constants/colors'


export function TestimonialSection(){

    return(
        <>
        <Section
        backgroundColor={Theme.wheat[100]} padding="5px 50px" sx={{
                height: '100vh'
               }}
        >
            <TestimonialCard />
        </Section>
        </>
    )
}