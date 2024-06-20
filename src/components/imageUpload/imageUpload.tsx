import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface Props {
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
}

export const ImageUpload = ({ setSelectedFiles }: Props) => {
  const [currentFiles, setCurrentFiles] = useState<File[]>();
  const fileUploadRef = useRef<any>(null);

  const headerTemplate = (options: any) => {
    const { className, chooseButton, cancelButton } = options;

    return (
      <div
        className={className}
        style={{
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-1"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const handleSelect = (e: any) => {
    setCurrentFiles(e.files);
    setSelectedFiles(e.files);
  };
  const handleClear = () => {
    setCurrentFiles([]);
    setSelectedFiles([]);
  };

  const handleRemove = (e: any) => {
    if (!e.file) return;
    const updatedArr = currentFiles?.filter((f) => f.name != e.file.name);
    if (updatedArr) {
      setCurrentFiles(updatedArr);
      setSelectedFiles(updatedArr);
    }
  };

  return (
    <div>
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        multiple
        onSelect={handleSelect}
        onRemove={handleRemove}
        accept="image/*"
        maxFileSize={1000000}
        onClear={handleClear}
        headerTemplate={headerTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        cancelOptions={cancelOptions}
      />
    </div>
  );
};
