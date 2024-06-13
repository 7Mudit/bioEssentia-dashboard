"use client";
import React, { useEffect, useState } from "react";
import {
  fetchBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "@/lib/actions/batch.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";

interface Batch {
  _id: string;
  batchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [newBatchId, setNewBatchId] = useState("");
  const [editBatchId, setEditBatchId] = useState("");
  const [editId, setEditId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBatches().then((data) => setBatches(JSON.parse(data)));
  }, []);

  const handleCreate = async () => {
    if (!newBatchId.trim()) return;
    const newBatch = await createBatch(newBatchId);
    setBatches([JSON.parse(newBatch), ...batches]);
    setNewBatchId("");
  };

  const handleUpdate = async () => {
    if (!editBatchId.trim() || !editId) return;
    const updatedBatch = await updateBatch(editId, editBatchId);
    setBatches(
      batches.map((batch) =>
        batch._id === editId ? JSON.parse(updatedBatch) : batch
      )
    );
    setEditBatchId("");
    setEditId("");
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteBatch(id);
    setBatches(batches.filter((batch) => batch._id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Batch IDs</h1>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="New Batch ID"
          value={newBatchId}
          onChange={(e) => setNewBatchId(e.target.value)}
        />
        <Button onClick={handleCreate}>Create Batch</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch._id}>
              <TableCell>{batch.batchId}</TableCell>
              <TableCell>
                {new Date(batch.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(batch.updatedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditBatchId(batch.batchId);
                      setEditId(batch._id);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(batch._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title="Edit Batch"
          description="Update Batch ID"
          onClose={() => setIsModalOpen(false)}
        >
          <Input
            placeholder="Edit Batch ID"
            value={editBatchId}
            onChange={(e) => setEditBatchId(e.target.value)}
          />
          <Button className="mt-4" onClick={handleUpdate}>
            Update Batch
          </Button>
        </Modal>
      )}
    </div>
  );
}
