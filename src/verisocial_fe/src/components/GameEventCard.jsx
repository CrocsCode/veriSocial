import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearGameEvent, addGameEventScore } from "../redux/actionCreators/gameCreators";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  ScaleFade,
  Center,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

function GameEventCard({
  postId,
  botImage,
  humanImage,
  correctPostId,
  wrongPostId,
  clearGameEvent,
  addGameEventScore,
}) {
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const botOnLeft = Math.random() < 0.5;
    setOptions(
      botOnLeft
        ? [{ src: botImage, type: "bot" }, { src: humanImage, type: "human" },]
        : [{ src: humanImage, type: "human" }, { src: botImage, type: "bot" },]
    );
  }, [botImage, humanImage]);

  const handleChoose = (pickedType) => {
    if (result) return; // only once
    const isCorrect = pickedType === "bot";
    setResult(isCorrect ? "correct" : "wrong");

    addGameEventScore(isCorrect, correctPostId, wrongPostId);

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
      <Text fontSize="1.2vh" fontWeight="bold" mb={3}>
        Which one is AI generated?
      </Text>

      {/* show options until answered */}
      {!result && (
        <HStack spacing={4}>
          {options.map((opt, idx) => (
            <Flex
              key={idx}
              flex={1}
              direction="column"
              align="center"
              cursor="pointer"
              onClick={() => handleChoose(opt.type)}
            >
              <Image
                src={opt.src}
                alt={`Option ${idx === 0 ? "A" : "B"}`}
                borderRadius="md"
                maxH="25vh"
                objectFit="cover"
                mb={2}
              />
              <Text fontSize="xs" color="gray.600">
                Option {idx === 0 ? "A" : "B"}
              </Text>
            </Flex>
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
  addGameEventScore,
};

GameEventCard.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  botImage: PropTypes.string.isRequired,
  humanImage: PropTypes.string.isRequired,
  correctPostId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  wrongPostId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  clearGameEvent: PropTypes.func.isRequired,
  addGameEventScore: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(GameEventCard);
