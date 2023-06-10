import {
  forwardRef,
  useState,
  memo,
  useRef,
  useLayoutEffect,
  lazy,
  Suspense,
  useDeferredValue,
  useEffect,
  startTransition,
} from "react";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Skeleton,
  Text,
  useColorMode,
  Divider,
  Badge,
} from "@chakra-ui/react";

import default_poster from "../../assets/images/default_poster.jpg";

import default_male_profile from "../../assets/images/default_male_profile.png";
import default_female_profile from "../../assets/images/default_female_profile.png";

import useAddData from "../API & Data/useAddData";

import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import axios from "axios";

// Lazy loading
const ExtraTVData = lazy(() =>
  import("./ExtraData")
    .then(module => ({ default: module.ExtraTVData }))
    .catch(err => console.log(err))
);

const ExtraMovieData = lazy(() =>
  import("./ExtraData")
    .then(module => ({ default: module.ExtraMovieData }))
    .catch(err => console.log(err))
);

export const TVSeriesData = memo(
  forwardRef(({ title, year, overview, poster, id }, ref) => {
    // Dark Mode Management
    const { colorMode } = useColorMode();

    // Manage overflow data
    const overviewRef = useRef(null);
    const [overviewHeight, setOverviewHeight] = useState(0);

    useLayoutEffect(() => {
      setOverviewHeight(overviewRef.current.scrollHeight);
    }, []);

    // Control text overflow
    const [expand, isExpand] = useState(false);

    return (
      <Grid
        p="1rem"
        w="72rem"
        background={colorMode === "dark" ? "teal.700" : "teal.50"}
        borderRadius={`1.5rem`}
        templateColumns={"350px auto"}
        columnGap={`1.5rem`}
        rowGap={`.75rem`}
        ref={ref}
        boxShadow={
          colorMode === "dark"
            ? `.35rem .35rem .2rem .1rem #1D4044, -.15rem -.15rem 0 0 #1D4044`
            : `.35rem .35rem .2rem .1rem #81E6D9, -.15rem -.15rem 0 0 #81E6D9`
        }
        my="2rem">
        <GridItem>
          <Image
            borderRadius={`1rem`}
            src={
              poster
                ? `https://image.tmdb.org/t/p/w500${poster}`
                : default_poster
            }
            alt={`${title} poster`}
            boxShadow={"xl"}
          />
        </GridItem>
        <GridItem>
          <Flex direction={`column`} gap={`.5rem`}>
            <Heading fontSize={"4.25xl"}>{title}</Heading>
            <Text fontStyle={`italic`} fontSize={`3xl`} fontWeight={700}>
              {year}
            </Text>
            <Suspense fallback={<Skeleton></Skeleton>}>
              <ExtraTVData id={id} />
            </Suspense>
          </Flex>
          <Collapse
            startingHeight={
              overviewHeight > 16 * 8.2 ? `8.2rem` : `${overviewHeight + 20}px`
            }
            in={expand}
            animateOpacity>
            <Text
              mt=".75rem"
              fontSize={`xl`}
              fontWeight={600}
              ref={overviewRef}>
              {overview}
            </Text>
          </Collapse>
          {overviewHeight > 16 * 8.2 && (
            <Button
              leftIcon={
                expand ? (
                  <SmallCloseIcon boxSize={7} />
                ) : (
                  <SmallAddIcon boxSize={7} />
                )
              }
              variant={`outline`}
              colorScheme="orange"
              my=".75rem"
              fontSize={"lg"}
              onClick={() => isExpand(!expand)}>
              {!expand ? "Expand" : "Collapse"}
            </Button>
          )}
        </GridItem>
      </Grid>
    );
  })
);

