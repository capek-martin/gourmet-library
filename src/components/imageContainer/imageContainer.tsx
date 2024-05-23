import { Galleria } from "primereact/galleria";
import { RecipeImage } from "../../types/recipe.types";

interface Props {
  images: RecipeImage[];
  onDelete?: (title: string) => void;
}

export const ImageContainer = ({ images, onDelete }: Props) => {
  const itemTemplate = (img: RecipeImage) => {
    return (
      <>
        {onDelete && (
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
            onClick={() => onDelete(img.title)}
          />
        )}
        <img
          src={img.url}
          alt={img.title}
          style={{ maxHeight: "20rem", maxWidth: "30rem", display: "block" }}
        />
      </>
    );
  };

  const ifMultipleImages = images.length > 1 ? true : false;

  return (
    <div className="card m-auto">
      <Galleria
        value={images}
        style={{ maxHeight: "50%" }}
        showThumbnails={false}
        showIndicators={ifMultipleImages}
        showItemNavigators={ifMultipleImages}
        item={itemTemplate}
      />
    </div>
  );
};
