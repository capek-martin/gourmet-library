import { ProgressSpinner } from "primereact/progressspinner";

export const Loader = () => {
  return (
    <div className="h-30rem text-center flex align-items-center">
      <ProgressSpinner />
    </div>
  );
};
