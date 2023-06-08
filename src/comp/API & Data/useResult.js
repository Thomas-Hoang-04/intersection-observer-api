import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useImmer } from "use-immer";

export default function useResult(type, query, page, year = undefined) {
  const [data, setData] = useImmer([]);
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [noResult, setNoResult] = useState("false");

  const releaseYear = useMemo(
    () =>
      isNaN(year)
        ? {}
        : type === "movie"
        ? { primary_release_year: year }
        : type === "tv"
        ? { first_air_date_year: year }
        : {},
    [year, type]
  );

  useEffect(() => {
    setData([]);
  }, [query, type, year, setData]);

  useEffect(() => {
    let cancel;
    if (query && type) {
      isLoading(true);
      setError(false);
      setNoResult("false");
      cancel = setTimeout(
        () => {
          axios
            .request({
              method: "GET",
              url: `https://api.themoviedb.org/3/search/${type}`,
              params: {
                ...releaseYear,
                query: query,
                include_adult: "false",
                language: "en-US",
                page: page,
              },
              headers: {
                accept: "application/json",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzEzODY1MWM4M2I5ZjAyYjBjM2I5MDVhZWNmMjE4OCIsInN1YiI6IjY0NmUwY2NlMzNhMzc2MDE3NWQ0ZTEyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RPu_qlwS0cBOYK3e_kcJR2AOvDa6rN5rZ8mM6drK-wY",
              },
            })
            .then(res => {
              //eslint-disable-next-line
              const filteredData = res.data.results.map(result => {
                switch (type) {
                  case "movie":
                    return {
                      id: result.id,
                      title: result.title,
                      year: result.release_date.slice(0, 4),
                      poster: result.poster_path,
                      overview: result.overview,
                    };
                  case "tv":
                    return {
                      id: result.id,
                      title: result.name,
                      year: result.first_air_date.slice(0, 4),
                      poster: result.poster_path,
                      overview: result.overview,
                    };
                  case "person":
                    return {
                      id: result.id,
                      name: result.name,
                      gender: result.gender === 1 ? "Female" : "Male",
                      picture: result.profile_path,
                      works:
                        result.known_for.length > 0
                          ? result.known_for
                              .map(known_works => {
                                let title =
                                  known_works.media_type === "movie"
                                    ? known_works.title
                                    : known_works.media_type === "tv"
                                    ? known_works.name
                                    : undefined;
                                let year =
                                  known_works.media_type === "movie"
                                    ? known_works.release_date.slice(0, 4)
                                    : known_works.media_type === "tv"
                                    ? known_works.first_air_date.slice(0, 4)
                                    : undefined;
                                return `${title}${
                                  year !== undefined && year.length > 0
                                    ? ` (${year})`
                                    : ""
                                }`;
                              })
                              .join(", ")
                          : undefined,
                    };
                  default:
                    break;
                }
              });
              if (filteredData.length === 0) setNoResult("true");
              setData(draft => {
                draft.push(...filteredData);
              });

              setHasMore(page < res.data.total_pages);
              isLoading(false);
            })
            .catch(e => {
              if (axios.isCancel(e)) return;
              setError(true);
            });
        },
        page === 1 ? 1500 : 1000
      );
    }
    return () => clearTimeout(cancel);
  }, [type, query, page, error, releaseYear, setData]);
  return { loading, data, error, hasMore, noResult };
}
