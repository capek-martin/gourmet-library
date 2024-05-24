import { Galleria } from "primereact/galleria";
import foodPlaceholder from "../../food-placeholder.jpg";
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
          <i
            className="pi pi-times"
            style={{
              fontSize: "2rem",
              position: "absolute",
              cursor: "pointer",
              right: 10,
              top: 10,
              color: "red",
            }}
            onClick={() => imageTitle && onDelete(imageTitle)}
          />
        )}
        <img src={url} alt={imageTitle} className="max-h-20rem max-w-20rem md:max-w-full md:max-h-full" />
      </>
    );
  };

  const ifMultipleImages = imgUrls.length > 1 ? true : false;

  return (
    <div className="card mx-auto shadow-md">
      <Galleria
        value={imgUrls.length > 0 ? imgUrls : [foodPlaceholder]}
        showThumbnails={false}
        showIndicators={ifMultipleImages}
        showItemNavigators={ifMultipleImages}
        item={itemTemplate}
      />
    </div>
  );
};
