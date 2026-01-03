// Complete projects-data.js with all your projects + animated MomentumX
import MomentumXOriginalLogo from '../../app/components/MomentumXOriginalLogo'; // Adjust path as needed

export const projectsData = [
  {
    id: 1,
    name: 'Emmanuel Transportation L.L.C.',
    description: "Built mobile app for luxury transportation booking with real-time GPS tracking, serving 200+ monthly rides. Integrated Stripe payments and Google Maps API, reducing booking time by 60% with cross-platform support. Eliminated 18% third-party commission fees by developing in-house booking solution. Currently in comprehensive testing phase, undergoing security audits and regulatory approval processes with guidance from industry professional family member before full production deployment.",
    tools: ['React Native', 'Stripe API', 'Google Maps API', 'PostgreSQL', 'Cross-platform', 'Security Testing'],
    role: 'Full-Stack Mobile Developer',
    code: '', // Add GitHub link if public
    demo: '', // Add app store link when live
    // image: "/transportation-app-screenshot.png", // Add your app screenshot to public/
  },
  {
    id: 2,
    name: 'MomentumX (Teen Habit Builder)',
    description: "Designing AI-powered mobile app to help teens build positive habits through peer accountability and social motivation. Currently conducting extensive user feedback sessions and psychological research surveys to inform machine learning algorithms and recommendation systems. Developing community-driven features with AI agents trained on behavioral psychology data, personalized coaching systems, and intelligent progress insights using cloud infrastructure.",
    tools: ['React Native', 'Firebase', 'Node.js', 'AI/ML', 'Psychology Research', 'User Research', 'Cloud Functions', 'Figma'],
    role: 'Lead Developer & Product Designer',
    code: '', // Add GitHub link when ready
    demo: '', // Add demo link when available
    // image: <MomentumXOriginalLogo size="default" showTagline={true} />, // 🎯 Your animated logo!
  },
  {
    id: 3,
    name: 'Virtual Transit Simulator',
    description: "Built full-stack transit simulator with real-time vehicle tracking and passenger movement modeling via WebSocket communication. Implemented comprehensive object-oriented design with 90% test coverage through JUnit testing and contributed to optimization and refactoring efforts.",
    tools: ['Java', 'WebSocket', 'JUnit', 'OOP', 'Real-time Communication'],
    role: 'Backend Developer & Debugging Specialist',
    code: '', // Add GitHub link if available
    demo: '', // Add demo link if you have one
    // image: "/transit-simulator-screenshot.png", // Add screenshot to public/
  },
  {
    id: 4,
    name: 'BCImgView Security Audit',
    description: "Conducted comprehensive security analysis of intentionally vulnerable C image viewer, identifying critical format string injection and integer overflow vulnerabilities. Developed working exploits and documented attack vectors for academic security research. Created proof-of-concept exploits confirmed through GDB analysis.",
    tools: ['C', 'GDB', 'Linux', 'Cybersecurity', 'Vulnerability Analysis', 'Exploit Development'],
    role: 'Security Researcher',
    code: '', // Don't share exploit code publicly
    demo: '', // No demo for security research
    // No image - security projects look better without flashy graphics
  },
  {
    id: 5,
    name: 'Baseball Platform Development',
    description: "Developed complete baseball section for sports platform at Raffters, streamlining development by 40% through efficient framework utilization. Structured and validated baseball league data across Google Sheets, ensuring 99%+ data accuracy for player statistics and schedules. Performed QA testing and recruited 250 beta testers to support the goal of reaching 2,500 monthly users post-release.",
    tools: ['JavaScript', 'AWS', 'ESPN API', 'Google Sheets', 'QA Testing'],
    role: 'Software Engineering Intern',
    code: '', // Company code - don't share
    demo: '', // Company product - check if you can link
    image: "/image/raffters_sports_logo.png", // Add Raffters logo to public/
  }
];

// ==================================================
// FILE 3: Add these images to public/ folder
// ==================================================

/*
Add these files to your public/ folder:

1. transportation-app-screenshot.png
   - Screenshot of your Emmanuel Transportation app
   - Show the booking interface or GPS tracking

2. transit-simulator-screenshot.png  
   - Screenshot of your Virtual Transit Simulator
   - Show the real-time vehicle tracking interface

3. raffters-logo.png
   - Download Raffters company logo from their website
   - Or ask your contact at Raffters for their logo file

The MomentumX project uses the animated component (no separate image needed)
The Security project has no image (looks more professional)
*/