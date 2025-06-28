
import React from 'react';
import { Building2, Mountain, Home, Users, GraduationCap, Sprout } from 'lucide-react';

const MainContent = () => {
  const services = [
    {
      icon: <Sprout className="h-12 w-12" />,
      title: 'Agriculture',
      description: 'Sustainable farming solutions and agricultural innovations for a better tomorrow.',
      color: 'text-green-600'
    },
    {
      icon: <Mountain className="h-12 w-12" />,
      title: 'Mining',
      description: 'Responsible resource extraction with environmental stewardship at our core.',
      color: 'text-orange-600'
    },
    {
      icon: <Home className="h-12 w-12" />,
      title: 'Real Estate',
      description: 'Premium property development and investment opportunities.',
      color: 'text-blue-600'
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: 'Community Services',
      description: 'Building stronger communities through dedicated service and support.',
      color: 'text-purple-600'
    },
    {
      icon: <GraduationCap className="h-12 w-12" />,
      title: 'Education',
      description: 'Empowering minds through innovative educational programs and facilities.',
      color: 'text-indigo-600'
    },
    {
      icon: <Building2 className="h-12 w-12" />,
      title: 'Corporate Development',
      description: 'Strategic business growth and corporate excellence across all sectors.',
      color: 'text-astro-blue'
    }
  ];

  return (
    <main className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-astro-blue mb-6">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 font-roboto max-w-3xl mx-auto">
              Astro Forge Holdings operates across multiple sectors, delivering excellence and innovation in every venture we undertake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className={`${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold font-poppins text-astro-blue mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 font-roboto leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-20">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold font-poppins text-astro-blue mb-6">
                  About Astro Forge Holdings
                </h2>
                <p className="text-lg text-gray-600 font-roboto leading-relaxed mb-6">
                  Founded on the principles of innovation, sustainability, and excellence, Astro Forge Holdings has emerged as a leading conglomerate driving positive change across multiple industries.
                </p>
                <p className="text-lg text-gray-600 font-roboto leading-relaxed mb-6">
                  Our diverse portfolio spans agriculture, mining, real estate, community services, and education, allowing us to create synergies and deliver comprehensive solutions that benefit both our stakeholders and the communities we serve.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-astro-blue text-white px-6 py-3 rounded-full font-semibold">
                    50+ Projects
                  </div>
                  <div className="bg-astro-gold text-astro-blue px-6 py-3 rounded-full font-semibold">
                    15 Years Experience
                  </div>
                  <div className="bg-astro-accent text-white px-6 py-3 rounded-full font-semibold">
                    Global Reach
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
                  alt="Modern office building"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-astro-blue rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold font-poppins text-astro-white mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-astro-white font-roboto mb-8 max-w-2xl mx-auto">
            Let's discuss how Astro Forge Holdings can help bring your vision to life through our expertise and innovative solutions.
          </p>
          <button className="bg-astro-gold hover:bg-yellow-500 text-astro-blue font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-poppins">
            Get in Touch
          </button>
        </section>
      </div>
    </main>
  );
};

export default MainContent;
