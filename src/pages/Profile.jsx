import React from "react";
import PageHeading from "../components/ui/PageHeading";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function Profile() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeading>Profile</PageHeading>
      <Button
        type="danger"
        onClick={() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("portfolio_summary");

          navigate("/signin");
          toast.success("Logged out successfully");
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default Profile;
