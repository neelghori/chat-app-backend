export const ErrorHandler = ({
  res,
  message,
  data,
  statusCode,
  errors,
}: any) => {
  res.status(statusCode ? statusCode : 400).json({
    status: {
      code: statusCode ? statusCode : 400,
      status: false,
    },
    message: message ? message : "Internal server error! Please try again.",
    data: data || null,
    errors: true,
  });
};

export const responseHandler = ({
  res,
  message,
  data,
  statusCode,
  status,
  errors,
}: any) => {
  res.status(statusCode ? statusCode : 200).json({
    status: {
      code: statusCode ? statusCode : 200,
      status: status ? Boolean(status) : true,
    },
    message: message ? message : "Success",
    data: data || null,
    errors: errors || null,
  });
};
