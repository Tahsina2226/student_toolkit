import { NavLink } from "react-router-dom";

const Footer = () => {
  const menuItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "schedule", label: "Class Schedule", path: "/schedule" },
    { id: "budget", label: "Budget Tracker", path: "/budget" },
    { id: "exam", label: "Exam Generator", path: "/exam" },
    { id: "planner", label: "Study Planner", path: "/planner" },
  ];

  const socialLinks = [
    { id: "facebook", icon: "📘", label: "Facebook", url: "#" },
    { id: "twitter", icon: "🐦", label: "Twitter", url: "#" },
    { id: "instagram", icon: "📸", label: "Instagram", url: "#" },
    { id: "linkedin", icon: "💼", label: "LinkedIn", url: "#" },
  ];

  const resources = [
    { id: "help", label: "Help Center", path: "/help" },
    { id: "privacy", label: "Privacy Policy", path: "/privacy" },
    { id: "terms", label: "Terms of Service", path: "/terms" },
    { id: "contact", label: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="relative bg-gradient-to-r from-[#5A6D57] via-[#7D8F69] to-[#A2AF9B] mt-16 overflow-hidden text-white">
      {/* Decorative elements */}
      <div className="top-0 left-0 absolute bg-gradient-to-b from-white/10 to-transparent w-full h-12"></div>
      <div className="-top-10 -right-10 absolute bg-[#E8D7C3]/20 rounded-full w-32 h-32"></div>
      <div className="-bottom-8 -left-8 absolute bg-[#DCCFC0]/20 rounded-full w-24 h-24"></div>
      
      <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-12">
          {/* Brand section */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex justify-center items-center bg-gradient-to-br from-[#E8D7C3] to-[#DCCFC0] shadow-md rounded-xl w-12 h-12 rotate-6 transform">
                <span className="text-2xl">🎓</span>
              </div>
              <span className="font-bold text-white text-2xl">
                Student<span className="text-[#E8D7C3]">Suite</span>
              </span>
            </div>
            <p className="mb-6 max-w-xs text-white/80 text-sm">
              Your all-in-one platform for academic success. Plan, track, and excel in your studies with our comprehensive tools.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  className="flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg w-10 h-10 transition-all hover:-translate-y-1 duration-300 transform"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-4">
            <h3 className="mb-4 font-semibold text-[#E8D7C3] text-lg">Navigation</h3>
            <div className="gap-3 grid grid-cols-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => 
                    `font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/10 text-[#E8D7C3] shadow-inner' 
                        : 'text-white/90 hover:text-[#E8D7C3] hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="md:col-span-4">
            <h3 className="mb-4 font-semibold text-[#E8D7C3] text-lg">Resources</h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.path}
                  className="block py-1 text-white/90 hover:text-[#E8D7C3] transition-colors duration-200"
                >
                  {resource.label}
                </a>
              ))}
            </div>
            
            {/* Newsletter signup */}
            <div className="mt-6">
              <h4 className="mb-2 font-medium">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="bg-white/10 px-3 py-2 border border-white/20 rounded-l-lg focus:outline-none focus:ring-[#E8D7C3] focus:ring-1 w-full text-white placeholder-white/60"
                />
                <button className="bg-[#E8D7C3] hover:bg-[#DCCFC0] px-4 py-2 rounded-r-lg font-medium text-[#5A6D57] transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex md:flex-row flex-col justify-between items-center mt-10 pt-6 border-white/20 border-t">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} StudentSuite. All rights reserved.
          </p>
          
          <div className="flex items-center mt-3 md:mt-0">
            <span className="mr-2 text-white/70 text-sm">Made with</span>
            <span className="mx-1 text-red-400">❤️</span>
            <span className="ml-1 text-white/70 text-sm">by StudentSuite Team</span>
          </div>
          
          <div className="flex items-center mt-3 md:mt-0">
            <span className="mr-2 text-white/70 text-sm">Secure</span>
            <div className="bg-green-400 rounded-full w-4 h-4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;