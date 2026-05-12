import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane, FaMobileAlt, FaInstagram } from "react-icons/fa";

const SocialLink = () => {
  return (
    
      <div className="flex items-center justify-center pr-2 gap-4 mt-1 text-white text-[12px]">
        <FaInstagram className="cursor-pointer hover:scale-110 transition" />
        <FaFacebookF className="cursor-pointer hover:scale-110 transition" />
        <FaTwitter className="cursor-pointer hover:scale-110 transition" />
        <FaTelegramPlane className="cursor-pointer hover:scale-110 transition" />
        <FaWhatsapp className="cursor-pointer hover:scale-110 transition" />
        <FaMobileAlt className="cursor-pointer hover:scale-110 transition" />
      </div>

  );
};

export default SocialLink;