// Import React Hooks
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  memo,
  Fragment,
  lazy,
  Suspense,
  startTransition,
} from "react";

// Import Immer module
import { useImmer } from "use-immer";

// Import id generator
import { v4 as uuidv4 } from "uuid";

// Import Chakra UI Components
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";

// Custom icons & Chakra Icons
import { MovieIcon } from "../styles/MovieIcon";
import {
  InfoOutlineIcon,
  Search2Icon,
  AddIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

// Styles, Data Fetching API & Components to display data
import "./MovieSearch.css";
import useResult from "../API & Data/useResult";

const TVSeriesData = lazy(() =>
  import("../Data Display/DataComponent")
    .then(module => ({
      default: module.TVSeriesData,
    }))
    .catch(err => console.log(err))
);

const MotionPicsData = lazy(() =>
  import("../Data Display/DataComponent")
    .then(module => ({
      default: module.MotionPicsData,
    }))
    .catch(err => console.log(err))
);

const PersonData = lazy(() =>
  import("../Data Display/DataComponent")
    .then(module => ({
      default: module.PersonData,
    }))
    .catch(err => console.log(err))
);

const MovieSearch = memo(() => {
  const [query, setQuery] = useState(""); // State for query
  const [queryType, setQueryType] = useState(""); // State for query type
  const [page, setPage] = useState(1); // State for query page

  // State for displaying query type (to avoid flickering upon state change)
  const [displayType, setDisplayType] = useState("");

  // State for optional year input
  const [year, setYear] = useImmer({
    selected: false,
    year: undefined,
    disabled: false,
  });

  // Calling the API
  const { loading, data, error, hasMore, noResult } = useResult(
    queryType,
    query,
    page,
    year.year
  );

  /* State to manage form errors, 
  since it's my intention to validate the inputs when the user
  press the "Search" button 
  => All inputs are uncontrolled and data are managed with Refs */
  const [formError, setFormError] = useImmer({
    input: false,
    radio: false,
    noResult: null,
  });

  // Hooks for dark mode
  const { colorMode } = useColorMode();

  // Refs to manage inputs
  const inputRef = useRef(null);
  const radioRef = useRef(null);
  const yearRef = useRef(null);

  // Fallback values to avoid flickering upon states changes
  const displayYear = useDeferredValue(year.year);
  const displayQuery = useDeferredValue(query);
  const displayTypeDeferred = useDeferredValue(displayType);

  /* Infinite Scrolling implementation 
  Reference: Infinite Scrolling with React - https://www.youtube.com/watch?v=NZKUirTtxcg */
  const observerRef = useRef();
  const handleLastIntersect = useCallback(
    node => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            startTransition(() => setPage(page => page + 1));
            // console.log(page);
          }
        },
        {
          threshold: 0,
          rootMargin: "0px 0px -20px 0px",
        }
      );
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  // Search handler
  const handleSearch = useCallback(() => {
    // Validate inputs
    if (inputRef.current.value === "" && !radioRef.current)
      setFormError(draft => {
        draft.input = true;
        draft.radio = true;
      });
    else if (inputRef.current.value === "")
      setFormError(draft => {
        draft.input = true;
      });
    else if (!radioRef.current)
      setFormError(draft => {
        draft.radio = true;
      });
    // Setting states to fetch data
    else {
      setQuery(inputRef.current.value);
      setQueryType(radioRef.current);
      setYear(draft => {
        draft.year = year.selected ? yearRef.current.value : undefined;
      });
      setPage(1);

      // Setting state to display contents
      setDisplayType(
        radioRef.current === "movie"
          ? "Movies"
          : radioRef.current === "tv"
          ? "TV Series"
          : "People"
      );
    }
  }, [setFormError, setYear, year.selected]);

  // Initiate searching when user press "Enter"
  const searchEvent = useCallback(
    e => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  // Handle query category input (Radio)
  const handleRadio = useCallback(
    nextValue => {
      radioRef.current = nextValue;
      setFormError(draft => {
        draft.radio = false;
        draft.year = false;
      });
      setYear(draft => {
        draft.disabled = false;
      });
      if (nextValue === "person") {
        setYear(draft => {
          draft.selected = false;
          draft.disabled = true;
        });
      }
    },
    [setFormError, setYear]
  );

  // Managing rendering side effects
  useEffect(() => {
    window.addEventListener("keypress", searchEvent);
    setFormError(draft => {
      draft.noResult = noResult;
    });

    return () => window.removeEventListener("keypress", searchEvent);
  }, [searchEvent, noResult, setFormError]);

  return (
    <div className="Selection">
      <Flex w="max-content" gap={`1rem`}>
        <FormControl isInvalid={formError.input}>
          <InputGroup size="lg">
            <InputLeftAddon
              bgColor={`teal.500`}
              border={`4px solid teal.500`}
              borderRight="none">
              <MovieIcon />
            </InputLeftAddon>
            <Input
              placeholder="Search your favourites"
              w="30rem"
              variant="filled"
              focusBorderColor="teal.500"
              ref={inputRef}
              onChange={e =>
                setFormError(draft => {
                  draft.input = e.target.value === "";
                })
              }
              isDisabled={loading}
            />
          </InputGroup>
          {formError.input && (
            <Flex align={`center`} gap=".5rem" mt={"1rem"}>
              <WarningIcon color={`red.300`} boxSize={5} />
              <FormErrorMessage fontSize={`lg`} mt={0} fontWeight={600}>
                This field is required
              </FormErrorMessage>
            </Flex>
          )}
        </FormControl>
        <Tooltip
          bgColor={colorMode === "dark" ? "teal.200" : "teal.500"}
          openDelay={100}
          placement="right"
          label="Search"
          fontSize={`xl`}
          ml={`.25rem`}
          px="1rem"
          py=".25rem"
          borderRadius={"100vw"}
          aria-label="Click here to search">
          <IconButton
            size={`lg`}
            _hover={{ bgColor: colorMode === "dark" ? "#285E61" : "#4FD1C5" }}
            onClick={handleSearch}
            bgColor={colorMode === "dark" ? `teal.400` : `teal.500`}
            icon={<Search2Icon color={`#F3EADA`} boxSize={5} />}
          />
        </Tooltip>
      </Flex>
      <Flex align={"center"} my="1.5rem">
        <InputGroup size={"md"}>
          <Checkbox
            icon={year.selected ? <AddIcon boxSize={3} /> : <></>}
            spacing={`.75rem`}
            colorScheme="teal"
            size={`lg`}
            id="additional-content"
            isChecked={year.selected}
            isDisabled={year.disabled || loading}
            onChange={e =>
              startTransition(() =>
                setYear(draft => {
                  draft.selected = e.target.checked;
                })
              )
            }>
            Include release year
          </Checkbox>
          {year.selected && (
            <Input
              ml={`1.5rem`}
              type="number"
              placeholder="Year"
              width={`10rem`}
              variant={`filled`}
              _focus={{ borderColor: "teal" }}
              ref={yearRef}
            />
          )}
          {year.selected && (
            <Flex
              align={`center`}
              gap=".5rem"
              ml={`1rem`}
              opacity={colorMode === "dark" ? 0.6 : 1}>
              <InfoOutlineIcon boxSize={4} />
              <Text fontSize={`md`} mt={0} fontWeight={500}>
                This field should be a number
              </Text>
            </Flex>
          )}
        </InputGroup>
      </Flex>
      <FormControl isInvalid={formError.radio}>
        <RadioGroup
          isDisabled={loading}
          onChange={handleRadio}
          my="1.5rem"
          size="lg"
          colorScheme="teal">
          <Box
            fontWeight={800}
            fontStyle={`italic`}
            mb={`1rem`}
            fontSize={"2xl"}>
            Choose the category you wish to search
          </Box>
          <Stack>
            <Radio _focusVisible={{ outline: "none" }} value="movie">
              Movies
            </Radio>
            <Radio _focusVisible={{ outline: "none" }} value="tv">
              TV Series
            </Radio>
            <Radio _focusVisible={{ outline: "none" }} value="person">
              People
            </Radio>
          </Stack>
        </RadioGroup>
        {formError.radio && (
          <Flex align={`center`} gap=".5rem">
            <WarningIcon color={`red.300`} boxSize={5} />
            <FormErrorMessage fontSize={`lg`} mt={0} fontWeight={600}>
              This field is required
            </FormErrorMessage>
          </Flex>
        )}
      </FormControl>
      {formError.noResult === "true" && !loading && (
        <>
          <Divider
            borderColor={`teal.600`}
            w={`72rem`}
            borderWidth={`2px`}
            mb={`.75rem`}
          />
          <Flex align={"center"} gap={`.75rem`}>
            <WarningTwoIcon boxSize={6} />
            <Text fontSize={`3xl`} fontWeight={700} fontStyle={`italic`}>
              No Result for {`"${displayQuery}"`} in{" "}
              {`"${displayTypeDeferred}"`}{" "}
              {displayYear !== undefined &&
                displayYear.length !== 0 &&
                ` released in ${displayYear}`}
            </Text>
          </Flex>
        </>
      )}
      {data.length !== 0 && (
        <>
          <Divider
            borderColor={`teal.600`}
            w={`72rem`}
            borderWidth={`2px`}
            mb={`.75rem`}
          />
          <Box
            fontWeight={700}
            fontStyle={`italic`}
            my={`1rem`}
            fontSize={"3xl"}>
            Search Results for {`"${displayQuery}"`} in{" "}
            {`"${displayTypeDeferred}"`}
            {displayYear !== undefined &&
              displayYear.length !== 0 &&
              ` released in ${displayYear}`}
          </Box>
        </>
      )}
      {queryType === "movie" &&
        data.map((dataPoint, index) => {
          return (
            <Fragment key={dataPoint.id}>
              <Suspense fallback={<Skeleton></Skeleton>}>
                <MotionPicsData
                  id={dataPoint.id}
                  title={dataPoint.title}
                  year={dataPoint.year}
                  poster={dataPoint.poster}
                  overview={dataPoint.overview}
                  ref={index === data.length - 1 ? handleLastIntersect : null}
                />
              </Suspense>
              {(index + 1) % 20 === 0 && index + 1 !== data.length && (
                <Flex
                  align={"center"}
                  width={
                    "max-content" || "-webkit-max-content" || "-moz-max-content"
                  }
                  gap="1rem"
                  py={`.75rem`}>
                  <Divider
                    borderColor={`teal.600`}
                    w={`30rem`}
                    borderWidth={`2px`}
                  />{" "}
                  <Text fontStyle={"italic"} fontSize={"2xl"} fontWeight={700}>
                    Page {(index + 1) / 20 + 1}
                  </Text>
                  <Divider
                    borderColor={`teal.600`}
                    w={`30rem`}
                    borderWidth={`2px`}
                  />
                </Flex>
              )}
            </Fragment>
          );
        })}
      {queryType === "tv" &&
        data.map((dataPoint, index) => {
          return (
            <Fragment key={uuidv4()}>
              <Suspense fallback={<Skeleton></Skeleton>}>
                <TVSeriesData
                  id={dataPoint.id}
                  type={dataPoint.type}
                  title={dataPoint.title}
                  year={dataPoint.year}
                  poster={dataPoint.poster}
                  overview={dataPoint.overview}
                  ref={index === data.length - 1 ? handleLastIntersect : null}
                />
              </Suspense>
              {(index + 1) % 20 === 0 && index + 1 !== data.length && (
                <Flex
                  align={"center"}
                  width={
                    "max-content" || "-webkit-max-content" || "-moz-max-content"
                  }
                  gap="1rem"
                  py={`.75rem`}>
                  <Divider
                    borderColor={`teal.600`}
                    w={`32rem`}
                    borderWidth={`2px`}
                  />{" "}
                  <Text fontStyle={"italic"} fontSize={"2xl"} fontWeight={700}>
                    Page {(index + 1) / 20 + 1}
                  </Text>
                  <Divider
                    borderColor={`teal.600`}
                    w={`32rem`}
                    borderWidth={`2px`}
                  />
                </Flex>
              )}
            </Fragment>
          );
        })}
      {queryType === "person" &&
        data.map((dataPoint, index) => {
          return (
            <Fragment key={uuidv4()}>
              <Suspense fallback={<Skeleton></Skeleton>}>
                <PersonData
                  id={dataPoint.id}
                  name={dataPoint.name}
                  gender={dataPoint.gender}
                  picture={dataPoint.picture}
                  works={dataPoint.works}
                  ref={index === data.length - 1 ? handleLastIntersect : null}
                />
              </Suspense>
              {(index + 1) % 20 === 0 && index + 1 !== data.length && (
                <Flex
                  align={"center"}
                  width={
                    "max-content" || "-webkit-max-content" || "-moz-max-content"
                  }
                  gap="1rem"
                  py={`.75rem`}>
                  <Divider
                    borderColor={`teal.600`}
                    w={`32rem`}
                    borderWidth={`2px`}
                  />{" "}
                  <Text fontStyle={"italic"} fontSize={"2xl"} fontWeight={700}>
                    Page {(index + 1) / 20 + 1}
                  </Text>
                  <Divider
                    borderColor={`teal.600`}
                    w={`32rem`}
                    borderWidth={`2px`}
                  />
                </Flex>
              )}
            </Fragment>
          );
        })}
      {loading && <div className="custom-loader"></div>}
      {!loading && <Box height={`40px`}></Box>}
      {error && (
        <Flex
          bg="red.200"
          w="50vw"
          p="2rem"
          align={`center`}
          gap={`.75rem`}
          borderRadius={`1.5rem`}
          fontSize={`xl`}
          fontWeight={700}
          color={`#78002F`}>
          <WarningIcon />
          <Text>There has been an error. Please try again</Text>
        </Flex>
      )}
    </div>
  );
});

export default MovieSearch;
