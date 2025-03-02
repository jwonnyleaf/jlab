import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Settings } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  route: string;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: (route: string) => void;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState<string>('/photobooth');

  const handleNavigation = (route: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveRoute(route);
    navigate(route);
  };
  const sidebarItems = [
    {
      label: 'PhotoBooth',
      route: '/photobooth',
      icon: <Camera size={24} />,
      disabled: false,
    },
    {
      label: 'Settings',
      route: '/settings',
      icon: <Settings size={24} />,
      disabled: false,
    },
  ];

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 bottom-0 w-16 pt-2 flex flex-col gap-6 items-center bg-neutral rounded-tr-xl rounded-br-xl shadow-2xl"
    >
      <img src="/static/images/logo.png" alt="logo" className="w-12 h-12" />
      <nav className="flex flex-col gap-2 w-full items-center">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            route={item.route}
            active={activeRoute === item.route}
            disabled={item.disabled}
            onClick={handleNavigation}
          />
        ))}
      </nav>
    </motion.div>
  );
};

// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  route,
  active,
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(route)}
      disabled={disabled}
      className={`relative flex items-center justify-center w-full h-16 transition rounded-r-lg 
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-700'
            : active
            ? 'bg-[#FF715B] text-black shadow-md'
            : 'text-gray-400 hover:bg-gray-800'
        }
      `}
    >
      {icon}
      {active && !disabled && (
        <motion.div
          layoutId="sidebar-highlight"
          className="absolute left-0 top-0 h-full w-2 bg-[#FF715B] rounded-r-lg"
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        />
      )}
    </button>
  );
};

export default Sidebar;
