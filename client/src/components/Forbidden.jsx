// import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  // const navigate = useNavigate();
  return (
    <div className="wrap">
      <h2>Forbidden</h2>
      <p>Oh oh! You can&apos;t access this page.</p>
      {/* <button onClick={() => navigate(-1)}>Go Back</button> */}
    </div>
  );
};
export default Forbidden;
