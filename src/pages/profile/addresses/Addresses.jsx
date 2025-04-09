import { useNavigate, useSearchParams } from "react-router-dom";
import { useAddressData } from "../../../hooks";
import { AddressSection } from "../../../components";

const Addresses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");

  const { loading, addressesData, deleteAddress, setAsPrimary } =
    useAddressData(userId);

  const handleNavigation = (path, params = "") =>
    navigate(`/profile/${path}?user_id=${userId}${params}`);

  return (
    <AddressSection
      title="Domicilios"
      sectionData={addressesData}
      onCheckChange={setAsPrimary}
      onAddItem={() => handleNavigation("addresses-form")}
      onEditItem={(item) =>
        handleNavigation("addresses-form", `&address_id=${item.address_id}`)
      }
      onDeleteItem={deleteAddress}
      loading={loading}
    />
  );
};

export default Addresses;
