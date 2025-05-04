/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { SchemeService } from "@/services/SchemeService";
import React, { useEffect, useState } from "react";

const SchemeManagement: React.FC = () => {
  const { user } = useFormContext();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<{ _id: string; name: string; description: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newScheme, setNewScheme] = useState({ name: "", description: "" });
  const [editingScheme, setEditingScheme] = useState<{ _id: string; name: string; description: string } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState<string | null>(null);
  const isAdmin = user?.roles.includes("ADMIN");

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setIsLoading(true);
        const data = await SchemeService.getSchemes();
        setSchemes(data);
      } catch (err) {
        setError("Failed to load schemes. Please try again later.");
        toast({ title: "Error", description: "Unable to load schemes. Please try again.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchemes();
  }, [toast]);

  const handleCreateScheme = async () => {
    if (!newScheme.name || !newScheme.description)
      return toast({ title: "Error", description: "Name and description are required.", variant: "destructive" });
    try {
      await SchemeService.addScheme(newScheme);
      setSchemes(await SchemeService.getSchemes());
      setNewScheme({ name: "", description: "" });
      setIsCreateModalOpen(false);
      toast({ title: "Success", description: "Scheme created successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to create scheme. Please try again.", variant: "destructive" });
    }
  };

  const handleUpdateScheme = async () => {
    if (!editingScheme || !editingScheme.name || !editingScheme.description)
      return toast({ title: "Error", description: "Name and description are required.", variant: "destructive" });
    try {
      await SchemeService.updateScheme(editingScheme._id, {
        name: editingScheme.name,
        description: editingScheme.description,
      });
      setSchemes(await SchemeService.getSchemes());
      setEditingScheme(null);
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "Scheme updated successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to update scheme. Please try again.", variant: "destructive" });
    }
  };

  const handleDeleteScheme = async () => {
    if (!schemeToDelete) return;
    try {
      const hasRecords = await SchemeService.checkSchemeRecords(schemeToDelete);
      if (hasRecords) {
        toast({ title: "Error", description: "Cannot delete scheme with associated claims or records.", variant: "destructive" });
        setIsDeleteModalOpen(false);
        setSchemeToDelete(null);
        return;
      }
      await SchemeService.deleteScheme(schemeToDelete);
      setSchemes(await SchemeService.getSchemes());
      setIsDeleteModalOpen(false);
      setSchemeToDelete(null);
      toast({ title: "Success", description: "Scheme deleted successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete scheme. Please try again.", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Scheme Management</h2>
        {isAdmin && <Button className="mb-4" onClick={() => setIsCreateModalOpen(true)}>Create Scheme</Button>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {schemes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 3 : 2} className="text-center">No schemes available.</TableCell>
              </TableRow>
            ) : (
              schemes.map(({ _id, name, description }) => (
                <TableRow key={_id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{description}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                        setEditingScheme({ _id, name, description });
                        setIsEditModalOpen(true);
                      }}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => {
                        setSchemeToDelete(_id);
                        setIsDeleteModalOpen(true);
                      }}>Delete</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Scheme</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Scheme Name" value={newScheme.name} onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })} />
              <Input placeholder="Description" value={newScheme.description} onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateScheme}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Scheme</DialogTitle></DialogHeader>
            {editingScheme && (
              <div className="space-y-4">
                <Input placeholder="Scheme Name" value={editingScheme.name} onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })} />
                <Input placeholder="Description" value={editingScheme.description} onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })} />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateScheme}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
            <p>Are you sure you want to delete this scheme? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteScheme}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SchemeManagement;
