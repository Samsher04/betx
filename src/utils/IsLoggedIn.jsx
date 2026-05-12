import { useSelector } from "react-redux";

const IsLoggedIn = () => {
  const IsLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return <>{IsLoggedIn ? true : "User is not logged in"}</>;
};

export default IsLoggedIn;
