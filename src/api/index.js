import verifiedVoters from "./db.json";

export const findVoter = (identityNumber) => {
  const voter = verifiedVoters.find(
    (voter) => voter.identityNumber === identityNumber
  );
  return voter;
};

export const verifyIdentityNumber = async (identityNumber) => {
  const voter = verifiedVoters.find(
    (voter) => voter.identityNumber === identityNumber
  );

  if (!voter) {
    return false;
  }

  return true;
};
