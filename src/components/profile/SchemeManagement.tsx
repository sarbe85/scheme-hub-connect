
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
import { LayoutDashboard, PencilLine, Plus, RefreshCw, Trash2 } from "lucide-react";
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
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await SchemeService.getSchemes();
      setSchemes(data);
      toast({ title: "Success", description: "Schemes refreshed successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to refresh schemes. Please try again." });
    } finally {
      setRefreshing(false);
    }
  };

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

  if (isLoading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading schemes...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex min-h-[400px] items-center justify-center text-red-500 bg-red-50 rounded-lg border border-red-100 p-8">
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">{error}</p>
        <Button variant="outline" onClick={handleRefresh} className="mt-4">Try Again</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 mr-2 text-blue-500" />
          <h2 className="text-2xl font-semibold">Scheme Management</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {isAdmin && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Create Scheme
            </Button>
          )}
        </div>
      </div>

      {schemes.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <LayoutDashboard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No schemes available</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin 
              ? "Get started by creating your first scheme." 
              : "No schemes have been created yet."}
          </p>
          {isAdmin && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
              Create Scheme
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                {isAdmin && <TableHead className="w-[180px] text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map(({ _id, name, description }) => (
                <TableRow key={_id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{description}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 mr-1"
                        onClick={() => {
                          setEditingScheme({ _id, name, description });
                          setIsEditModalOpen(true);
                        }}
                      >
                        <PencilLine className="h-4 w-4 text-gray-600" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSchemeToDelete(_id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500" />
              <span>Create New Scheme</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Scheme Name</label>
              <Input 
                id="name"
                placeholder="Enter scheme name" 
                value={newScheme.name} 
                onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input 
                id="description"
                placeholder="Enter scheme description" 
                value={newScheme.description} 
                onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                className="bg-white" 
              />
            </div>
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
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PencilLine className="h-5 w-5 text-blue-500" />
              <span>Edit Scheme</span>
            </DialogTitle>
          </DialogHeader>
          {editingScheme && (
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Scheme Name</label>
                <Input
                  id="edit-name"
                  placeholder="Scheme Name" 
                  value={editingScheme.name} 
                  onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  className="bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                <Input 
                  id="edit-description"
                  placeholder="Description" 
                  value={editingScheme.description} 
                  onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                  className="bg-white" 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateScheme}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700">
              Are you sure you want to delete this scheme? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="mb-2 sm:mb-0">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteScheme}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemeManagement;
