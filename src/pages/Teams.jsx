import TeamCard from "./TeamCard";
import { Button } from "../../@/components/ui/button";
import { toast } from "sonner";
import { useGetQuery, useAddMutation } from "../slices/teamApiSlice";
import { useSelector } from 'react-redux';

export default function Teams() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data: teams = [], isLoading, refetch, isError } = useGetQuery(dbName);
  const [addTeams] = useAddMutation();

  const handleAddTeams = async () => {
    toast("Fetching teams from FPL API...");
    try {
      await addTeams(dbName).unwrap();
      toast.success("Teams Added");
      refetch(); // Refresh the list after adding
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch teams");
    }
  };

  const handleRetry = () => {
    toast("Retrying fetch...");
    refetch();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <Button disabled onClick={handleAddTeams} className="mb-4">Add Teams from FPL API</Button>

      {isLoading ? (
        <p>Loading teams...</p>
      ) : teams.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      ) : (
        <div className="text-center space-y-3 mt-6">
          <p className="text-gray-500">No teams found. This might be due to a slow connection or fetch failure.</p>
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      )}
    </div>
  );
}
