import { log } from "console";

const mockData = {
  status: "success",
  output: "Hello, world!\n",
};

type ResponseData = {
  status: string;
  output: string;
};

type MockResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<ResponseData>;
};

export const fetchMock = (
  language: string,
  code: string
): Promise<MockResponse> => {
  console.log({ language: language, code: code });
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: MockResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve(mockData),
      };

      resolve(response);
    }, 2000);
  });
};
