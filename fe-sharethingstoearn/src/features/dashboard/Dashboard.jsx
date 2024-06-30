import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, profileDate } = useAuth();
  const navigate = useNavigate();

  const handleProductivity = () => {
    if (isAuthenticated) {
      if (profileDate?.role === "Admin") {
        navigate("/users");
      } else {
        navigate("/products");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <div class="display-header-wrapper mb-5">
        <div class="text-content">
          <div className="inside-text-content">
            <h1>Unlock the Potential of Your Unused Items</h1>
            <p>
              Rent out your idle belongings and earn extra income effortlessly
              with ShareThingsforRent.
            </p>
            <button onClick={handleProductivity}>
              Shop Ideal Items -{">"} !
            </button>
          </div>
        </div>
        <div class="image-content"></div>
      </div>
    </div>
  );
};

export default Dashboard;
