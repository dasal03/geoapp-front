import { Button } from "../ui";
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
            text="Cancelar"
            icon="fas fa-times"
            onClick={onCancel}
            styleType="btn-cancel"
            hideText={hideText}
          />
          <Button
            text="Guardar"
            icon="fas fa-save"
            onClick={onSave}
            styleType="btn-save"
            hideText={hideText}
          />
        </>
      ) : (
        <>
          <Button
            text="Editar"
            icon="fas fa-edit"
            onClick={onEdit}
            styleType="btn-edit"
            hideText={hideText}
          />
          {onDelete && (
            <Button
              text="Eliminar"
              icon="fas fa-trash"
              onClick={onDelete}
              styleType="btn-delete"
              hideText={hideText}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SectionActions;
