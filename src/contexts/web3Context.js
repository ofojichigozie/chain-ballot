import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { toInt } from "../utils/formatter";
import { supportedChain, addresses, abis } from "../constants";

const ACTIONS = {
  SET_SIGNER: 0,
  SET_ADDRESS: 1,
  SET_BALANCE: 2,
  SET_CONNECTED: 3,
  SET_REQUESTING: 4,
  SET_REQUEST_TYPE: 5,
  SET_BALLOT_CONTRACT: 6,
  SET_ELECTION_RECORDS: 7,
  SET_IDENTITY_NUMBER: 8,
};

const initialState = {
  signer: null,
  address: null,
  balance: {},
  connected: false,
  requesting: false,
  requestType: "",
  ballotContract: {},
  electionRecords: {},
  identityNumber: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SIGNER:
      return {
        ...state,
        signer: action.payload,
      };
    case ACTIONS.SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    case ACTIONS.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case ACTIONS.SET_CONNECTED:
      return {
        ...state,
        connected: action.payload,
      };
    case ACTIONS.SET_REQUESTING:
      return {
        ...state,
        requesting: action.payload,
      };
    case ACTIONS.SET_REQUEST_TYPE:
      return {
        ...state,
        requestType: action.payload,
      };
    case ACTIONS.SET_BALLOT_CONTRACT:
      return {
        ...state,
        ballotContract: action.payload,
      };
    case ACTIONS.SET_ELECTION_RECORDS:
      return {
        ...state,
        electionRecords: action.payload,
      };
    case ACTIONS.SET_IDENTITY_NUMBER:
      return {
        ...state,
        identityNumber: action.payload,
      };
    default:
      return state;
  }
};

const Web3Context = createContext(initialState);

Web3Provider.propTypes = {
  children: PropTypes.node,
};

