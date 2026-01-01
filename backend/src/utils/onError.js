export const onError = (res, error) => {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  };