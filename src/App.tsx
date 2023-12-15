import { JSX, useState, useEffect } from "react";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { Options , Quote , Response , Config } from "./model/model"
import Content from "./components/Card";

const { env: { URL, X_RapidAPI_Key, X_RapidAPI_Host }}: NodeJS.Process = process;

const options: Options = {
  method: "GET",
  url: URL as string,
  headers: {
    "X-RapidAPI-Key": X_RapidAPI_Key as string,
    "X-RapidAPI-Host": X_RapidAPI_Host as string,
  },
};

const App = (): JSX.Element => {
  const [quote, setQuote] = useState<Quote>({
    id: 0,
    originator: {
      id: 0,
      language_code: "",
      description: "",
      master_id: 0,
      name: "",
      url: "",
    },
    language_code: "",
    content: "",
    url: "",
    tags: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);

  const controller: AbortController = new AbortController();
  const fetchData = async (): Promise<void> => {
    try {
      setLoading((l: boolean): boolean => !l);
      const response: AxiosResponse<Response, Config> = await axios.request(
        options
      );
      const { data, status }: AxiosResponse<Response, Config> = response;
      if (status === HttpStatusCode.Ok) {
        setQuote(data);
      } else {
        throw new Error("something went wrong!");
      }
    } catch (err: any) {
      throw new Error(err);
    } finally {
      setLoading((l: boolean): boolean => !l);
      setClick(false);
    }
  };

  useEffect(() => {
    fetchData();

    return (): void => {
      controller.abort();
    };
  }, [click]);

  return (
    <>
      <Content content={quote as Quote} loading={loading} setClick={setClick} />
    </>
  );
};

export default App;