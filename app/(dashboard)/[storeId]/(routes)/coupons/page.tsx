"use client";
import React, { useEffect, useState } from "react";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/actions/coupon.action";
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

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: 0,
    expiryDate: "",
  });
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCoupons().then((data) => setCoupons(JSON.parse(data)));
  }, []);

  const handleCreate = async () => {
    if (!newCoupon.code.trim() || !newCoupon.expiryDate) return;
    const createdCoupon = await createCoupon(
      newCoupon.code,
      newCoupon.discountPercentage,
      new Date(newCoupon.expiryDate)
    );
    setCoupons([JSON.parse(createdCoupon), ...coupons]);
    setNewCoupon({ code: "", discountPercentage: 0, expiryDate: "" });
  };

  const handleUpdate = async () => {
    if (!editCoupon) return;
    const updatedCoupon = await updateCoupon(
      editCoupon._id,
      editCoupon.code,
      editCoupon.discountPercentage,
      new Date(editCoupon.expiryDate),
      editCoupon.isActive
    );
    setCoupons(
      coupons.map((coupon) =>
        coupon._id === editCoupon._id ? JSON.parse(updatedCoupon) : coupon
      )
    );
    setEditCoupon(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCoupon(id);
    setCoupons(coupons.filter((coupon) => coupon._id !== id));
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Coupons</h1>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search Coupons"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input
          placeholder="New Coupon Code"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />
        <Input
          placeholder="Discount Percentage"
          type="number"
          value={newCoupon.discountPercentage}
          onChange={(e) =>
            setNewCoupon({
              ...newCoupon,
              discountPercentage: parseFloat(e.target.value),
            })
          }
        />
        <Input
          placeholder="Expiry Date"
          type="date"
          value={newCoupon.expiryDate}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
          }
        />
        <Button onClick={handleCreate}>Create Coupon</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoupons.map((coupon) => (
            <TableRow key={coupon._id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.discountPercentage}%</TableCell>
              <TableCell>
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{coupon.isActive ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditCoupon(coupon);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && editCoupon && (
        <Modal
          title="Edit Coupon"
          description="Update the coupon details"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-4">
            <Input
              placeholder="Coupon Code"
              value={editCoupon.code}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, code: e.target.value })
              }
            />
            <Input
              placeholder="Discount Percentage"
              type="number"
              value={editCoupon.discountPercentage}
              onChange={(e) =>
                setEditCoupon({
                  ...editCoupon,
                  discountPercentage: parseFloat(e.target.value),
                })
              }
            />
            <Input
              placeholder="Expiry Date"
              type="date"
              value={
                new Date(editCoupon.expiryDate).toISOString().split("T")[0]
              }
              onChange={(e) =>
                setEditCoupon({
                  ...editCoupon,
                  expiryDate: new Date(e.target.value),
                })
              }
            />
            <div className="flex items-center">
              <label className="mr-2">Active</label>
              <input
                type="checkbox"
                checked={editCoupon.isActive}
                onChange={(e) =>
                  setEditCoupon({
                    ...editCoupon,
                    isActive: e.target.checked,
                  })
                }
              />
            </div>
            <Button onClick={handleUpdate}>Update Coupon</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
