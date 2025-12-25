import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { websiteInfo } from "@/lib/constants/website";
import { getProductBySlug, products } from "@/lib/constants/products";

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Define the prioritized list of models to use for fallback
// 1. Flash-Lite (Best free limits)
// 2. Flash-8B (Previous gen, often has separate limits)
// 3. Flash (Standard, smarter but stricter limits)
const BACKUP_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
];

// Helper to check if an error is a rate limit error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRateLimitError(error: any): boolean {
  return (
    error?.status === 429 ||
    error?.code === 429 ||
    error?.error?.code === 429 ||
    error?.message?.includes("429") ||
    error?.message?.includes("quota") ||
    error?.message?.includes("RESOURCE_EXHAUSTED")
  );
}

// Define function declarations for tools
const getWebsiteDataDeclaration: FunctionDeclaration = {
  name: "getWebsiteData",
  description:
    "Get website policies and general information about BuyHard. Use this when users ask about shipping, returns, warranty, payment methods, or general store information.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      infoType: {
        type: Type.STRING,
        description:
          "Type of information to retrieve: 'shipping', 'returns', 'warranty', 'general', or 'all'",
        enum: ["shipping", "returns", "warranty", "general", "all"],
      },
    },
    required: ["infoType"],
  },
};

const getProductDataDeclaration: FunctionDeclaration = {
  name: "getProductData",
  description:
    "Get detailed information about a specific product. Use this when users ask about product features, specifications, pricing, availability, or comparisons.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      productSlug: {
        type: Type.STRING,
        description: "The slug identifier of the product to get data for",
      },
    },
    required: ["productSlug"],
  },
};

