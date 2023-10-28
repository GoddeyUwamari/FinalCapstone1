/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const reservationsApiRoute = `${API_BASE_URL}/reservations`;
const tablesApiRoute = `${API_BASE_URL}/tables`;

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(reservationsApiRoute);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//Fetch tables
export const fetchTables = async (signal) => {
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(tablesApiRoute, options);
};

// fetch all reservations
export const fetchReservations = async (signal) => {
  const options = {
    method: "GET",
    headers,
    signal,
  };
  const res = await fetchJson(reservationsApiRoute, options);
  return res;
};

// fetch all reservations
export const fetchReservationsById = async (id, signal) => {
  const options = {
    method: "GET",
    headers,
    signal,
  };
  const res = await fetchJson(`${reservationsApiRoute}/${id}`, options);
  return res;
};

// Create reservation
export const postReservation = async (data, cb, signal) => {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };

  const res = await fetchJson(reservationsApiRoute, options);

  return cb(!!res);
};

// Update reservation
export const updateReservation = async (data, id, cb, signal) => {
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };

  const res = await fetchJson(`${reservationsApiRoute}/${id}`, options);

  return cb(!!res);
};

//Create table
export const postTable = async (data, cb, signal) => {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };

  const res = await fetchJson(tablesApiRoute, options);
  return cb(!!res);
};

// Update reservation status
export const updateReservationStatus = async (
  status,
  reservation_id,
  cb,
  signal
) => {
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status } }),
    signal,
  };

  const res = await fetchJson(
    `${reservationsApiRoute}/${reservation_id}/status`,
    options
  );
  return cb(!!res);
};

//Update table status
export const updateTableStatus = async (
  reservation_id,
  table_id,
  cb,
  signal
) => {
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };

  const res = await fetchJson(`${tablesApiRoute}/${table_id}/seat`, options);
  return cb(!!res);
};

// Get table
export const fetchTableById = async (table_id, signal) => {
  const options = {
    method: "GET",
    headers,
    signal,
  };
  const res = await fetchJson(`${tablesApiRoute}/${table_id}`, options);
  return res;
};

//Finish table
export const finishTable = async (table_id, cb, signal) => {
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  const res = await fetchJson(`${tablesApiRoute}/${table_id}/seat`, options);
  return cb(!!res);
};
