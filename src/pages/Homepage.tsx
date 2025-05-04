
import React from 'react';
import HomeHeader from '../components/HomeHeader';
import SchemeCard from '../components/SchemeCard';
import ProcessStep from '../components/ProcessStep';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

// Sample scheme data
const schemes = [
  {
    title: "PM-KISAN",
    description: "Income support program for farmers",
    eligibility: "All small and marginal farmer families across the country with cultivable land.",
    benefits: "Direct income support of Rs. 6,000 per year in three equal installments."
  },
  {
    title: "Ayushman Bharat",
    description: "Health insurance scheme for the poor",
    eligibility: "Poor and vulnerable families as per SECC database.",
    benefits: "Health coverage up to Rs. 5 lakhs per family per year."
  },
  {
    title: "Jan Dhan Yojana",
    description: "Financial inclusion program",
    eligibility: "Any individual above 10 years of age.",
    benefits: "Bank account with no minimum balance requirement, accident insurance, and overdraft facility."
  },
  {
    title: "Ujjwala Yojana",
    description: "LPG connection to women from BPL households",
    eligibility: "Women from BPL households without LPG connection.",
    benefits: "Free LPG connection with financial assistance."
  },
  {
    title: "Saubhagya Scheme",
    description: "Electricity connection to all households",
    eligibility: "Un-electrified households in rural and urban areas.",
    benefits: "Free electricity connection to all remaining un-electrified households."
  }
];

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="hero-section py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Citizens Through Government Schemes</h1>
            <p className="text-lg mb-8">Access all government schemes, benefits, and claim processes in one place</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Button asChild size="lg" className="bg-white text-scheme-blue hover:bg-scheme-light-blue hover:text-scheme-blue">
                <Link to="/#schemes">Explore Schemes</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-scheme-blue">
                <Link to="/login?register=true">Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Schemes Section */}
      <section id="schemes" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-scheme-blue">Available Schemes</h2>
            <p className="text-gray-600 mt-2">Browse through the various government schemes available for citizens</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme, index) => (
              <SchemeCard 
                key={index} 
                title={scheme.title} 
                description={scheme.description}
                eligibility={scheme.eligibility}
                benefits={scheme.benefits}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Claim Process Section */}
      <section id="process" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-scheme-blue">Claim Submission Process</h2>
            <p className="text-gray-600 mt-2">Follow these simple steps to submit your scheme claim</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ProcessStep 
              number={1} 
              title="Register or Login" 
              description="Create an account or login using your mobile number and Aadhaar number."
            />
            <ProcessStep 
              number={2} 
              title="Select a Scheme" 
              description="Browse through available schemes and select the one you want to claim benefits for."
            />
            <ProcessStep 
              number={3} 
              title="Fill in Details" 
              description="Provide necessary information including your bank details for fund transfer."
            />
            <ProcessStep 
              number={4} 
              title="Upload Documents" 
              description="Upload all required supporting documents to verify your eligibility."
            />
            <ProcessStep 
              number={5} 
              title="Submit and Track" 
              description="Submit your claim and track its status through your dashboard."
            />
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-scheme-blue hover:bg-scheme-teal">
              <Link to="/login">Start Your Claim Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-scheme-blue">Need Assistance?</h2>
            <p className="text-gray-600 mt-2">Our support team is here to help you with any questions</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="space-y-4 text-center">
                <div>
                  <h3 className="text-lg font-medium">Helpline Number</h3>
                  <p className="text-scheme-blue font-medium">1800-XXX-XXXX</p>
                  <p className="text-sm text-gray-500">(Toll-free, 9AM to 6PM)</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Email Support</h3>
                  <p className="text-scheme-blue font-medium">support@schemehub.gov.in</p>
                  <p className="text-sm text-gray-500">(24-48 hour response time)</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Visit Us</h3>
                  <p className="text-gray-600">Nearest Citizen Service Center</p>
                  <p className="text-sm text-gray-500">(Monday to Saturday, 10AM to 5PM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SchemeHub</h3>
              <p className="text-gray-400">Your one-stop portal for all government schemes and benefits.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/#schemes" className="text-gray-400 hover:text-white transition">Schemes</Link></li>
                <li><Link to="/#process" className="text-gray-400 hover:text-white transition">Claim Process</Link></li>
                <li><Link to="/#contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/disclaimer" className="text-gray-400 hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SchemeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
