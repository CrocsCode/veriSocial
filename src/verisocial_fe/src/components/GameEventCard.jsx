import { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearGameEvent } from "../redux/actionCreators/gameCreators";
import {
  Box,
  HStack,
  Image,
  Text,
  ScaleFade,
  Center,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

function GameEventCard({ postId, botImage, humanImage, clearGameEvent }) {
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const botOnLeft = Math.random() < 0.5;
    setOptions(
      botOnLeft
        ? [{ src: botImage, type: "bot" }, { src: humanImage, type: "human" },] : [{ src: humanImage, type: "human" }, { src: botImage, type: "bot" },]
    );
  }, [botImage, humanImage]);

  const handleChoose = (pickedType) => {
    if (result) return; // only once
    const isCorrect = pickedType === "bot";
    setResult(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        clearGameEvent(postId);
      }, 300); // match Transition
    }, 1500);
  };

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      p="4"
      bg="purple.100"
      boxShadow="sm"
      position="relative"
      transform={exiting ? "scale(0.2)" : "scale(1)"}
      transition="transform 0.3s ease-in-out"
      minH="7vh"
    >
      <Text fontSize="sm" fontWeight="bold" mb={3}>
        Which one is AI generated?
      </Text>

      {/* show options until answered */}
      {!result && (
        <HStack spacing={4}>
          {options.map((opt, idx) => (
            <Box
              key={idx}
              flex={1}
              textAlign="center"
              cursor="pointer"
              onClick={() => handleChoose(opt.type)}
            >
              <Image
                src={opt.src}
                alt="Option"
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
              />
              <Text mt={2} fontSize="xs" color="gray.600">
                Option {idx === 0 ? "A" : "B"}
              </Text>
            </Box>
          ))}
        </HStack>
      )}

      {/* Result Card*/}
      <ScaleFade initialScale={0.8} in={!!result}>
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.85)"
          borderRadius="md"
        >
          <Icon
            as={result === "correct" ? AiOutlineCheckCircle : AiOutlineCloseCircle}
            boxSize="5.5vh"
            color={result === "correct" ? "green.400" : "red.400"}
          />
        </Center>
      </ScaleFade>
    </Box>
  );
};

const mapDispatchToProps = {
  clearGameEvent,
};

GameEventCard.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  botImage: PropTypes.string.isRequired,
  humanImage: PropTypes.string.isRequired,
  clearGameEvent: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(GameEventCard);
