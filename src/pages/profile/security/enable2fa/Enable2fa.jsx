import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../../../../components/loading/LoadingSpinner";

const Enable2fa = () => {
  const { profileData } = useOutletContext();

  if (!profileData) {
    return <LoadingSpinner />;
  }

  const handleSave = (updatedData) => {
    console.log("Saved data:", updatedData);
  };

  return (
    <div className="enable2fa">
      <h2>Activar Verificación en dos pasos</h2>
      <p>Configure la verificación en dos pasos para tu cuenta.</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="enable2fa">Activar Verificación en dos pasos</label>
          <input
            type="checkbox"
            id="enable2fa"
            name="enable2fa"
            checked={profileData.enable2fa}
            onChange={(e) => handleSave({ enable2fa: e.target.checked })}
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default Enable2fa;
