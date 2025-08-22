import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetTOWQuery,
  useCreateTOWMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
} from "../slices/uploadApiSlice";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "../../@/components/ui/button";

const EventImages = () => {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo);

  // Queries & Mutations
  const { data: images, isLoading, refetch } = useGetTOWQuery(dbName);
  const [createTOW] = useCreateTOWMutation(dbName);
  const [uploadImage] = useUploadImageMutation(dbName);
  const [deleteImage] = useDeleteImageMutation(dbName);

  // Auto-create TOW if empty
/*  useEffect(() => {
    if (images && images.length === 0) {
      createTOW(dbName)
        .unwrap()
        .then(() => {
          toast.success("TOW created");
          refetch();
        })
        .catch(() => toast.error("Failed to create TOW"));
    }
  }, [dbName, images, createTOW, refetch]);*/

  const createTOWImages = async () => {
    try {
      await createTOW(dbName).unwrap();
      toast.success("TOW created");
      refetch();
    } catch (error) {
      toast.error("Failed to create TOW");
    }
  }
  // Upload handler
  const handleUpload = async (eventId, file) => {
    if (!file) return;
    try {
      await uploadImage({ dbName, eventId, file }).unwrap();
      toast.success("Image uploaded successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload image");
    }
  };

  // Delete handler
  const handleDelete = async (eventId, fileId) => {
    try {
      await deleteImage({ dbName, eventId, fileId }).unwrap();
      toast.success("Image deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete image");
    }
  };

  if (dbName !== "app5Aside") return null;

  return (

    <div className="w-[320px] sm:w-full">
      <h2 className="text-2xl font-bold mb-4 mt-15 md:mt-0 px-4">Teams of the week</h2>
      {/*userInfo && <div className="p-4"><Button onClick={createTOWImages} className> Create </Button></div>*/}
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 p-4">
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        images?.map((img) => (
          <div
            key={img.eventId}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center"
          >
            <h4 className="text-lg font-semibold mb-2">
              Gameweek {img.eventId}
            </h4>

            {img.url ? (
              <img
                src={img.url}
                alt={`Event ${img.eventId}`}
                className="w-full h-100 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-100 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl">
                
              </div>
            )}

            {userInfo && (
              <div className="mt-3 flex gap-3 justify-center">
                {img.url ? (
                  <button
                    onClick={() => handleDelete(img.eventId, img.fileId)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleUpload(img.eventId, e.target.files[0])
                      }
                    />
                    <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
    </div>
  );
};

export default EventImages;
