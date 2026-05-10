"use client";

import React from 'react';
import Header from '@/components/Header';
import AdminMapEditor from '@/components/AdminMapEditor';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white pb-12">
      <Header />
      <AdminMapEditor />
    </main>
  );
}
