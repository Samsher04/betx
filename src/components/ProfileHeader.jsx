import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ProfileHeader() {
  const userData = useSelector((state) => state?.user?.userData) || {};
  console.log({userData});
  

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const shortId = (id = "") => {
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
};

const user = {
  initials: getInitials(userData?.userName),
  name: userData?.userName,
  id: shortId(userData?._id),
};

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Avatar */}
      <div className="relative mb-3">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-rajdhani text-[26px] font-bold text-[#1c1003]"
          style={{ background: "linear-gradient(135deg, #d97706, #fbbf24)" }}
        >
          {user.initials}
        </div>
        <div
          className="absolute bottom-[2px] right-[2px] w-[18px] h-[18px] rounded-full flex items-center justify-center"
          style={{ background: "#22c55e", border: "2px solid #0d0d0d" }}
        >
          <FaCheckCircle size={9} color="#fff" />
        </div>
      </div>

      <p className="font-rajdhani text-[20px] font-bold text-white tracking-wide mb-1">
        {user.name}
      </p>
      <p className="text-[12px] text-white/30">ID: #{user.id}</p>
    </div>
  );
}
