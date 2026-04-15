 import { useEffect, useState } from "react";
import adminService from "../services/adminService";

import PendingCreatorsList from "../components/admin/PendingCreatorsList";
import PendingGroupsList from "../components/admin/PendingGroupsList";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function AdminDashboardPage() {
  const [creators, setCreators] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const creatorsData = await adminService.getPendingCreators();
      const groupsData = await adminService.getPendingGroups();

      setCreators(creatorsData);
      setGroups(groupsData);
    } catch (error) {
      console.warn("Using mock admin data");

      // 🔸 fallback mock data
      setCreators([
        { id: 1, name: "Bavly Aziz" },
        { id: 2, name: "John Doe" },
      ]);

      setGroups([
        { id: 1, name: "Math Group" },
        { id: 2, name: "AI Study Group" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Approve group
  const handleApprove = async (groupId) => {
    try {
      await adminService.approveGroup(groupId);

      // remove approved group from list
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch {
      // fallback
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* 👤 Pending Creators */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Pending Creators</h3>
        <PendingCreatorsList creators={creators} />
      </div>

      {/* 📚 Pending Groups */}
      <div>
        <h3>Pending Groups</h3>
        <PendingGroupsList groups={groups} onApprove={handleApprove} />
      </div>
    </div>
  );
}
