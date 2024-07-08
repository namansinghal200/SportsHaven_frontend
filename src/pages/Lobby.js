import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketballBall,
  faFootballBall,
  faBaseball,
  faTableTennis,
  faTable,
  faChess,
} from "@fortawesome/free-solid-svg-icons";
import badminton from "../assets/reshot-icon-badminton-RXYNAQ749M.svg";
import cricket from "../assets/reshot-icon-cricket-M2EUHT437N.svg";
import football from "../assets/reshot-icon-football-VRDHMFPCS4.svg";
import basketball from "../assets/reshot-icon-basketball-H9K4Q5MZPR.svg";
import { Dialog } from "@headlessui/react";

const sportIcons = {
  basketball: basketball,
  football: football,
  cricket: cricket,
  tennis: faTableTennis,
  "table tennis": faTableTennis,
  squash: faTable,
  carrom: faChess,
  chess: faChess,
  badminton: badminton,
};

const DetailedLobbyCard = () => {
  const { lobbyid } = useParams();
  const navigate = useNavigate();
  const { lobbies } = useSelector((state) => state.lobby);
  const lobby = lobbies.find((lobby) => lobby.lobbyid === parseInt(lobbyid));
  const { sports } = useSelector((state) => state.sports);
  const sport = sports.find((sport) => sport.sportid === lobby.sportid);

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const openJoinDialog = () => setIsJoinDialogOpen(true);
  const closeJoinDialog = () => setIsJoinDialogOpen(false);

  const fetchLobbyUsers = async () => {
    try {
      const response = await axios.get(`/lobbies/lobbyusers/${lobbyid}`);
      const lobbyUsers = response.data;

      const userRequests = lobbyUsers.map((lobbyUser) => {
        console.log(lobbyUser.userid);
        return axios.get(`/users/${lobbyUser.userid}`);
      });
      const userResponses = await Promise.all(userRequests);
      const usersData = userResponses.map((res) => res.data);

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching lobby users:", error);
    }
  };

  useEffect(() => {
    fetchLobbyUsers();
  }, [lobbyid]);

  const handleJoinLobby = async () => {
    try {
      await axios.put(`/lobbies/enter/${lobbyid}`);
      closeJoinDialog();
      navigate("/home");
    } catch (error) {
      console.error("Error joining lobby:", error);
    }
  };

  return (
    <div className="h-screen dark:bg-gray-700 bg-gray-200 pt-12">
      <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="border-b px-4 pb-6">
          <div className="text-center my-4">
            <span className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4 flex items-center justify-center bg-sky-500">
              <img
                src={sportIcons[sport.name]}
                alt={sport.name}
                className="h-20 w-20"
              />
            </span>
            <div className="py-2">
              <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                {sport.name.toUpperCase()}
              </h3>
              <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                </svg>
                IIIT ALLAHABAD
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-2">
            <button
              onClick={openJoinDialog}
              className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
            >
              Join Lobby
            </button>
            <button
              onClick={() => navigate("/home")}
              className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" />
            </svg>
            <span>
              <strong className="text-black dark:text-white">
                {lobby.currentsize}/{lobby.maxsize}
              </strong>{" "}
              Members
            </span>
          </div>
          <div className="flex flex-wrap justify-center">
            {users.map((user) => (
              <div
                key={user.userid}
                className="flex flex-col items-center mx-2 my-2"
              >
                <img
                  className="border-2 border-white dark:border-gray-800 rounded-full h-10 w-10"
                  src={`http://localhost:3010/${user.profile_pic.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={user.username}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isJoinDialogOpen} onClose={closeJoinDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              Join Lobby
            </Dialog.Title>
            <div className="mt-4">
              <p>Are you sure you want to join this lobby?</p>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleJoinLobby}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={closeJoinDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailedLobbyCard;
