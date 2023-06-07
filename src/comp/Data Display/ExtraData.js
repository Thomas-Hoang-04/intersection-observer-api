import { memo, useDeferredValue, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useAddData from "../API & Data/useAddData";
import {
  Flex,
  Text,
  Divider,
  Badge,
  Box,
  useColorMode,
} from "@chakra-ui/react";

export const ExtraTVData = memo(({ id }) => {
  const { colorMode } = useColorMode();

  // Additional data fetching
  const data = useDeferredValue(useAddData(id, "tv"));

  // Due to React bug about Object & Array distinction
  const origins =
    data.fullOrigin !== undefined ? Object.values(data.fullOrigin) : undefined;
  const genres =
    typeof data.genres === "object" && data.genres.length > 0
      ? Object.values(data.genres)
      : undefined;

  return (
    <>
      {data.directors !== undefined && (
        <Flex fontSize={"xl"} gap="0.15rem">
          <Box fontWeight={500} fontStyle={"italic"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Directors:
            </Text>{" "}
            {data.directors}
          </Box>
        </Flex>
      )}
      {data.casts !== undefined && (
        <Flex fontSize={"xl"} gap="0.15rem" mb=".25rem" wrap={"wrap"}>
          <Box fontWeight={500} fontStyle={"italic"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Casts:
            </Text>{" "}
            {data.casts}
          </Box>
        </Flex>
      )}
      <Flex
        fontSize={"xl"}
        gap="0.15rem"
        align={"center"}
        height={"max-content" || "-moz-max-content"}>
        {data.episodes !== "In Production" && data.status !== "Planned" && (
          <>
            {data.seasons !== undefined && (
              <>
                <Box fontWeight={500} fontStyle={"italic"}>
                  <Text
                    fontWeight={700}
                    display={"inline-block"}
                    fontStyle={"initial" || "-moz-initial"}>
                    Current Season:
                  </Text>{" "}
                  {data.episodes !== undefined
                    ? data.episodes.season <= data.seasons &&
                      `Season ${data.episodes.season}`
                    : `Season ${data.seasons}`}
                </Box>
              </>
            )}
            {data.episodes !== undefined && (
              <>
                <Flex h="1.75rem" gap=".4rem">
                  <Divider
                    orientation="vertical"
                    border={"1.75px solid cyan"}
                    ml=".5rem"
                  />
                  <Divider
                    orientation="vertical"
                    border={"1.75px solid cyan"}
                    mr=".5rem"
                  />
                </Flex>
                <Box fontWeight={500} fontStyle={"italic"}>
                  <Text
                    fontWeight={700}
                    display={"inline-block"}
                    fontStyle={"initial" || "-moz-initial"}>
                    Last Episodes:
                  </Text>{" "}
                  Episode {data.episodes.episode}
                </Box>
                <Badge
                  fontSize={"md"}
                  variant={"solid"}
                  bgColor={"#7D79A8"}
                  color={colorMode === "dark" ? "whiteAlpha.900" : null}
                  borderRadius={"100vw"}
                  px=".75rem"
                  py=".3rem"
                  ml=".75rem">
                  Season {data.episodes.season}
                </Badge>
                {data.status === "Ended" && (
                  <Badge
                    fontSize={"md"}
                    variant={"solid"}
                    bgColor={"pink.400"}
                    color={colorMode === "dark" ? "whiteAlpha.800" : null}
                    borderRadius={"100vw"}
                    px=".75rem"
                    py=".3rem"
                    ml=".75rem">
                    Ended
                  </Badge>
                )}
                {(data.status === "Canceled" ||
                  data.status === "Cancelled") && (
                  <Badge
                    fontSize={"md"}
                    variant={"solid"}
                    bgColor={"red.500"}
                    color={colorMode === "dark" ? "whiteAlpha.900" : null}
                    borderRadius={"100vw"}
                    px=".75rem"
                    py=".3rem"
                    ml=".75rem">
                    Canceled
                  </Badge>
                )}
              </>
            )}
          </>
        )}
      </Flex>
      <Flex mt=".4rem" gap="1rem" wrap="wrap">
        {data.episodes !== undefined &&
          data.seasons !== undefined &&
          data.status !== "Ended" &&
          data.episodes.season === data.seasons - 1 && (
            <Badge
              fontSize={"lg"}
              variant={"solid"}
              fontStyle={"italic"}
              fontWeight={700}
              bgColor={"yellow.200"}
              color={colorMode === "dark" && "gray.700"}
              borderRadius={"100vw"}
              px=".75rem"
              py=".3rem">
              Returning for Season {data.seasons}
            </Badge>
          )}
        {data.status === "In Production" && (
          <Badge
            fontSize={"lg"}
            variant={"solid"}
            fontStyle={"italic"}
            fontWeight={700}
            bgColor={"yellow.200"}
            color={colorMode === "dark" && "gray.700"}
            borderRadius={"100vw"}
            px=".75rem"
            py=".3rem">
            In Production
          </Badge>
        )}
        {data.status === "Planned" && (
          <Badge
            fontSize={"lg"}
            variant={"solid"}
            bgColor={"green.200"}
            fontStyle={"italic"}
            fontWeight={700}
            color={colorMode === "dark" && "gray.700"}
            borderRadius={"100vw"}
            px=".75rem"
            py=".3rem">
            Planned
          </Badge>
        )}
        {origins !== undefined &&
          origins.map(origin => {
            return (
              <Badge
                key={uuidv4()}
                fontSize={"lg"}
                bgColor={"#00AAB9"}
                color={colorMode === "dark" ? "whiteAlpha.900" : null}
                variant={"solid"}
                borderRadius={"100vw"}
                px=".75rem"
                py=".3rem">
                {origin}
              </Badge>
            );
          })}
        {genres !== undefined &&
          genres.map(genre => {
            return (
              <Badge
                key={uuidv4()}
                fontSize={"lg"}
                colorScheme="orange"
                color={colorMode === "dark" ? "whiteAlpha.900" : null}
                variant={"solid"}
                borderRadius={"100vw"}
                px=".75rem"
                py=".3rem">
                {genre}
              </Badge>
            );
          })}
      </Flex>
      {data.tagline !== undefined && (
        <Text mt=".5rem" fontStyle={"italic"} fontSize={"lg"}>
          {data.tagline.includes(`"`) ? `${data.tagline}` : `"${data.tagline}"`}
        </Text>
      )}
    </>
  );
});

export const ExtraMovieData = memo(({ id }) => {
  const { colorMode } = useColorMode();

  // Additional data fetching
  const data = useDeferredValue(useAddData(id, "movie"));

  useEffect(() => {
    console.log(data);
  }, [data]);

  const directors =
    data.directors !== undefined && data.directors.length > 0
      ? data.directors
      : undefined;

  // Due to React bug about Object & Array distinction
  const origin =
    typeof data.fullOrigin === "string"
      ? data.fullOrigin
      : typeof data.fullOrigin === "object"
      ? Object.values(data.fullOrigin)
      : undefined;

  const genres =
    typeof data.genres === "object" && data.genres.length > 0
      ? Object.values(data.genres)
      : undefined;

  return (
    <>
      {data.studio !== undefined && (
        <Flex fontSize={"xl"} gap="0.15rem" wrap="wrap">
          <Box fontWeight={500} fontStyle={"italic"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Created By:
            </Text>{" "}
            {data.studio}
          </Box>
        </Flex>
      )}
      {directors !== undefined && (
        <Flex fontSize={"xl"} gap="0.15rem">
          <Box fontWeight={500} fontStyle={"italic"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Directors:
            </Text>{" "}
            {data.directors}
          </Box>
        </Flex>
      )}
      {data.casts !== undefined && (
        <Flex fontSize={"xl"} gap="0.15rem" mb=".25rem" wrap={"wrap"}>
          <Box fontWeight={500} fontStyle={"italic"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Casts:
            </Text>{" "}
            {data.casts}
          </Box>
        </Flex>
      )}
      {data.runtime !== undefined && (
        <Flex fontSize={"xl"} gap="0.15rem">
          <Box fontWeight={500} fontStyle={"italic"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Duration:
            </Text>{" "}
            {data.runtime}
          </Box>
        </Flex>
      )}
      <Flex mt=".4rem" gap="1rem" wrap="wrap">
        {data.status === "In Production" && (
          <Badge
            fontSize={"lg"}
            variant={"solid"}
            fontStyle={"italic"}
            fontWeight={700}
            bgColor={"yellow.200"}
            color={colorMode === "dark" && "gray.700"}
            borderRadius={"100vw"}
            px=".75rem"
            py=".3rem">
            In Production
          </Badge>
        )}
        {data.status === "Post Production" && (
          <Badge
            fontSize={"lg"}
            variant={"solid"}
            fontStyle={"italic"}
            fontWeight={700}
            bgColor={"orange.200"}
            color={colorMode === "dark" && "blackAlpha.800"}
            borderRadius={"100vw"}
            px=".75rem"
            py=".3rem">
            Post Production
          </Badge>
        )}
        {data.status === "Planned" && (
          <Badge
            fontSize={"lg"}
            variant={"solid"}
            bgColor={"green.200"}
            fontStyle={"italic"}
            fontWeight={700}
            color={colorMode === "dark" && "gray.700"}
            borderRadius={"100vw"}
            px=".75rem"
            py=".3rem">
            Planned
          </Badge>
        )}
        {typeof origin === "string" && (
          <Badge
            fontSize={"lg"}
            bgColor={"#00AAB9"}
            color={colorMode === "dark" ? "whiteAlpha.900" : null}
            variant={"solid"}
            borderRadius={"100vw"}
            px=".75rem"
            py=".3rem">
            {origin}
          </Badge>
        )}
        {typeof origin !== "string" &&
          origin !== undefined &&
          Object.values(origin).map(origin => {
            return (
              <Badge
                key={uuidv4()}
                fontSize={"lg"}
                bgColor={"#00AAB9"}
                color={colorMode === "dark" ? "whiteAlpha.900" : null}
                variant={"solid"}
                borderRadius={"100vw"}
                px=".75rem"
                py=".3rem">
                {origin}
              </Badge>
            );
          })}
        {genres !== undefined &&
          genres.map(genre => {
            return (
              <Badge
                key={uuidv4()}
                fontSize={"lg"}
                colorScheme="orange"
                color={colorMode === "dark" ? "whiteAlpha.900" : null}
                variant={"solid"}
                borderRadius={"100vw"}
                px=".75rem"
                py=".3rem">
                {genre}
              </Badge>
            );
          })}
      </Flex>
      {data.tagline !== undefined && (
        <Text mt=".5rem" fontStyle={"italic"} fontSize={"lg"}>
          {data.tagline.includes(`"`) ? `${data.tagline}` : `"${data.tagline}"`}
        </Text>
      )}
    </>
  );
});
