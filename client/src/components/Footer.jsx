import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Send,
  GraduationCap,
  Briefcase,
  Award,
  Code
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 border-t border-gray-700'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12'>
          
          {/* Company Info - Spans 2 columns on large screens */}
          <div className='lg:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg'>
                <GraduationCap className='h-6 w-6 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-white'>E-Shikshan</h2>
            </div>
            <p className='text-gray-400 mb-4 leading-relaxed'>
              Empowering learners worldwide with quality education. Beyond Learning - Explore, Learn, and Grow with comprehensive courses, resources, and career guidance.
            </p>
            
            {/* Contact Info */}
            <div className='space-y-2 mb-4'>
              <div className='flex items-center space-x-2 text-sm'>
                <Mail className='h-4 w-4 text-blue-400' />
                <a href='mailto:info@eshikshan.com' className='hover:text-white transition-colors'>
                  info@eshikshan.com
                </a>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <Phone className='h-4 w-4 text-blue-400' />
                <a href='tel:+911234567890' className='hover:text-white transition-colors'>
                  +91 123 456 7890
                </a>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <MapPin className='h-4 w-4 text-blue-400' />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex space-x-3'>
              <a 
                href='https://facebook.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='bg-gray-700 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 hover:scale-110'
                aria-label='Facebook'
              >
                <Facebook className='h-4 w-4' />
              </a>
              <a 
                href='https://twitter.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='bg-gray-700 hover:bg-blue-400 p-2 rounded-full transition-all duration-300 hover:scale-110'
                aria-label='Twitter'
              >
                <Twitter className='h-4 w-4' />
              </a>
              <a 
                href='https://linkedin.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='bg-gray-700 hover:bg-blue-700 p-2 rounded-full transition-all duration-300 hover:scale-110'
                aria-label='LinkedIn'
              >
                <Linkedin className='h-4 w-4' />
              </a>
              <a 
                href='https://instagram.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='bg-gray-700 hover:bg-pink-600 p-2 rounded-full transition-all duration-300 hover:scale-110'
                aria-label='Instagram'
              >
                <Instagram className='h-4 w-4' />
              </a>
              <a 
                href='https://youtube.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='bg-gray-700 hover:bg-red-600 p-2 rounded-full transition-all duration-300 hover:scale-110'
                aria-label='YouTube'
              >
                <Youtube className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold mb-4 flex items-center space-x-2'>
              <BookOpen className='h-4 w-4 text-blue-400' />
              <span>Quick Links</span>
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/content' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Content Library
                </Link>
              </li>
              <li>
                <Link to='/courses' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Courses
                </Link>
              </li>
              <li>
                <Link to='/hackathons' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to='/roadmaps' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Career Roadmaps
                </Link>
              </li>
              <li>
                <Link to='/jobrole' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Job Roles
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className='text-white font-semibold mb-4 flex items-center space-x-2'>
              <Award className='h-4 w-4 text-blue-400' />
              <span>Resources</span>
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/resume' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to='/profile' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div>
            <h3 className='text-white font-semibold mb-4 flex items-center space-x-2'>
              <Code className='h-4 w-4 text-blue-400' />
              <span>Legal & Admin</span>
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to='/' className='text-sm hover:text-white hover:pl-2 transition-all duration-200 inline-block'>
                  Refund Policy
                </Link>
              </li>
              <li className='pt-2'>
                <Link 
                  to='/admin' 
                  className='text-sm text-red-400 hover:text-red-300 hover:pl-2 transition-all duration-200 inline-block font-medium'
                >
                  🔐 Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='mt-12 pt-8 border-t border-gray-700'>
          <div className='max-w-2xl mx-auto text-center'>
            <h3 className='text-xl font-semibold text-white mb-2'>Stay Updated</h3>
            <p className='text-gray-400 text-sm mb-4'>
              Subscribe to our newsletter for the latest courses, resources, and career opportunities.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
              />
              <button className='px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105'>
                <Send className='h-4 w-4' />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='bg-gray-900 border-t border-gray-700'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
            <p>
              &copy; {currentYear} <span className='text-white font-medium'>E-Shikshan</span>. All Rights Reserved.
            </p>
            <p className='mt-2 md:mt-0'>
              Made with <span className='text-red-500'>❤️</span> for learners worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer