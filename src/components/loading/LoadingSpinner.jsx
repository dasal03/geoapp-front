import { ThreeDots } from "react-loader-spinner";

function Loader() {
  return (
    <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="#2c3e50"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}

export default Loader;