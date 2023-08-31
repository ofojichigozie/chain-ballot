import { useEffect, useState } from "react";

const useFaceIO = () => {
  const [faceio, setFaceio] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line
    const faceio = new faceIO("fioac1b1");
    setFaceio(faceio);
  }, []);

  const handleEnroll = async (fullName, walletAddress, identityNumber) => {
    try {
      let response = await faceio.enroll({
        locale: "auto",
        payload: {
          fullName,
          walletAddress,
          identityNumber,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAuthenticate = async () => {
    try {
      let response = await faceio.authenticate({
        locale: "auto",
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleEnroll,
    handleAuthenticate,
  };
};

export default useFaceIO;
