import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useSelector } from "react-redux";
import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";
import { useCreateProTeamAndMembersMutation } from "../slices/teamApiSlice";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [shortName, setShortName] = useState("");
  const [fplId, setFplId] = useState(null);
  const [managerIds, setManagerIds] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [view, setView] = useState(1);

  const [createProTeamAndMembers, { isLoading }] = useCreateProTeamAndMembersMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Upload handler
  const handleFileChange = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(
        `Image is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max allowed is ${MAX_SIZE_MB}MB.`,
      );
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    /*try {
        await uploadImage({ dbName, eventId, file }).unwrap();
        toast.success("Image uploaded successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to upload image");
      }*/
  };

  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImage(null);
  };

  const handleAddFplId = () => {
    if (+fplId > 0 && !managerIds.includes(+fplId) && managerIds.length < 6) {
      setManagerIds((prev) => [...prev, +fplId]);
    }
    if (managerIds.length === 6) {
      toast.error("You can not have more than 6 players!");
    }
    setFplId("");
  };

  const handleRemoveFplId = (id) => {
    setManagerIds(managerIds.filter((x) => x !== id));
  };

  const onSubmit = async () => {
    try {
      const res = await createProTeamAndMembers({
        dbName: "ffkPro",
        managerIds,
        image,
        teamName,
        shortName,
      }).unwrap();
      dispatch(setCredentials(res.user));
      navigate("/pickTeam", { replace: true });
      toast.success(`${res.message}`);
      setManagerIds([]);
      setImage(null);
      setTeamName("");
      setShortName("");
      setPreview(null)
    } catch (error) {
      toast.error(error.data.message || "Failed to create Pro Team");
      setManagerIds([]);
      setImage(null);
      setTeamName("");
      setShortName("");
      setPreview(null)
      setView(1)
    }
  };
  return (
    <>
      {view === 1 && (
        <div className="bg-comm-1 relative overflow-auto p-4 mt-15 md:mt-0 sm:w-full rounded-lg">
          <h3 className="text-3xl font-bold mb-6">Create Team</h3>
          <div className="flex justify-between">
          <div className="flex flex-wrap gap-2 my-2 md:w-[60%]">
            <div className="w-full">
              <label htmlFor="teamName" className="font-semibold">
                Team Name
              </label>
              <Input
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="my-2"
                required
                type="text"
              />
            </div>
            <div className="w-full">
              <label htmlFor="shortName" className="font-semibold">
                Short Name
              </label>
              <Input
                placeholder="Enter Short Name"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="my-2"
                type="text"
              />
            </div>
            <div className="w-full">
              <label htmlFor="teamBadge" className="font-semibold my-2">
                Team Badge
              </label>
              {!preview ? (
                <label
                  className="flex flex-col justify-center items-center w-full
               gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer 
               hover:border-gray-400 transition colors"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to select an image (max {MAX_SIZE_MB}MB)
                  </span>
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    className="w-24 md:w-48 h-24 md:h-48 object-contain"
                    src={preview}
                    alt="preview"
                  />
                  <Button
                    onClick={clearSelection}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded=full py-1 px-4 hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    X
                  </Button>
                  <p>
                    {image.name} - {(image.size / (1024 * 1024)).toFixed(2)}MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-comm absolute hidden md:block md:w-[40%] top-0 right-0 bottom-0"></div>
          </div>
        </div>
      )}
      {view === 2 && (
        <div className="bg-comm-1 relative overflow-auto p-4 mt-15 md:mt-0 sm:w-full rounded-lg">
          <h3 className="text-3xl font-bold mb-6">Team Members</h3>
          <div className="flex justify-between">
          <div className="flex flex-wrap gap-2 my-2 md:w-[60%]">
            <div className="w-full flex justify-between items-center">
              <div className="md:w-[60%]">
                <Input
                  placeholder="Enter FPL ID"
                  value={fplId}
                  onChange={(e) => setFplId(e.target.value)}
                  className="my-2"
                  required
                  type="number"
                />
              </div>
              <div>
                <Button
                  disabled={managerIds.length >= 6 || +fplId <= 0}
                  onClick={handleAddFplId}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="w-full">
              <div className="text-center p-2 font-bold">
                {managerIds.length === 6
                  ? "Your team is complete!"
                  : `You have added ${managerIds.length} members to your team`}
              </div>
              <div className="w-[60%] h-px bg-black m-auto"></div>
              {managerIds.map((id, index) => (
                <div
                  className="w-full flex justify-between items-center border-b border-gray-300 py-2"
                  key={index + 1}
                >
                  <div>{id}</div>
                  <div className="pl-1 truncate text-center">
                    <button
                      onClick={() => handleRemoveFplId(id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-comm absolute hidden md:block md:w-[40%] top-0 right-0 bottom-0"></div>
          </div>
        </div>
      )}
      {view == 3 && (
        <div className="bg-comm-1 relative overflow-auto p-4 mt-15 md:mt-0 sm:w-full rounded-lg">
          <h3 className="text-3xl font-bold mb-6">Team</h3>
          <div className="flex justify-between">
          <div className="flex flex-wrap gap-2 my-2 md:w-[60%]">
            <div className="w-full">
              <h3 className="text-xl font-bold p-2 border-b border-gray-300">
                Team Details
              </h3>
              <div className="border-b border-gray-300 flex justify-between items-center p-2 team-name">
                <div>
                  <img
                    className="w-6 md:w-12 h-6 md:h-12 object-contain"
                    src={preview}
                    alt="preview"
                  />
                </div>
                <div className="font-bold truncate w-[50%]">{teamName}</div>
                <div className="font-semibold">{shortName}</div>
              </div>
              <div className="team-members">
                <p className="text-xl font-bold p-2 border-b border-gray-300">
                  Team Members
                </p>
                {managerIds.map((id, index) => (
                  <div
                    className="w-full flex justify-between items-center p-2"
                    key={index + 1}
                  >
                    <div>{id}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-comm absolute hidden md:block md:w-[40%] top-0 right-0 bottom-0"></div>
        </div>
        </div>
      )}
      <div className="md:w-[60%] flex justify-between p-2 mb-2">
        <Button
          className={`${view === 1 ? "absent" : ""}`}
          onClick={() => setView((prev) => prev - 1)}
        >
          Prev
        </Button>
        {view < 3 ? (
          <Button
            onClick={() => setView((prev) => prev + 1)}
            disabled={
              (view === 1 && (!shortName || !teamName || !image)) ||
              (view === 2 && managerIds.length !== 6)
            }
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={!shortName || !teamName || !image || isLoading}
            onClick={onSubmit}
          >
            {isLoading ? <Spinner /> : "Submit"}
          </Button>
        )}
      </div>
    </>
  );
};

export default CreateTeam;
