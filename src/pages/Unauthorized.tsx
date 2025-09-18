import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div>
      <h2>This is Unauthorized component</h2>
      <Link to="/">Home</Link>
    </div>
  );
};

export default Unauthorized;
