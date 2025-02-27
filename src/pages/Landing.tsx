import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const Landing = () => {
  return (
    <div className="relative bg-pink min-h-screen flex flex-col p-16">
      <div className="text-black font-fjalla text-4xl">jlab.</div>
      <div
        className="absolute top-[-5px] bottom-0 left-[40%] right-0 pointer-events-none 
          before:absolute before:inset-0 before:bg-transparent 
          before:bg-[linear-gradient(white_0.1vw,transparent_0.1vw),linear-gradient(90deg,white_0.1vw,transparent_0.1vw)] 
          before:bg-[size:5.5vw_5.5vw] before:opacity-100"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3 z-10 pointer-events-none">
          <img
            src="/src/assets/landingDoodle.png"
            className="w-[clamp(400px,98vw,1400px)] object-contain"
          />
        </div>
      </div>
      <div className="absolute top-[76%] w-full flex items-center">
        <Link to="/photobooth">
          <motion.button
            className="text-burple font-libre text-[clamp(1rem,1.5vw,1.5rem)]"
            whileHover={{
              scale: 1.05,
              x: 10,
              fontWeight: 700,
              transition: {
                type: 'spring',
                stiffness: 400,
                fontWeight: { duration: 0.1 },
              },
            }}
          >
            launch your lab →
          </motion.button>
        </Link>
        <div className="absolute left-[34%] right-25 flex justify-between">
          <div className="text-burple font-libre text-[clamp(1rem,1.5vw,1.5rem)]">
            simple
          </div>
          <div className="text-burple font-libre text-[clamp(1rem,1.5vw,1.5rem)]">
            social ready
          </div>
          <div className="text-burple font-libre text-[clamp(1rem,1.5vw,1.5rem)]">
            real-time filter
          </div>
          <div className="text-burple font-libre text-[clamp(1rem,1.5vw,1.5rem)]">
            customizable
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