const getAllProductsDeclaration: FunctionDeclaration = {
  name: "getAllProducts",
  description:
    "Get a complete catalog of all available products with their key details. Use this when users ask for recommendations, comparisons between products, what's available to buy, gift suggestions, or browsing options. Essential for home page interactions.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

// Function implementations
function getWebsiteData(infoType: string): string {
  switch (infoType) {
    case "shipping":
      return `Shipping Policy:\n${websiteInfo.shippingPolicy}`;
    case "returns":
      return `Return Policy:\n${websiteInfo.returnPolicy}`;
    case "warranty":
      return `Warranty Information:\n${websiteInfo.warrantyInfo}`;
    case "general":
      return `${websiteInfo.brandName} - ${websiteInfo.tagline}\n\n${websiteInfo.aiContext}`;
    case "all":
    default:
      return `${websiteInfo.brandName} - ${websiteInfo.tagline}

${websiteInfo.aiContext}

Shipping Policy:
${websiteInfo.shippingPolicy}

Return Policy:
${websiteInfo.returnPolicy}

Warranty Information:
${websiteInfo.warrantyInfo}

Stock Information:
${websiteInfo.stockInfo}`;
  }
}

function getProductData(productSlug: string): string {
  const product = getProductBySlug(productSlug);

  if (!product) {
    // Return list of available products
    const availableProducts = products
      .map((p) => `- ${p.name} (${p.slug})`)
      .join("\n");
    return `Product not found. Available products:\n${availableProducts}`;
  }

  return `Product: ${product.name}
Category: ${product.category}
Price: ${product.currencySymbol}${product.price.toLocaleString()}
In Stock: ${product.inStock ? "Yes" : "No"}
Rating: ${product.rating}/5

Description:
${product.description}

${product.aiContext}

Specifications:
${product.tabs.specs}

Warranty:
${product.tabs.warranty}

Available variants:
${
  product.variants?.colors
    ? `Colors: ${product.variants.colors.join(", ")}`
    : ""
}
${product.variants?.sizes ? `Sizes: ${product.variants.sizes.join(", ")}` : ""}
${
  product.variants?.storage
    ? `Storage: ${product.variants.storage.join(", ")}`
    : ""
}`;
}

function getAllProducts(): string {
  const productList = products
    .map((product) => {
      return `
Product: ${product.name}
Slug: ${product.slug}
Category: ${product.category}
Price: ${product.currencySymbol}${product.price.toLocaleString()}
Rating: ${product.rating}/5
In Stock: ${product.inStock ? "Yes" : "No"}

${product.aiContext}

Available variants: ${
        product.variants?.colors
          ? `Colors: ${product.variants.colors.join(", ")}`
          : ""
      }${
        product.variants?.sizes
          ? ` | Sizes: ${product.variants.sizes.join(", ")}`
          : ""
      }${
        product.variants?.storage
          ? ` | Storage: ${product.variants.storage.join(", ")}`
          : ""
      }
---`;
    })
    .join("\n");

  return `Complete Product Catalog (${products.length} products available):
${productList}

Use this information to make recommendations, compare products, and help users find what they need.`;
}

// Chat history type
export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// Generate system instruction based on context
function getSystemInstruction(productSlug?: string): string {
  const baseInstruction = `You are a friendly and helpful AI shopping assistant for BuyHard™, a premium e-commerce platform. Your role is to help customers with their shopping experience.

CRITICAL RULES:
1. ONLY provide information that comes from the tools available to you (getWebsiteData, getProductData, and getAllProducts). Never make up or hallucinate information.
2. If a user asks about something not covered by the available data, politely acknowledge that you don't have that information and steer the conversation back to topics you CAN help with.
3. Be conversational, warm, and helpful. Use a friendly tone.
4. When users ask about products, recommendations, or comparisons, use getAllProducts to see the complete catalog, then use getProductData for specific details.
5. When users ask about policies (shipping, returns, etc.), use the website data.
6. If asked about things completely unrelated to shopping or the store (like general knowledge questions), politely redirect: "I'm here to help you with your shopping experience at BuyHard! I can tell you about our products, shipping, returns, and more. What would you like to know?"

RECOMMENDATION GUIDELINES:
- When users ask for gift suggestions or recommendations, use getAllProducts to browse the catalog
- Consider the recipient's interests (e.g., gaming → suggest PlayStation 5, sports → suggest Nike shoes, tech enthusiast → suggest iPhone)
- Compare products when asked by looking at price, features, and categories
- Be specific and explain WHY you're recommending something based on the product's features

STYLE GUIDELINES:
- Keep responses concise but informative
- Use **markdown formatting** for better readability:
  * Use **bold** for product names and important features
  * Use bullet points (- or *) for lists
  * Use numbered lists for step-by-step instructions
  * Use > for highlights or important notes
  * Use inline code \`backticks\` for technical terms
- Be enthusiastic about products without being pushy
- Help users make informed decisions based on their needs

PRODUCT CARD FEATURE:
- When recommending or mentioning specific products, include a product card using this syntax: [[product:product-slug]]
- Place product cards on their own line after describing the product
- The available product slugs are: nike-zoom-velocity, iphone-16, playstation-5
- Example: "For gaming, I highly recommend the PlayStation 5! [[product:playstation-5]]"
- Always use the exact slug from the product catalog
- You can include multiple product cards when comparing or recommending several products`;

  if (productSlug) {
    const product = getProductBySlug(productSlug);
    if (product) {
      return `${baseInstruction}

CURRENT CONTEXT: The user is viewing the ${
        product.name
      } product page. You have access to the complete product catalog, website information, AND this specific product's details. Prioritize answering questions about this product, but you can also compare it with other products or answer general store questions.

You can suggest relevant questions like:
${product.predefinedQuestions.map((q) => `- "${q}"`).join("\n")}`;
    }
  }

  return `${baseInstruction}

CURRENT CONTEXT: The user is on the home page or browsing. You have access to the COMPLETE product catalog and can help with recommendations, comparisons, and general shopping assistance. Use getAllProducts to see what's available when users ask for suggestions.

Suggest questions like:
${websiteInfo.defaultChatChips.map((q) => `- "${q}"`).join("\n")}`;
}

// Streaming response generator with Waterfall Fallback Logic
export async function* generateChatResponseStream(
  userMessage: string,
  chatHistory: ChatHistoryMessage[],
  productSlug?: string
): AsyncGenerator<string, void, unknown> {
  const tools = productSlug
    ? [
        getWebsiteDataDeclaration,
        getProductDataDeclaration,
        getAllProductsDeclaration,
      ]
    : [getWebsiteDataDeclaration, getAllProductsDeclaration];

  const contents = chatHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // 1. ATTEMPT INITIAL GENERATION (LOOP THROUGH MODELS)
  let response;
  let usedModel = BACKUP_MODELS[0];

  for (const model of BACKUP_MODELS) {
    try {
      usedModel = model;
      response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(productSlug),
          tools: [{ functionDeclarations: tools }],
        },
      });
      break; // Model worked, exit loop
    } catch (error) {
      // If it's the last model or NOT a rate limit error, handle gracefully
      if (
        model === BACKUP_MODELS[BACKUP_MODELS.length - 1] ||
        !isRateLimitError(error)
      ) {
        console.error(`All models failed or non-retriable error:`, error);
        yield "Man , Free Api key got rate limited 🥲";
        return;
      }
      // Otherwise, log and try next model
      console.warn(`Model ${model} hit rate limit. Switching to next...`);
    }
  }

  if (!response) return;

  // 2. HANDLE FUNCTION CALLS
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionResults = [];

    for (const call of response.functionCalls) {
      let result: string;

      if (call.name === "getWebsiteData") {
        const args = call.args as { infoType: string };
        result = getWebsiteData(args.infoType || "all");
      } else if (call.name === "getProductData") {
        const args = call.args as { productSlug: string };
        result = getProductData(args.productSlug || productSlug || "");
      } else if (call.name === "getAllProducts") {
        result = getAllProducts();
      } else {
        result = "Unknown function";
      }

      functionResults.push({
        name: call.name,
        response: { result },
      });
    }

    const followUpContents = [
      ...contents,
      {
        role: "model",
        parts: response.functionCalls.map((call) => ({
          functionCall: call,
        })),
      },
      {
        role: "user",
        parts: functionResults.map((fr) => ({
          functionResponse: fr,
        })),
      },
    ];

    // 3. ATTEMPT STREAMING WITH FALLBACK (prioritize the model that just worked)
    let streamStarted = false;
    // Reorder models to try the working model first
    const modelsToTry = [
      usedModel,
      ...BACKUP_MODELS.filter((m) => m !== usedModel),
    ];

    for (const model of modelsToTry) {
      try {
        const streamResponse = await ai.models.generateContentStream({
          model: model,
          contents: followUpContents,
          config: { systemInstruction: getSystemInstruction(productSlug) },
        });

        for await (const chunk of streamResponse) {
          if (chunk.text) yield chunk.text;
        }
        streamStarted = true;
        break; // Success
      } catch (error) {
        if (
          model === modelsToTry[modelsToTry.length - 1] ||
          !isRateLimitError(error)
        ) {
          if (!streamStarted)
            yield " ... (System busy, unable to finish thought)";
          return;
        }
        console.warn(
          `Model ${model} hit rate limit during stream. Switching...`
        );
      }
    }
  } else {
    // 4. DIRECT RESPONSE - already have text from generateContent
    if (response.text) {
      yield response.text;
    }
  }
}

