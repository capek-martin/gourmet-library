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
    [{ direction: "rtl" }], // text direction
    [],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
  ];

  useEffect(() => {
    onChange(inputValue);
  }, [inputValue]);

  const editorHeight = "15rem";

  useEffect(() => {
    const observer = new MutationObserver(() => {
      onChange(inputValue);
    });
    const editor = document.querySelector(".text-editor");
    if (editor) {
      observer.observe(editor, { subtree: true, childList: true });
    }
    return () => {
      observer.disconnect();
    };
  }, [inputValue, onChange]);

  return (
    <div className="text-editor" style={{ height: editorHeight }}>
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
