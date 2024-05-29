export const enumToArray = (enumObj: any): string[] => {
  return Object.keys(enumObj).map((key) => enumObj[key]);
};

export const convertToMinutes = (timeStr: string) => {
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  } catch (error) {
    return null;
  }
};

export const convertToTime = (totalMinutes?: number) => {
  if (!totalMinutes || totalMinutes < 0) return;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

export const formatTime = (min?: number) => {
  if (!min) return "unknown";
  if (min < 60) {
    return `${min} min`;
  } else {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
  }
};

export const arrayToString = (arr: string[], separator: string) => {
  if (!arr) return;
  if (typeof arr === "string") return arr;
  let item: string = "";
  arr.map((i, index: number) => {
    item += index === 0 ? i : separator + i;
  });
  return item;
};

export const extractErrorMessage = (error: any) => {
  if (error.response && error.response.data && error.response.data.errors) {
    // Extract the first error message from the array
    const errorMessage = error.response.data.errors[0];
    // Remove unnecessary characters from the error message and trim whitespace
    const cleanedErrorMessage = errorMessage.replace(/['\[\]]/g, "").trim();
    // Capitalize the first letter of the error message
    return (
      cleanedErrorMessage.charAt(0).toUpperCase() + cleanedErrorMessage.slice(1)
    );
  } else {
    // If the error format is unexpected, return a generic error message
    return "An error occurred";
  }
};

// function to check if string is valid email address
export const isValidEmail = (email: string) => {
  const pattern = /^[\w\.-]+@[\w\.-]+\.[\w]{2,}$/;
  return pattern.test(email);
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};
