import {
  forwardRef,
  useState,
  memo,
  useRef,
  useLayoutEffect,
  lazy,
  Suspense,
} from "react";
import {
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
} from "@chakra-ui/react";

import default_poster from "../../assets/images/default_poster.jpg";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";

// Lazy loading
const ExtraTVData = lazy(() =>
  import("./ExtraData")
    .then(module => ({ default: module.ExtraTVData }))
    .catch(err => console.log(err))
);

const ExtraMovieData = lazy(() =>
  import("./ExtraData").then(module => ({ default: module.ExtraMovieData }))
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
    const [isExpand, setIsExpand] = useState(false);

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
            in={isExpand}
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
                isExpand ? (
                  <SmallCloseIcon boxSize={7} />
                ) : (
                  <SmallAddIcon boxSize={7} />
                )
              }
              variant={`outline`}
              colorScheme="orange"
              my="1.25rem"
              fontSize={"lg"}
              onClick={() => setIsExpand(!isExpand)}>
              {!isExpand ? "Expand" : "Collapse"}
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
    const [isExpand, setIsExpand] = useState(false);

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
            in={isExpand}
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
                isExpand ? (
                  <SmallCloseIcon boxSize={7} />
                ) : (
                  <SmallAddIcon boxSize={7} />
                )
              }
              variant={`outline`}
              colorScheme="orange"
              my="1.25rem"
              fontSize={"lg"}
              onClick={() => setIsExpand(!isExpand)}>
              {!isExpand ? "Expand" : "Collapse"}
            </Button>
          )}
        </GridItem>
      </Grid>
    );
  })
);
