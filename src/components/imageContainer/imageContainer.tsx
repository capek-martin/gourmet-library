import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
interface Props {
  imgUrls: string[];
  onDelete?: (title: string) => void;
}

export const ImageContainer = ({ imgUrls, onDelete }: Props) => {
  const itemTemplate = (url: string) => {
    const imageTitle = url.split("/").pop();
    return (
      <>
        {onDelete && imgUrls.length > 0 && (
          <Button
            onClick={() => imageTitle && onDelete(imageTitle)}
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger absolute top-0 right-0 m-2"
          />
        )}
        <img
          src={url}
          alt={imageTitle}
          className="max-h-20rem max-w-20rem md:max-w-full md:max-h-30rem"
        />
      </>
    );
  };

  const ifMultipleImages = imgUrls.length > 1 ? true : false;
  if (!imgUrls) return;
  return (
    <div className="card">
      <Galleria
        value={imgUrls}
        showThumbnails={false}
        showIndicators={ifMultipleImages}
        showItemNavigators={ifMultipleImages}
        item={itemTemplate}
      />
    </div>
  );
};