export const MotionPicsData = memo(
  forwardRef(({ title, year, overview, poster, id }, ref) => {
    // Dark Mode Management
    const { colorMode } = useColorMode();

    // Manage overflow data
    const overviewRef = useRef(null);
    const [overviewHeight, setOverviewHeight] = useState(0);

    useLayoutEffect(() => {
      setOverviewHeight(overviewRef.current.scrollHeight);
    }, []);

    // Control text overflow
    const [expand, isExpand] = useState(false);

    return (
      <Grid
        p="1rem"
        w="72rem"
        background={colorMode === "dark" ? "teal.700" : "teal.50"}
        borderRadius={`1.5rem`}
        templateColumns={"350px auto"}
        columnGap={`1.5rem`}
        rowGap={`.75rem`}
        ref={ref}
        boxShadow={
          colorMode === "dark"
            ? `.35rem .35rem .2rem .1rem #1D4044, -.15rem -.15rem 0 0 #1D4044`
            : `.35rem .35rem .2rem .1rem #81E6D9, -.15rem -.15rem 0 0 #81E6D9`
        }
        my="2rem">
        <GridItem>
          <Image
            borderRadius={`1rem`}
            src={
              poster
                ? `https://image.tmdb.org/t/p/w500${poster}`
                : default_poster
            }
            alt={`${title} poster`}
            boxShadow={"xl"}
          />
        </GridItem>
        <GridItem>
          <Flex direction={`column`} gap={`.5rem`}>
            <Heading fontSize={"4.25xl"}>{title}</Heading>
            <Text fontStyle={`italic`} fontSize={`3xl`} fontWeight={700}>
              {year}
            </Text>
            <Suspense fallback={<Skeleton></Skeleton>}>
              <ExtraMovieData id={id} />
            </Suspense>
          </Flex>
          <Collapse
            startingHeight={
              overviewHeight > 16 * 8.2 ? `8.2rem` : `${overviewHeight + 20}px`
            }
            in={expand}
            animateOpacity>
            <Text
              mt=".75rem"
              fontSize={`xl`}
              fontWeight={600}
              ref={overviewRef}>
              {overview}
            </Text>
          </Collapse>
          {overviewHeight > 16 * 8.2 && (
            <Button
              leftIcon={
                expand ? (
                  <SmallCloseIcon boxSize={7} />
                ) : (
                  <SmallAddIcon boxSize={7} />
                )
              }
              variant={`outline`}
              colorScheme="orange"
              my=".75rem"
              fontSize={"lg"}
              onClick={() => isExpand(!expand)}>
              {!expand ? "Expand" : "Collapse"}
            </Button>
          )}
        </GridItem>
      </Grid>
    );
  })
);

