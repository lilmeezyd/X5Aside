import { useState } from "react";
import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  useRegisterTeamManagerMutation,
  useGetRegisteredTeamManagersQuery,
  useDeleteTeamManagerMutation
} from "../slices/userApiSlice";
import { toast } from "sonner";

const TeamAccounts = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTeamManager, setSelectedTeamManager] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registerTeamManager] = useRegisterTeamManagerMutation();
  const [ deleteTeamManager ] = useDeleteTeamManagerMutation();
  const { data = [], isLoading } = useGetRegisteredTeamManagersQuery();
  const openDeleteModal = (player) => {
      setSelectedTeamManager(player);
      setShowDeleteModal(true);
    };
  
    const confirmDelete = async () => {
    if (!selectedTeamManager?._id) return;
    try {
      toast.loading('Deleting Team Manager...', { id: 'deleteTeamManager' });
  
      await deleteTeamManager(selectedTeamManager._id).unwrap();
  
      toast.success('Team Manager deleted!', { id: 'deleteTeamManager' });
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Failed to delete Team Manager.', { id: 'deleteTeamManager' });
      console.error(err);
    }
  };
  const handleAddCommunity = async (e) => {
    e.preventDefault();
    try {
      const res = await registerTeamManager({ username, password }).unwrap();
      toast.success(`${res.message}`);
      setUsername("");
      setPassword("");
    } catch (error) {
      toast.error(error.data.message || "Failed to create community");
      setUsername("");
      setPassword("");
    }
  };
  const paginated = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  return (
    <div className="overflow-auto p-4 mt-15 md:mt-0 sm:w-full">
      <h3 className="text-3xl font-bold mb-6">Community Accounts</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-2">
          <h4 className="border-b border-gray-400 p-2 font-semibold">
            Add Community
          </h4>
          <div className="flex flex-wrap gap-2 my-2">
            <Input
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="my-2"
              required
            />
            <Input
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="my-2"
              type="password"
              required
            />
            <div className="w-full flex justify-center p-2">
              <Button onClick={handleAddCommunity}>
                Create Community Account
              </Button>
            </div>
          </div>
        </div>
        <div className="p-2">
          <h4 className="border-b border-gray-400 font-semibold p-2">
            Community Accounts
          </h4>
          <div className="w-full  border rounded-sm overflow-x-auto space-y-4">
            <div className="font-bold my-2 border-b flex justify-between p-2 mb-2">
              <div className="w-[60%] pl-1 truncate">Username</div>
              <div className="w-[30%] pl-1 truncate text-center">Action</div>
            </div>
            {paginated.map((user, index) => (
              <div key={user._id} className="my-0 border-b flex justify-between p-2">
                <div className="w-[60%] pl-1 truncate">{user.username}</div>
              <div className="w-[30%] pl-1 truncate text-center">
                <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
              </div>
            </div>))}
          </div>
          {totalPages > 1 && (
        <div className="w-[300px] m-auto flex gap-2 justify-center items-center mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

       {showDeleteModal && selectedTeamManager && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedTeamManager.username}</span>?
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
      </div>
    </div>
  );
};

export default TeamAccounts;
