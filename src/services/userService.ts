import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const getToken = () => localStorage.getItem("business_nexus_token");

export const getUsers = async () => {
  const { data } = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data.users;
};

export const getInvestors = async () => {
  const users = await getUsers();
  return users.filter((user: any) => user.role === "investor");
};

export const getEntrepreneurs = async () => {
  const users = await getUsers();
  return users.filter((user: any) => user.role === "entrepreneur");
};