export const PersonData = memo(
  forwardRef(({ id, name, gender, picture, works }, ref) => {
    // Dark Mode Management
    const { colorMode } = useColorMode();

    // Additional data fetching
    const data = useDeferredValue(useAddData(id, "person"));

    const [profession, setProfession] = useState([]);
    const prof = useDeferredValue(profession);

    // Manage data overflow
    const [expand, isExpand] = useState(false);

    const overviewRef = useRef(null);
    const [overviewHeight, setOverviewHeight] = useState(0);

    useLayoutEffect(() => {
      if (data.biography !== undefined) {
        setOverviewHeight(overviewRef.current.scrollHeight);
      }
    }, [data.biography]);

    useEffect(() => {
      if (data.imdb_id !== undefined) {
        axios({
          method: "GET",
          url: `https://moviesdatabase.p.rapidapi.com/actors/${data.imdb_id}`,
          headers: {
            "X-RapidAPI-Key":
              "c4f416fc44msh986f22e972fb6d6p1a0aa6jsn882b516ab40c",
            "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
          },
        })
          .then(res => {
            const profession = res.data.results.primaryProfession
              .split(",")
              .map(profession =>
                profession.includes("_")
                  ? profession
                      .split("_")
                      .map(
                        form_prf =>
                          form_prf.charAt(0).toUpperCase() + form_prf.slice(1)
                      )
                      .join(" ")
                  : profession.charAt(0).toUpperCase() + profession.slice(1)
              );

            startTransition(() => setProfession(profession));
          })
          .catch(err => console.log(err));
      }
    }, [data.imdb_id]);

    return (
      <Grid
        p="1rem"
        w="72rem"
        background={colorMode === "dark" ? "teal.700" : "teal.50"}
        borderRadius={`1.5rem`}
        templateColumns={"300px auto"}
        columnGap={`1.5rem`}
        rowGap={`.75rem`}
        ref={ref}
        boxShadow={
          colorMode === "dark"
            ? `.35rem .35rem .2rem .1rem #1D4044, -.15rem -.15rem 0 0 #1D4044`
            : `.35rem .35rem .2rem .1rem #81E6D9, -.15rem -.15rem 0 0 #81E6D9`
        }
        my="2rem">
        <GridItem>
          <Image
            borderRadius={`1rem`}
            src={
              picture
                ? `https://image.tmdb.org/t/p/w300${picture}`
                : gender === "Female"
                ? default_female_profile
                : default_male_profile
            }
            alt={`${name} picture`}
            boxShadow={"xl"}
          />
        </GridItem>
        <GridItem>
          <Flex align={"center"} gap={"1rem"}>
            <Heading fontSize={"4.25xl"}>{name}</Heading>
            {data.death !== undefined && (
              <Badge
                fontSize={"lg"}
                variant={"solid"}
                fontStyle={"italic"}
                bgColor={"orange.600"}
                color={colorMode === "dark" ? "whiteAlpha.900" : null}
                borderRadius={"100vw"}
                px=".75rem"
                py=".25rem">
                Deceased
              </Badge>
            )}
          </Flex>
          <Box
            mt=".5rem"
            fontWeight={500}
            fontStyle={"italic"}
            fontSize={"1.4rem"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Gender:
            </Text>{" "}
            {gender}
          </Box>
          {data.birthplace !== undefined && (
            <Box
              mt=".5rem"
              fontWeight={500}
              fontStyle={"italic"}
              fontSize={"1.35rem"}>
              <Text
                fontWeight={700}
                display={"inline-block"}
                fontStyle={"initial" || "-moz-initial"}>
                Birthplace:
              </Text>{" "}
              {data.birthplace}
            </Box>
          )}
          <Flex gap=".75rem" align={"center"}>
            {data.birth !== undefined && (
              <Box
                mt=".5rem"
                fontWeight={500}
                fontStyle={"italic"}
                fontSize={"1.35rem"}>
                <Text
                  fontWeight={700}
                  display={"inline-block"}
                  fontStyle={"initial" || "-moz-initial"}>
                  Date of Birth:
                </Text>{" "}
                {data.birth}
              </Box>
            )}
            {data.death !== undefined && (
              <>
                <Flex h="1.75rem" gap=".4rem">
                  <Divider
                    orientation="vertical"
                    border={"1.75px solid cyan"}
                    ml=".25rem"
                  />
                  <Divider
                    orientation="vertical"
                    border={"1.75px solid cyan"}
                  />
                </Flex>
                <Box
                  mt=".5rem"
                  fontWeight={500}
                  fontStyle={"italic"}
                  fontSize={"1.35rem"}>
                  <Text
                    fontWeight={700}
                    display={"inline-block"}
                    fontStyle={"initial" || "-moz-initial"}>
                    Date of Death:
                  </Text>{" "}
                  {data.death}
                </Box>
              </>
            )}
          </Flex>
          <Box
            mt={".4rem"}
            fontWeight={500}
            fontStyle={"italic"}
            fontSize={"1.35rem"}>
            <Text
              fontWeight={700}
              display={"inline-block"}
              fontStyle={"initial" || "-moz-initial"}>
              Notable Appearance:
            </Text>{" "}
            {works}
          </Box>
          {data.imdb_id !== undefined && (
            <Flex my=".5rem" gap=".75rem">
              {prof.map(prof => (
                <Badge
                  fontSize={"lg"}
                  variant={"solid"}
                  bgColor={"cyan.600"}
                  color={colorMode === "dark" ? "whiteAlpha.900" : null}
                  borderRadius={"100vw"}
                  px=".75rem"
                  py=".25rem">
                  {prof}
                </Badge>
              ))}
            </Flex>
          )}
          {data.biography !== undefined && (
            <>
              <Collapse
                in={expand}
                animateOpacity
                startingHeight={
                  overviewHeight > 16 * 8.2
                    ? `8.2rem`
                    : `${overviewHeight + 20}px`
                }>
                <Text
                  mt=".3rem"
                  fontSize={`xl`}
                  fontWeight={600}
                  ref={overviewRef}>
                  {data.biography}
                </Text>
              </Collapse>
              {overviewHeight > 16 * 8.2 && (
                <Button
                  leftIcon={
                    expand ? (
                      <SmallCloseIcon boxSize={7} />
                    ) : (
                      <SmallAddIcon boxSize={7} />
                    )
                  }
                  variant={`outline`}
                  colorScheme="orange"
                  my=".75rem"
                  fontSize={"lg"}
                  onClick={() => isExpand(!expand)}>
                  {!expand ? "Expand" : "Collapse"}
                </Button>
              )}
            </>
          )}
        </GridItem>
      </Grid>
    );
  })
);
