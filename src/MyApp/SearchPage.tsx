import React, { useEffect, useMemo, useState } from "react";

type CatImage = {
  id: number;
  url: string;
};

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number = 500
) => {
  let timeout;

  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

const SearchPage = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value }
    } = e;
    setText(value);
  };

  const handleLoadData = useMemo(
    () =>
      debounce(async (searchText: string, signal: AbortSignal) => {
        setLoading(true);
        setError(false);

        try {
          const res = await fetch(
            "https://api.thecatapi.com/v1/images/search?limit=10",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              },
              signal
            }
          );

          if (!res.ok) throw new Error();

          const data = await res.json();
          console.log(data);
          const mappedData = data.map(({ id, url }) => ({
            id,
            url
          }));
          setData(mappedData);
          setLoading(false);
        } catch (e) {
          setError(true);
          setLoading(false);
          setData([]);
        }
      }),
    []
  );

  useEffect(() => {
    if (!text) return;

    const controller = new AbortController();

    handleLoadData(text, controller.signal);

    return () => controller.abort(); //page unmount time abort network calls.
  }, [text, handleLoadData]);

  return (
    <div>
      Search Page!
      <div>
        <input type="text" onChange={handleSearchText} />
      </div>
      <div>
        {loading && <div>loading</div>}
        {error && <div>error!</div>}
        {data.map((d) => (
          <div key={d.id}>
            id={d.id} url={d.url}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
