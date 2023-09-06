import { useNavigate } from "react-router-dom";

export const RootPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to Tech test 👋</h1>
      <div>
        <button
          onClick={() => {
            navigate("/users");
          }}
        >
          Users
        </button>
        <button
          onClick={() => {
            navigate("/products");
          }}
        >
          Products
        </button>
      </div>
    </div>
  );
};
