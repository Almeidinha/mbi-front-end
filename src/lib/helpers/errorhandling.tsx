import axios from "axios";

type ApiError = {
  error: string;
  message: string;
  path: number;
  status: string;
  trace: string;
};

function isApiErrorResponse(res: any): res is ApiError {
  return (
    res &&
    "error" in res &&
    "message" in res &&
    "path" in res &&
    "status" in res &&
    "trace" in res
  );
}

export const handleErrorMessage = (error: unknown) => {
  
  if (!axios.isAxiosError(error)) {
    return "Unknown error";
  }

  if (!error.response) {
    return error.message;
  }

  if (!isApiErrorResponse(error.response.data)) {
    return error.message;
  }

  const message = error.response.data.message;

  return message
};
