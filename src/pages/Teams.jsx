import { useState } from "react"
import TeamCard from "./TeamCard"; // adjust path if needed
import { Button } from "../../@/components/ui/button";
import { toast } from "sonner";
import { useGetQuery } from "../slices/teamApiSlice";
import { useAddMutation } from "../slices/teamApiSlice"

export default function Teams() {
  const [refetchKey, setRefetchKey] = useState(0);
  const { data: teams = [], isLoading } = useGetQuery();
  console.log(teams);
  const [addTeams] = useAddMutation(refetchKey);
  const handleAddTeams = async () => {
    toast("Fetching teams from FPL API...");
    try {
      await addTeams().unwrap();
      toast.success("Teams Added");
      setRefetchKey((k) => k + 1); // trigger re-fetch
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
