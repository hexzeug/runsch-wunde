import { refreshAndStoreAccessToken, tokens } from './auth';

const BASE_URL = 'https://api.spotify.com/v1';

const request = async (
  path,
  method,
  query,
  body,
  options = {},
  retries = 1
) => {
  const search = query ? '?' + new URLSearchParams(query) : '';
  const url = BASE_URL + path + search;
  const res = await fetch(url, {
    method,
    ...(body && { body }),
    ...options,
    headers: {
      ...(body && { 'Content-Type': 'application/x-www-form-urlencoded' }),
      ...options.headers,
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  const { status, statusText, headers, ok } = res;
  let resBody;
  try {
    resBody = await res.clone().json();
  } catch {
    resBody = await res.text();
  }

  if (ok) {
    return { status, headers, ok, body: resBody };
  }

  switch (status) {
    case 401:
      if (retries === 0) break;
      await refreshAndStoreAccessToken();
      return request(path, method, query, body, options, retries - 1);
    case 503:
      if (retries === 0) break;
      return request(path, method, query, body, options, retries - 1);
    default:
      throw new Error(
        `api request failed (${status} ${statusText}): ${resBody.message}`
      );
  }
};

export const api = {
  search: async (query, offset, pagesize) => {
    const { body } = await request('/search', 'GET', {
      q: query,
      type: 'track',
      offset,
      limit: pagesize,
    });
    return body.tracks;
  },
};