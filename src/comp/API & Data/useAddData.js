import { startTransition, useLayoutEffect, useState } from "react";
import axios from "axios";
import { countries } from "./countries";

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDateSuffix = date => {
  switch (date) {
    case date % 10 === 1:
      return "st";
    case date % 10 === 2:
      return "nd";
    case date % 10 === 3:
      return "rd";
    default:
      return "th";
  }
};

const convertDate = date => {
  return `${monthList[date.getMonth()]} ${date.getDate()}${getDateSuffix(
    date.getDate()
  )}, ${date.getFullYear()}}`;
};

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
                        ...res.data.production_countries.map(country =>
                          country.iso_3166_1 === "SU"
                            ? "RU"
                            : country.iso_3166_1
                        ),
                      ]),
                    ]
                  : res.data.production_companies.length > 0
                  ? [
                      ...new Set([
                        ...res.data.production_companies
                          .filter(
                            company =>
                              company.origin_country.length > 0 &&
                              company.origin_country !== null
                          )
                          .map(company =>
                            company.origin_country === "SU"
                              ? "RU"
                              : company.origin_country
                          ),
                      ]),
                    ]
                  : undefined;

              const receivedMovieData = {
                studios:
                  res.data.production_companies.length > 0
                    ? res.data.production_companies
                        .filter(
                          (studio, index) =>
                            studio.name.length > 0 &&
                            studio.name !== null &&
                            index < 6
                        )
                        .map(studio => studio.name)
                        .join(", ")
                    : undefined,

                directors:
                  res_cast.data.crew.length > 0
                    ? res_cast.data.crew
                        .filter(crew => crew.job === "Director")
                        .map(crew => crew.name)
                        .join(", ")
                    : undefined,

                casts:
                  res_cast.data.cast.length > 0
                    ? res_cast.data.cast
                        .filter(cast => cast.order < 6)
                        .map(cast => cast.name)
                        .join(", ")
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
                  movieOrigin !== undefined && movieOrigin.length > 0
                    ? movieOrigin.map(origin =>
                        countries
                          .filter(country => country.code === origin)
                          .map(country => country.name)
                          .join(", ")
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
                  : res.data.production_companies.length > 0
                  ? res.data.production_companies
                      .filter(
                        company =>
                          company.origin_country.length > 0 &&
                          company.origin_country !== null
                      )
                      .map(company =>
                        company.origin_country === "SU"
                          ? "RU"
                          : company.origin_country
                      )
                  : res.data.networks.length > 0
                  ? res.data.networks
                      .filter(
                        company =>
                          company.origin_country.length > 0 &&
                          company.origin_country !== null
                      )
                      .map(company =>
                        company.origin_country === "SU"
                          ? "RU"
                          : company.origin_country
                      )
                  : undefined;

              const receivedTVData = {
                directors:
                  res.data.created_by.length !== 0
                    ? res.data.created_by.map(p => p.name).join(", ")
                    : undefined,

                casts:
                  res_cast.data.cast.length > 0
                    ? res_cast.data.cast
                        .filter(cast => cast.order < 6)
                        .map(cast => cast.name)
                        .join(", ")
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
                  tvOrigin !== undefined && tvOrigin.length > 0
                    ? [
                        ...new Set([
                          ...tvOrigin.map(origin =>
                            countries
                              .filter(country => country.code === origin)
                              .map(country => country.name)
                              .join(", ")
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

            case "person":
              const birthday =
                res.data.birthday !== null
                  ? convertDate(new Date(res.data.birthday))
                  : undefined;

              const deathday =
                res.data.deathday !== null
                  ? convertDate(new Date(res.data.deathday))
                  : undefined;

              const job_title =
                res.data.known_for_department !== null
                  ? res.data.known_for_department === "Writing"
                    ? "Writer"
                    : res.data.known_for_department === "Directing"
                    ? "Director"
                    : res.data.known_for_department === "Acting"
                    ? res.data.gender === 1
                      ? "Actress"
                      : "Actor"
                    : res.data.known_for_department === "Production"
                    ? "Producer"
                    : res.known_for_department
                  : undefined;

              const receivedPersonData = {
                birth: birthday,
                death: deathday,
                birthplace:
                  res.data.place_of_birth !== null
                    ? res.data.place_of_birth.length > 0
                      ? res.data.place_of_birth
                      : undefined
                    : undefined,
                biography:
                  res.data.biography !== null
                    ? res.data.biography.length > 0
                      ? res.data.biography
                      : undefined
                    : undefined,
                known_workplace: job_title,
              };

              setData({});
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
