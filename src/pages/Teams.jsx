import { useState, useMemo } from "react"
import TeamCard from "./TeamCard";
import { Button } from "../../@/components/ui/button";
import { toast } from "sonner";
import { useGetQuery, useAddMutation, useDeleteAllMutation, useGetTeamTotalPointsQuery } from "../slices/teamApiSlice";
import { useSelector } from 'react-redux';

export default function Teams() {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: teams = [], isLoading, refetch, isError } = useGetQuery(dbName);
  const { data: totals = [] } = useGetTeamTotalPointsQuery(dbName)
  const [addTeams] = useAddMutation();
  const [deleteAll ] = useDeleteAllMutation()
  const newTeams = useMemo(() => {
    const totalsMap = new Map(totals?.map(x => [x?.teamName, {rank: x?.rank, oldRank: x?.oldRank, totalPoints: x?.totalPoints}]))
    return teams.map(x => {
      return {
        ...x,
        rank: totalsMap?.get(x.name).rank,
        oldRank: totalsMap?.get(x.name).oldRank,
        total: totalsMap?.get(x.name).totalPoints
      }
    })
  }, [teams, totals])
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
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  const toastId = toast.loading('Deleting all teams...');

  try {
    await deleteAll(dbName).unwrap();

    toast.success('All teams deleted!', { id: toastId });
    setShowDeleteModal(false);
  } catch (err) {
    toast.error('Failed to delete teams.', { id: toastId });
    console.error(err);
  }
};
  /*const handleRefresh = async () => {
    const result = await refetch();
  console.log(result);
    return result;
  };*/


  return (
    <div className="overflow-auto">
      <h2 className="text-2xl font-bold mb-4 mt-15 md:mt-0">Teams</h2>
     {/*} {userInfo && <Button onClick={handleAddTeams} className="mb-4">Add Teams from FPL API</Button>}
      {/*<Button onClick={openDeleteModal} className="ml-4 mb-4 bg-red-600">Delete Teams</Button>*/}


      {isLoading ? (
  <p>Loading teams...</p>
) : isError ? (
  <div className="text-center space-y-3 mt-6">
    <p className="text-red-500">Failed to fetch teams. Please check your connection or try again later.</p>
    <Button onClick={handleRetry}>Retry</Button>
  </div>
) : teams.length > 0 ? (
  <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">

    {newTeams.map((team) => (
      <TeamCard refetch={refetch} key={team._id} team={team} />
    ))}
  </div>
) : (
  <div className="text-center space-y-3 mt-6">
    <p className="text-gray-500">No teams found.</p>
  </div>
)}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">All the teams in the database</span>?
            </p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
