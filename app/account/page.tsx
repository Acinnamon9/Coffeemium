"use client";

import React from "react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AccountPage = () => {
  const handleLogout = () => {
    console.log("Logging out...");
    // TODO: Implement actual logout logic with NextAuth
    alert("Logged out! (Simulated)");
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          My Account
        </h1>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Profile Details
            </h2>
            <p className="text-gray-700">
              <strong>Name:</strong> John Doe
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> john.doe@example.com
            </p>
            {/* TODO: Add an 'Edit Profile' button */}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Order History
            </h2>
            <p className="text-gray-600">
              No orders found yet.{" "}
              <Link href="/shop" className="text-indigo-600 hover:underline">
                Start shopping!
              </Link>
            </p>
            {/* TODO: Display list of past orders */}
            <Link href="/account/orders">
              {/* Placeholder for actual orders list page */}
              <Button variant="outline" className="mt-4">
                View All Orders
              </Button>
            </Link>
          </div>

          <div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
