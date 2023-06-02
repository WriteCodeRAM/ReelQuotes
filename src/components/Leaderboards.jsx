import React, { useState, useEffect } from "react";
import { supabase } from "../client";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await supabase
        .from("Users")
        .select("*")
        .order("score", { ascending: false })
        .gt("score", 0); // Add filter condition to get users with score > 0

      setUsers(data);
    };

    getUsers();
  }, []);

  return (
    <>
      <h1>Leaderboard</h1>
      
      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, key) => (
              <tr key={key}>
                <td>{user.username}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Leaderboard;
