import { createSystem, defaultConfig, defineConfig, defineTokens } from "@chakra-ui/react";

const tokens = defineTokens({
    colors: {
        primary: { value: "#67e8f9" } // Placeholder
        // TBA
    },
    fonts: {
        // TBA
    },
});

const customConfig = defineConfig({
    theme: {
        tokens,
    },
});

export const system = createSystem(defaultConfig, customConfig);