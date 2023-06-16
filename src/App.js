import "./App.css";

import { useCallback, useEffect } from "react";
import {
  Fade,
  IconButton,
  Tooltip,
  useColorMode,
  useDisclosure,
  Flex,
  Text,
  Heading,
} from "@chakra-ui/react";

import MovieSearch from "./comp/MovieSearch/MovieSearch";
import { ArrowUpIcon } from "@chakra-ui/icons";

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  // State for "Back to Top" button
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Callback for scroll event
  const handleScroll = useCallback(() => {
    window.scrollY > 20 ? onOpen() : onClose();
  }, [onOpen, onClose]);

  // Handling scroll events
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <>
      <Flex align={"center"} justify={"space-between"} mb="2rem">
        <Heading
          fontFamily={"Blockletter"}
          letterSpacing={"1.5px"}
          fontSize={"6xl"}
          color={colorMode === "dark" ? "gray.300" : "gray.800"}
          textShadow={"1.5px 1.5px #B2F5EA"}>
          MovieGenie
        </Heading>
        <Flex
          align={"center"}
          px="2rem"
          py="1rem"
          bgColor={colorMode === "dark" ? `teal.600` : `teal.100`}
          w={"max-content"}
          gap={`1.25rem`}
          borderRadius={`100vw`}>
          <Text fontSize={"xl"} fontWeight={600}>
            {colorMode === "dark" ? "Dark" : "Light"} Mode
          </Text>
          <div className="toggle-switch">
            <label
              className="switch-label"
              style={{
                borderColor: colorMode === "dark" ? "#1D4044" : "#CBD5E0",
              }}>
              <input
                type="checkbox"
                className="checkbox"
                onChange={toggleColorMode}
                checked={colorMode !== "dark"}
              />
              <span className="slider"></span>
            </label>
          </div>
        </Flex>
      </Flex>
      <Fade in={isOpen}>
        <Tooltip
          bgColor={colorMode === "dark" ? "teal.200" : "teal.500"}
          openDelay={200}
          display={isOpen ? "block" : "none"}
          hasArrow
          placement="top"
          arrowSize={15}
          label="Scroll to Top"
          fontSize={`2xl`}
          mb={`.5rem`}
          px="1.25rem"
          py=".25rem"
          borderRadius={"100vw"}
          aria-label="Click here to scroll to top">
          <IconButton
            colorScheme="teal"
            zIndex={"10"}
            icon={<ArrowUpIcon boxSize={8} />}
            size={"lg"}
            position={"fixed"}
            top={`90vh`}
            left={"88vw"}
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
            }
            cursor={isOpen ? "pointer" : "default"}
          />
        </Tooltip>
      </Fade>
      <div className="App">
        {/* For test purpose */}
        <MovieSearch />
      </div>
    </>
  );
}