// Main function to generate chat response with Waterfall Fallback Logic (non-streaming)
export async function generateChatResponse(
  userMessage: string,
  chatHistory: ChatHistoryMessage[],
  productSlug?: string
): Promise<{ response: string; suggestedQuestions: string[] }> {
  const tools = productSlug
    ? [
        getWebsiteDataDeclaration,
        getProductDataDeclaration,
        getAllProductsDeclaration,
      ]
    : [getWebsiteDataDeclaration, getAllProductsDeclaration];

  const contents = chatHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // 1. INITIAL GENERATION - Loop through models
  let response;
  let usedModel = BACKUP_MODELS[0];

  for (const model of BACKUP_MODELS) {
    try {
      usedModel = model;
      response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(productSlug),
          tools: [{ functionDeclarations: tools }],
        },
      });
      break; // Model worked, exit loop
    } catch (error) {
      if (
        model === BACKUP_MODELS[BACKUP_MODELS.length - 1] ||
        !isRateLimitError(error)
      ) {
        console.error(`All models failed or non-retriable error:`, error);
        return {
          response: "Man , Free Api key got rate limited 🥲",
          suggestedQuestions: [],
        };
      }
      console.warn(`Model ${model} hit rate limit. Switching to next...`);
    }
  }

  if (!response) {
    return { response: "Error", suggestedQuestions: [] };
  }

  // 2. HANDLE FUNCTION CALLS
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionResults = [];

    for (const call of response.functionCalls) {
      let result: string;

      if (call.name === "getWebsiteData") {
        const args = call.args as { infoType: string };
        result = getWebsiteData(args.infoType || "all");
      } else if (call.name === "getProductData") {
        const args = call.args as { productSlug: string };
        result = getProductData(args.productSlug || productSlug || "");
      } else if (call.name === "getAllProducts") {
        result = getAllProducts();
      } else {
        result = "Unknown function";
      }
      functionResults.push({ name: call.name, response: { result } });
    }

    const followUpContents = [
      ...contents,
      {
        role: "model",
        parts: response.functionCalls.map((call) => ({ functionCall: call })),
      },
      {
        role: "user",
        parts: functionResults.map((fr) => ({ functionResponse: fr })),
      },
    ];

    // 3. SECOND CALL WITH FALLBACK (prioritize the model that just worked)
    const modelsToTry = [
      usedModel,
      ...BACKUP_MODELS.filter((m) => m !== usedModel),
    ];

    for (const model of modelsToTry) {
      try {
        const finalResponse = await ai.models.generateContent({
          model: model,
          contents: followUpContents,
          config: { systemInstruction: getSystemInstruction(productSlug) },
        });

        const suggestedQuestions = productSlug
          ? getProductBySlug(productSlug)?.predefinedQuestions || []
          : websiteInfo.defaultChatChips;

        return {
          response: finalResponse.text || "...",
          suggestedQuestions,
        };
      } catch (error) {
        if (
          model === modelsToTry[modelsToTry.length - 1] ||
          !isRateLimitError(error)
        ) {
          return {
            response: "System busy processing your request.",
            suggestedQuestions: [],
          };
        }
        console.warn(
          `Model ${model} hit rate limit during follow-up. Switching...`
        );
      }
    }
  }

  // 4. DIRECT RESPONSE (no function calls)
  const suggestedQuestions = productSlug
    ? getProductBySlug(productSlug)?.predefinedQuestions || []
    : websiteInfo.defaultChatChips;

  return {
    response: response.text || "I'm sorry, I couldn't generate a response.",
    suggestedQuestions,
  };
}
