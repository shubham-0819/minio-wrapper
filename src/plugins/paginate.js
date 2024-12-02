function paginateResponse(data, page = 1, pageSize = 10) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    data: paginatedData,
  };
}

export default paginateResponse;
