import isString from "lodash/isString";

const SUCCESS_STATUSES = [200, 201];

const throwError = (status: number, statusText: string) => {
  throw new Error(`Request Failed! status = ${status}, text = ${statusText}`);
};

const requestGet = (url: string) => request(url, null, true, "GET");

const request = (url: string, data: any, cors = true, method = "POST") => {
  const headers = new Headers();

  if (isString(data)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    method,
    body: data,
    mode: cors ? "cors" : undefined,
    headers,
  })
    .then((response) => {
      const { status, statusText } = response;
      console.log("REQUEST RESPONSE", { status, statusText });
      return SUCCESS_STATUSES.includes(status)
        ? response.json().then((jsonRes) => ({ jsonRes, response }))
        : throwError(status, statusText);
    })
    .then(({ jsonRes, response }) => {
      console.log("SERVER RESPONSE !!!!! ", jsonRes);
      return {
        success: true,
        serverResponse: jsonRes,
        headers: response.headers,
      };
    })
    .catch((ex) => {
      return {
        success: false,
        error: ex,
      };
    });
};

export { request, requestGet };
