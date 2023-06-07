import { startTransition, useLayoutEffect, useState } from "react";
import axios from "axios";
import { countries } from "./countries";

export default function useAddData(id, type) {
  const [data, setData] = useState({});

  useLayoutEffect(() => {
    axios
      .all([
        axios({
          method: "GET",
          url: `https://api.themoviedb.org/3/${type}/${id}`,
          params: {
            language: "en-US",
            include_adult: "false",
          },
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzEzODY1MWM4M2I5ZjAyYjBjM2I5MDVhZWNmMjE4OCIsInN1YiI6IjY0NmUwY2NlMzNhMzc2MDE3NWQ0ZTEyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RPu_qlwS0cBOYK3e_kcJR2AOvDa6rN5rZ8mM6drK-wY",
          },
        }),
        type !== "person" &&
          axios({
            method: "GET",
            url: `https://api.themoviedb.org/3/${type}/${id}/credits`,
            params: {
              language: "en-US",
            },
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzEzODY1MWM4M2I5ZjAyYjBjM2I5MDVhZWNmMjE4OCIsInN1YiI6IjY0NmUwY2NlMzNhMzc2MDE3NWQ0ZTEyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RPu_qlwS0cBOYK3e_kcJR2AOvDa6rN5rZ8mM6drK-wY",
            },
          }),
      ])
      .then(
        axios.spread((res, res_cast) => {
          switch (type) {
            case "movie":
              const movieOrigin =
                res.data.production_countries.length > 0
                  ? [
                      ...new Set([
                        ...res.data.production_countries.map(
                          country => country.iso_3166_1
                        ),
                      ]),
                    ]
                  : res.data.production_companies.length > 0
                  ? [
                      ...new Set([
                        ...res.data.production_companies.map(
                          company => company.origin_country
                        ),
                      ]),
                    ]
                  : undefined;

              const receivedMovieData = {
                studio:
                  res.data.production_companies.length === 1 ? null : undefined,

                directors:
                  res_cast.data.crew.length > 0
                    ? res_cast.data.crew
                        .filter(crew => crew.job === "Director")
                        .map(crew => crew.name)
                        .reduce(
                          (total, current, currentIndex, arr) =>
                            total +
                            `${
                              currentIndex === arr.length - 1
                                ? `${current}`
                                : `${current}, `
                            }`,
                          ""
                        )
                    : undefined,

                casts:
                  res_cast.data.cast.length > 0
                    ? res_cast.data.cast
                        .filter(cast => cast.order < 6)
                        .map(cast => cast.name)
                        .reduce(
                          (total, current, currentIndex, arr) =>
                            total +
                            `${
                              currentIndex === arr.length - 1
                                ? `${current}`
                                : `${current}, `
                            }`,
                          ""
                        )
                    : undefined,

                runtime:
                  res.data.runtime !== null && res.data.runtime > 0
                    ? res.data.runtime < 60
                      ? `${res.data.runtime % 60} ${
                          res.data.runtime === 1 ? "minute" : "minutes"
                        }`
                      : res.data.runtime % 60 === 0
                      ? `${res.data.runtime / 60} hours`
                      : `${Math.floor(res.data.runtime / 60)} hours ${
                          res.data.runtime % 60
                        } ${res.data.runtime % 60 === 1 ? "minute" : "minutes"}`
                    : undefined,

                genres: res.data.genres.map(g => g.name),

                fullOrigin:
                  movieOrigin !== undefined
                    ? movieOrigin.map(
                        origin =>
                          countries.filter(
                            country => country.code === origin
                          )[0].name
                      )
                    : undefined,

                tagline:
                  res.data.tagline.length !== 0 ? res.data.tagline : undefined,

                status: res.data.status,
              };
              startTransition(() => setData(receivedMovieData));
              break;
            case "tv":
              const tvOrigin =
                res.data.origin_country.length > 0
                  ? res.data.origin_country
                  : res.data.production_companies.length !== 0
                  ? res.data.production_companies[0].origin_country
                  : res.data.networks.length !== 0
                  ? res.data.networks[0].origin_country.length > 0
                    ? res.data.networks[0].origin_country
                    : undefined
                  : undefined;

              const receivedTVData = {
                directors:
                  res.data.created_by.length !== 0
                    ? res.data.created_by
                        .map(p => p.name)
                        .reduce(
                          (total, current, currentIndex, arr) =>
                            total +
                            `${
                              currentIndex === arr.length - 1
                                ? `${current}`
                                : `${current}, `
                            }`,
                          ""
                        )
                    : undefined,

                casts:
                  res_cast.data.cast.length > 0
                    ? res_cast.data.cast
                        .filter(cast => cast.order < 6)
                        .map(cast => cast.name)
                        .reduce(
                          (total, current, currentIndex, arr) =>
                            total +
                            `${
                              currentIndex === arr.length - 1
                                ? `${current}`
                                : `${current}, `
                            }`,
                          ""
                        )
                    : undefined,

                genres: res.data.genres.map(g => g.name),

                episodes:
                  res.data.last_episode_to_air === null &&
                  res.data.in_production
                    ? "In Production"
                    : res.data.last_episode_to_air !== null
                    ? {
                        episode: `${res.data.last_episode_to_air.episode_number}`,
                        season: res.data.last_episode_to_air.season_number,
                      }
                    : undefined,

                seasons:
                  res.data.seasons.length > 0
                    ? `${
                        res.data.seasons.filter(
                          season =>
                            season.name.includes("Season") ||
                            !season.name.includes("Specials")
                        ).length
                      }`
                    : res.data.last_episode_to_air !== null
                    ? res.data.last_episode_to_air.season_number
                    : undefined,

                fullOrigin:
                  tvOrigin !== undefined
                    ? [
                        ...new Set([
                          ...tvOrigin.map(
                            origin =>
                              countries.filter(
                                country => country.code === origin
                              )[0].name
                          ),
                        ]),
                      ]
                    : undefined,

                tagline:
                  res.data.tagline.length !== 0 ? res.data.tagline : undefined,

                status: res.data.status,
              };
              startTransition(() => setData(receivedTVData));
              break;
            default:
              break;
          }
        })
      )
      .catch(err => console.log(err));
  }, [id, type, setData]);

  return data;
}