function Web3Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = async () => {
    if (!window.ethereum) {
      return window.alert(
        "Non-Ethereum browser detected. Open with MetaMask or Trust Wallet!"
      );
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const networkId = (await provider.getNetwork()).chainId;
    if (networkId !== supportedChain.id) {
      Swal.fire({
        text: `Please switch to the ${supportedChain.name} network and connect again`,
        icon: "info",
        padding: "3em",
        color: "#716add",
        backdrop: `rgba(0,0,0,0.8)`,
      });
      await switchToSupportedNetwork();
      window.location.reload();
      return;
    }

    window.provider = provider;
    await provider.send("eth_requestAccounts", []);

    // Get signer
    const signer = provider.getSigner();
    dispatch({ type: ACTIONS.SET_SIGNER, payload: signer });

    // Load the address
    const address = await signer.getAddress();
    dispatch({ type: ACTIONS.SET_ADDRESS, payload: address });

    // Load the ballot smart contract
    const ballotContract = new ethers.Contract(
      addresses.ballot,
      abis.ballot,
      provider
    );
    if (!ballotContract) {
      window.alert("Ballot contract not detected on the selected network");
    }
    dispatch({ type: ACTIONS.SET_BALLOT_CONTRACT, payload: ballotContract });

    // Load the account balances
    let ethBalance = await provider.getBalance(address);
    ethBalance = ethers.utils.formatUnits(ethBalance, 18);
    const balance = toInt(ethBalance.toString()).toFixed(2);
    dispatch({ type: ACTIONS.SET_BALANCE, payload: balance });

    dispatch({ type: ACTIONS.SET_CONNECTED, payload: true });

    // Subscribe to events
    window.ethereum.on("accountsChanged", async function (accounts) {
      await initialize();
      window.location.reload();
    });
    window.ethereum.on("chainChanged", async function (networkId) {
      await initialize();
      if (networkId !== supportedChain.id) {
        Swal.fire({
          text: `Please switch to the ${supportedChain.name} network and connect again`,
          icon: "info",
          padding: "3em",
          color: "#716add",
          backdrop: `rgba(0,0,0,0.8)`,
        });
        await switchToSupportedNetwork();
        window.location.reload();
      }
    });
  };

  const addSupportedNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `${supportedChain.idString}`,
            chainName: `${supportedChain.name}`,
            rpcUrls: [supportedChain.rpcUrl],
            blockExplorerUrls: [supportedChain.explorerUrl],
            nativeCurrency: supportedChain.nativeCurrency,
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const switchToSupportedNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `${supportedChain.idString}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await addSupportedNetwork();
      }
    }
  };

  const fetchElectionRecords = async () => {
    if (state.connected && state.address) {
      let chainData = localStorage.getItem("chaindata");
      let address, identityNumber;
      if (chainData) {
        chainData = JSON.parse(chainData);
        address = chainData.address;

        if (state.address === address) {
          identityNumber = chainData.identityNumber;
          dispatch({
            type: ACTIONS.SET_IDENTITY_NUMBER,
            payload: identityNumber,
          });
        }
      }

      if (!identityNumber) {
        return;
      }

      let [hasVoted, isEligible, candidates, results] = await Promise.all([
        state.ballotContract.didCurrentVoterVoted(identityNumber),
        state.ballotContract.isVoterEligible(identityNumber),
        state.ballotContract.getCandidateList(identityNumber),
        state.ballotContract.getResults(Date.now() * 2),
      ]);

      hasVoted = {
        hasVoted: hasVoted.userVoted_,
        candidate: {
          name: hasVoted.candidate_.name,
          partyShortcut: hasVoted.candidate_.partyShortcut,
          partyFlag: hasVoted.candidate_.partyFlag,
          nominationNumber: hasVoted.candidate_.nominationNumber.toString(),
          stateCode: hasVoted.candidate_.stateCode,
          constituencyCode: hasVoted.candidate_.constituencyCode,
        },
      };

      candidates = candidates.map((candidate) => ({
        name: candidate.name,
        partyShortcut: candidate.partyShortcut,
        partyFlag: candidate.partyFlag,
        nominationNumber: candidate.nominationNumber.toString(),
        stateCode: candidate.stateCode,
        constituencyCode: candidate.constituencyCode,
      }));

      results = results.map((result) => ({
        name: result.name,
        partyShortcut: result.partyShortcut,
        partyFlag: result.partyFlag,
        nominationNumber: result.nominationNumber.toString(),
        stateCode: result.stateCode,
        constituencyCode: result.constituencyCode,
        voteCount: result.voteCount.toString(),
      }));

      const electionRecords = {
        hasVoted,
        isEligible,
        candidates,
        results,
      };

      dispatch({
        type: ACTIONS.SET_ELECTION_RECORDS,
        payload: electionRecords,
      });
    }
  };

  const reloadElectionRecords = async (identityNumber) => {
    dispatch({ type: ACTIONS.SET_REQUESTING, payload: true });
    dispatch({ type: ACTIONS.SET_REQUEST_TYPE, payload: "verify" });

    try {
      const store = JSON.stringify({
        address: state.address,
        identityNumber,
      });
      localStorage.setItem("chaindata", store);

      dispatch({
        type: ACTIONS.SET_IDENTITY_NUMBER,
        payload: identityNumber,
      });

      await fetchElectionRecords();
    } catch (error) {
      console.log(error.message);
    }

    dispatch({ type: ACTIONS.SET_REQUESTING, payload: false });
    dispatch({ type: ACTIONS.SET_REQUEST_TYPE, payload: "" });
  };

  const register = async (details) => {
    if (state.connected && state.ballotContract) {
      dispatch({ type: ACTIONS.SET_REQUESTING, payload: true });
      dispatch({ type: ACTIONS.SET_REQUEST_TYPE, payload: "register" });

      try {
        const {
          fullName,
          facialId,
          identityNumber,
          age,
          stateCode,
          constituencyCode,
        } = details;
        const tx = await state.ballotContract
          .connect(state.signer)
          .register(
            fullName,
            facialId,
            identityNumber,
            age,
            stateCode,
            constituencyCode
          );
        await tx.wait();

        const store = JSON.stringify({
          address: state.address,
          identityNumber,
        });
        localStorage.setItem("chaindata", store);

        dispatch({
          type: ACTIONS.SET_IDENTITY_NUMBER,
          payload: identityNumber,
        });

        await fetchElectionRecords();

        Swal.fire({
          text: `Registration was successful`,
          icon: "success",
          padding: "3em",
          color: "#716add",
          backdrop: `rgba(0,0,0,0.8)`,
        });
      } catch (error) {
        if (error.message.indexOf("reject") > 0) {
          Swal.fire({
            text: `You rejected the transaction`,
            icon: "info",
            padding: "3em",
            color: "#716add",
            backdrop: `rgba(0,0,0,0.8)`,
          });
        }
      }
      dispatch({ type: ACTIONS.SET_REQUESTING, payload: false });
      dispatch({ type: ACTIONS.SET_REQUEST_TYPE, payload: "" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const vote = async (details) => {
    if (state.connected) {
      dispatch({ type: ACTIONS.SET_REQUESTING, payload: true });
      dispatch({ type: ACTIONS.SET_REQUEST_TYPE, payload: "vote" });

      try {
        const {
          candidateNominationNumber,
          voterIdentityNumber,
          facialId,
          currentTime,
        } = details;
        const tx = await state.ballotContract
          .connect(state.signer)
          .vote(
            candidateNominationNumber,
            voterIdentityNumber,
            facialId,
            currentTime
          );
        await tx.wait();

        await fetchElectionRecords();

        Swal.fire({
          text: `You've successfully casted your vote`,
          icon: "success",
          padding: "3em",
          color: "#716add",
          backdrop: `rgba(0,0,0,0.8)`,
        });
        await fetchElectionRecords();
      } catch (error) {
        if (error.message.indexOf("reject") > 0) {
          Swal.fire({
            text: `You rejected the transaction`,
            icon: "info",
            padding: "3em",
            color: "#716add",
            backdrop: `rgba(0,0,0,0.8)`,
          });
        }
      }
      dispatch({ type: ACTIONS.SET_REQUESTING, payload: false });
      dispatch({ type: ACTIONS.SET_REQUEST_TYPE, payload: "" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const connect = async () => {
    await initialize();
  };

  const disconnect = () => {
    window.location.reload();
  };

  const showAccount = () => {
    Swal.fire({
      text: `${state.address}`,
      showCancelButton: true,
      confirmButtonText: "Disconnect",
      padding: "3em",
      color: "#716add",
      backdrop: `rgba(0,0,0,0.8)`,
    }).then((result) => {
      if (result.isConfirmed) {
        disconnect();
      }
    });
  };

  useEffect(() => {
    // Remove this
    // console.clear();

    fetchElectionRecords();

    // eslint-disable-next-line
  }, [state.connected, state.ballotContract]);

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connect,
        disconnect,
        showAccount,
        reloadElectionRecords,
        register,
        vote,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export { Web3Provider, Web3Context };
