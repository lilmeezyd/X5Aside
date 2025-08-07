import React, { useState } from 'react';
import {
  useGetHelpQuery,
  useCreateHeadingMutation,
  useCreateBodyMutation,
  useEditHeadingMutation,
  useEditBodyMutation,
  useDeleteHeadingMutation,
  useDeleteBodyMutation
} from '../slices/helpApiSlice';
import { Button } from '../../@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../../@/components/ui/dialog';
import { Input } from '../../@/components/ui/input';
import { Textarea } from '../../@/components/ui/textarea';
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { useSelector } from "react-redux"

export default function Help() {
const userInfo = useSelector((state) => state.auth.userInfo);
  const { data, isLoading, refetch } = useGetHelpQuery();
  const [expandedBodyId, setExpandedBodyId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ headingId: null, bodyId: null });

  const [createHeading] = useCreateHeadingMutation();
  const [createBody] = useCreateBodyMutation();
  const [editHeading] = useEditHeadingMutation();
  const [editBody] = useEditBodyMutation();
  const [deleteHeading] = useDeleteHeadingMutation();
  const [deleteBody] = useDeleteBodyMutation();

  const [headingModal, setHeadingModal] = useState({ open: false, title: '', id: null });
  const [bodyModal, setBodyModal] = useState({ open: false, headingId: '', subheading: '', details: '', id: null });

  const handleSaveHeading = async () => {
    if (!headingModal.title.trim()) return toast("Title cannot be empty");
    try {
      if (headingModal.id) {
        toast("Updating Heading...");
        await editHeading({ id: headingModal.id, title: headingModal.title });
        toast("Heading updated");
      } else {
        toast("Creating Heading...");
        await createHeading({ title: headingModal.title });
        toast("Heading created");
      }
      refetch();
      setHeadingModal({ open: false, title: "", id: null });
    } catch (error) {
      console.error("Error saving heading:", error);
      toast("Error saving heading");
    }
  };

  const handleSaveBody = async () => {
    if (!bodyModal.subheading.trim())
      return toast("Subheading cannot be empty");
    try {
      if (bodyModal.id) {
        toast("Updating Body...");
        await editBody({
          id: bodyModal.id,
          heading: bodyModal.headingId,
          subheading: bodyModal.subheading,
          details: bodyModal.details,
        });
        toast("Body updated");
      } else {
        toast("Creating Body...");
        await createBody({
          heading: bodyModal.headingId,
          subheading: bodyModal.subheading,
          details: bodyModal.details,
        });
        toast("Body created");
      }
      refetch();
      setBodyModal({
        open: false,
        subheading: "",
        details: "",
        headingId: "",
        id: null,
      });
    } catch (error) {
      console.error("Error saving body:", error);
      toast("Error saving body");
    }
  };

  const confirmDelete = async () => {
    try {
      if (showDeleteConfirm.headingId) {
        await deleteHeading(showDeleteConfirm.headingId);
        toast("Heading deleted");
      } else if (showDeleteConfirm.bodyId) {
        await deleteBody(showDeleteConfirm.bodyId);
        toast("Body deleted");
      }
      refetch();
      setShowDeleteConfirm({ headingId: null, bodyId: null });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast("Error deleting item");
    }
  };

  if (isLoading) return <p>Loading help...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 mt-15 md:mt-0">
          <h2 className="text-2xl font-bold">Help Center</h2>
        {userInfo && <Button onClick={() => setHeadingModal({ open: true, title: '', id: null })}>
          <Plus className="w-4 h-4 mr-2" /> Add Heading
        </Button>}
      </div>

      {data?.map((heading) => (
  <div key={heading.id} className="mb-6">
    {/* Heading Title & Controls */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">{heading.title}</h3>
      {userInfo && <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setHeadingModal({
              open: true,
              title: heading.title,
              id: heading.id,
            })
          }
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setShowDeleteConfirm({ headingId: heading.id, bodyId: null })
          }
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setBodyModal({
              open: true,
              subheading: "",
              details: "",
              headingId: heading.id,
              id: null,
            })
          }
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>}
    </div>

    {/* Body Items - Accordion Style */}
    {heading.bodies.map((body) => {
      const isExpanded = expandedBodyId === body._id;
      return (
        <div
          key={body._id}
          className="mb-2 border rounded bg-white"
        >
          {/* Question Row */}
          <div
            className="flex justify-between items-center px-4 py-2 cursor-pointer"
            onClick={() =>
              setExpandedBodyId((prev) => (prev === body._id ? null : body._id))
            }
          >
            <div className="flex items-center gap-2 w-full">
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-90 text-blue-500" : ""
                }`}
              />
              <p className="font-medium">{body.subheading}</p>
            </div>

            {/* Edit/Delete Buttons for Body */}
            {userInfo && <div className="flex gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setBodyModal({
                    open: true,
                    id: body._id,
                    headingId: heading.id,
                    subheading: body.subheading,
                    details: body.details,
                  });
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm({
                    headingId: null,
                    bodyId: body._id,
                  });
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>}
          </div>

          {/* Answer Row */}
          {isExpanded && (
            <div className="px-8 pb-3 pt-3 text-sm text-gray-700 bg-muted">
              {body.details}
            </div>
          )}
        </div>
      );
    })}
  </div>
))}

      {/* Modals */}
      <Dialog open={headingModal.open} onOpenChange={() => setHeadingModal({ open: false, title: '', id: null })}>
        <DialogContent>
          <DialogTitle>{headingModal.id ? 'Edit Heading' : 'New Heading'}</DialogTitle>
          <Input
            value={headingModal.title}
            onChange={(e) => setHeadingModal(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Heading title"
          />
          <Button onClick={handleSaveHeading}>Save</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={bodyModal.open} onOpenChange={() => setBodyModal({ open: false, subheading: '', details: '', headingId: '', id: null })}>
        <DialogContent>
          <DialogTitle>{bodyModal.id ? 'Edit Body' : 'New Body'}</DialogTitle>
          <Input
            placeholder="Subheading"
            value={bodyModal.subheading}
            onChange={(e) => setBodyModal(prev => ({ ...prev, subheading: e.target.value }))}
          />
          <Textarea
            placeholder="Details"
            value={bodyModal.details}
            onChange={(e) => setBodyModal(prev => ({ ...prev, details: e.target.value }))}
          />
          <Button onClick={handleSaveBody}>Save</Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Pop-up */}
      {(showDeleteConfirm.headingId || showDeleteConfirm.bodyId) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this {showDeleteConfirm.headingId ? 'heading and all its bodies' : 'body'}?</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm({ headingId: null, bodyId: null })}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
