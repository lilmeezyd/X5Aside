import { useState, useEffect } from "react"
import TeamCard from "./TeamCard"; // adjust path if needed
import { Button } from "../../@/components/ui/button";
import { toast } from "sonner";
import { useGetQuery } from "../slices/teamApiSlice";
import { useAddMutation } from "../slices/teamApiSlice";
import { useSelector } from 'react-redux';

export default function Teams() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data: teams = [], isLoading, refetch } = useGetQuery(dbName);
  const [addTeams] = useAddMutation();
  /*useEffect(() => {
  refetch();
}, [dbName]);*/
  const handleAddTeams = async () => {
    toast("Fetching teams from FPL API...");
    try {
      await addTeams(dbName).unwrap();
      toast.success("Teams Added");
    } catch(error) {
      console.log(error)
      toast.error("Failed to fetch teams");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <Button onClick={handleAddTeams} className="mb-4">Add Teams from FPL API</Button>

      {isLoading ? (
        <p>Loading teams...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
