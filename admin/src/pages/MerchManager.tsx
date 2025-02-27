import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageIcon, Pencil, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MerchItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  photos: {
    url: string;
    contentType: string;
  }[];
}

const MerchManagement = () => {
  const [merchandise, setMerchandise] = useState<MerchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MerchItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    photos: [] as File[],
  });

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(`http://${import.meta.env.VITE_API_URL}/api/v1/merch`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`  // ✅ Include token
            }
        });

        if (!response.ok) throw new Error("Failed to fetch merchandise");
        const data = await response.json();
        setMerchandise(data.merch);
    } catch (err) {
        console.error("Error fetching merchandise:", err);
        setError("Failed to fetch merchandise");
    } finally {
        setIsLoading(false);
    }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formDataToSend = new FormData();

  formDataToSend.append("name", formData.name);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("price", formData.price);
  
  Array.from(formData.photos).forEach((photo) => {
      formDataToSend.append("files", photo);
  });

  try {
      const token = localStorage.getItem("token"); // Get token
      const url = isEditing
          ? `api/v1/merch/${selectedMerch?._id}`
          : "api/v1/merch";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
          method,
          headers: {
              "Authorization": `Bearer ${token}` // ✅ Include token
          },
          body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save merchandise");

      await fetchMerchandise();
      resetForm();
      setIsEditDialogOpen(false);
  } catch (err) {
      console.error("Error saving merchandise:", err);
      setError("Failed to save merchandise");
  }
};

const handleDelete = async (id: string) => {
  if (!itemToDelete) return;

  try {
    const token = localStorage.getItem("token"); // Retrieve the auth token
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const response = await fetch(`http://${import.meta.env.VITE_API_URL}/api/v1/merch/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "Failed to delete merchandise");
    }

    await fetchMerchandise();
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  } catch (err) {
    console.error("Error deleting merchandise:", err);

    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to delete merchandise");
    }
  }
};

  const openDeleteDialog = (item: MerchItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (merch: MerchItem) => {
    setSelectedMerch(merch);
    setFormData({
      name: merch.name,
      description: merch.description,
      price: merch.price.toString(),
      photos: [],
    });
    setIsEditing(true);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      photos: [],
    });
    setSelectedMerch(null);
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        photos: fileInput.files ? Array.from(fileInput.files) : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Merchandise Management</CardTitle>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setIsEditing(false); // Ensure it's NOT in edit mode
                resetForm();
                setIsEditDialogOpen(true); // Open modal
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Merchandise" : "Add New Merchandise"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Make changes to your merchandise item here. Click update when you're done."
                  : "Add a new merchandise item to your inventory. Fill out all required fields."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded h-24"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Photos</label>
                <input
                  type="file"
                  name="photos"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  multiple
                  accept="image/*"
                  required={!isEditing}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchandise.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.photos?.[0]?.url ? (
                    <img
                      src={item.photos[0].url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {item.description}
                </TableCell>
                <TableCell>Rs.{item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{itemToDelete?.name}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(itemToDelete?._id || "")}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MerchManagement;
