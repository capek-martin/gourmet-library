import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.style.scss";

interface Props {
  value: string;
  onChange: (t: string) => void;
  toolbarOptionsExt?: any;
}

/**
 * Text editor component - using react-quill  library
 */
export const TextEditor = ({ value, onChange, toolbarOptionsExt }: Props) => {
  const [inputValue, setInputValue] = useState<string>(value ?? "");

  // toolbar options
  const toolbarOptions = [
    ["bold", "italic", "underline"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    [],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
  ];

  useEffect(() => {
    onChange(inputValue);
  }, [inputValue]);

  return (
    <div className="text-editor" style={{ height: "auto" }}>
      <ReactQuill
        className={`dark`}
        onChange={setInputValue}
        modules={{
          toolbar: toolbarOptionsExt ?? toolbarOptions,
        }}
        theme="snow"
        value={inputValue}
      />
    </div>
  );
};
