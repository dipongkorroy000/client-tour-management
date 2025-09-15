import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div>
      <h2>This is admin layout component</h2>
      <Outlet></Outlet>
    </div>
  );
};

export default AdminLayout;
