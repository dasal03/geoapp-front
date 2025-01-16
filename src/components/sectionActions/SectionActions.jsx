import Button from "../ui/button/Button";
import "./SectionActions.scss";

const SectionActions = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  hideText = false,
}) => {
  return (
    <div className="section-actions">
      {isEditing ? (
        <>
          <Button
            text={hideText ? "" : "Cancelar"}
            icon="fas fa-times"
            onClick={onCancel}
            styleType="btn-cancel"
          />
          <Button
            text={hideText ? "" : "Guardar"}
            icon="fas fa-save"
            onClick={onSave}
            styleType="btn-save"
          />
        </>
      ) : (
        <>
          <Button
            text={hideText ? "" : "Editar"}
            icon="fas fa-edit"
            onClick={onEdit}
            styleType="btn-edit"
          />
          {onDelete && (
            <Button
              text={hideText ? "" : "Eliminar"}
              icon="fas fa-trash"
              onClick={onDelete}
              styleType="btn-delete"
            />
          )}
        </>
      )}
    </div>
  );
};

export default SectionActions;
