import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  position: string;
  image: string;
  bio: string;
  linkedin?: string;
  email?: string;
  phone?: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  position,
  image,
  bio,
  linkedin,
  email,
  phone
}) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-astro-blue/10 to-astro-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Social Icons Overlay */}
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          {linkedin && (
            <a
              href={linkedin}
              className="p-2 bg-white/90 text-astro-blue rounded-full hover:bg-astro-blue hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label={`${name}'s LinkedIn`}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="p-2 bg-white/90 text-astro-blue rounded-full hover:bg-astro-gold hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label={`Email ${name}`}
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="p-2 bg-white/90 text-astro-blue rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label={`Call ${name}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold font-poppins text-astro-blue dark:text-white mb-2 group-hover:text-astro-gold transition-colors duration-300">
            {name}
          </h3>
          <div className="inline-block px-3 py-1 bg-astro-gold/10 text-astro-gold rounded-full text-sm font-semibold mb-3">
            {position}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-center">
          {bio}
        </p>
        
        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-astro-blue to-astro-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
