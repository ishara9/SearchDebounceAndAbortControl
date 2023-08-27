import { useState } from "react";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";

const MyApp = () => {
  const [isHome, setIsHome] = useState(true);

  const handleSwitchPage = () => {
    setIsHome((isHome) => !isHome);
  };

  return (
    <>
      <div>
        <button onClick={handleSwitchPage}>
          {isHome ? "Go to Search Page" : "Home Page"}
        </button>
      </div>
      <div>{isHome ? <HomePage /> : <SearchPage />}</div>
    </>
  );
};

export default MyApp;
