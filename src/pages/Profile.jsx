import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import {
  useUpdateUserMutation,
  useUpdateUserNameMutation,
  useLogoutMutation,
} from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { logout } from "../slices/authSlice";
import { toast } from "sonner";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [newUsername, setNewUsername] = useState(userInfo?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [updateUserName, { isLoading: isUpdatingUsername }] = useUpdateUserNameMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSave = async () => {
    if (newUsername.trim() === "") {
      toast.error("Username cannot be empty");
      return;
    }
    if (/\s/.test(newUsername.trim())) {
      toast.error("Username cannot contain spaces");
      return;
    }
    if (newUsername.length < 5) {
      toast.error("Username must be at least 5 characters long");
      return;
    }
    try {
      const userData = {
        newUsername,
      };
      const response = await updateUserName(userData).unwrap();
      toast.success(response?.data?.message || response?.message);
      dispatch(setCredentials({ ...userInfo, username: response?.data?.username || response?.username }));
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Failed to update username",
      );
    }
  };


  const onSubmit = async () => {
    if (newPassword.trim() !== newPassword1.trim()) {
      toast.error("New passwords do not match");
      return;
    }
    if (oldPassword.trim() === newPassword.trim()) {
      toast.error("New password cannot be the same as old password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (/\s/.test(newPassword.trim())) {
      toast.error("New password cannot contain spaces");
      return;
    }
    try {
      const userData = {
        username: userInfo?.username,
        oldPassword,
        newPassword,
        newPassword1,
      };
      const response = await updateUser(userData).unwrap();
      toast.success(response?.data?.message || response?.message);
      if (response) {
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Failed to update password",
      );
    }
  };
  return (
    <div className="mb-4 bg-comm-1 relative overflow-auto p-4 mt-15 md:mt-0 sm:w-full rounded-lg">
      <h3 className="text-3xl font-bold mb-6">Profile</h3>
      <div>
        <div className="flex flex-wrap gap-2 my-2 md:w-[60%]">
            <div className="w-full">
            <label htmlFor="newUsername" className="font-semibold">
              New Username
            </label>
            <Input
              placeholder="Enter New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="my-2"
              type="text" />
          </div>
          <Button
            disabled={!newUsername || newUsername === userInfo?.username || newUsername.length < 5}
            onClick={onSave}
          >
            {isUpdatingUsername ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-2 my-2 md:w-[60%]">
          <div className="w-full">
            <label htmlFor="teamName" className="font-semibold">
              Username:
            </label>
            &nbsp;&nbsp;
            <span>{userInfo?.username}</span>
          </div>
          <div className="w-full relative">
            <label htmlFor="oldPassword" className="font-semibold">
              Old Password
            </label>
            <Input
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="my-2"
              type={showPasswords.old ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => togglePassword("old")}
              className="absolute right-3 top-1/2"
            >
              {showPasswords.old ? <EyeOff color="gray" size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="w-full relative">
            <label htmlFor="newPassword" className="font-semibold">
              New Password
            </label>
            <Input
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="my-2"
              type={showPasswords.new ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => togglePassword("new")}
              className="absolute right-3 top-1/2"
            >
              {showPasswords.new ? <EyeOff color="gray" size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="w-full relative">
            <label htmlFor="newPassword1" className="font-semibold">
              Confirm New Password
            </label>
            <Input
              placeholder="Confirm New Password"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              className="my-2"
              type={showPasswords.confirm ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => togglePassword("confirm")}
              className="absolute right-3 top-1/2"
            >
              {showPasswords.confirm ? <EyeOff color="gray" size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            disabled={!oldPassword || !newPassword || !newPassword1}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
        <div className="bg-comm absolute hidden md:block md:w-[40%] top-0 right-0 bottom-0"></div>
      </div>
    </div>
  );
};

export default Profile;
