const { OpenAI } = require("langchain/llms/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");


async function processTextChunks(textChunks) {
  console.log('entered')
  const model = new OpenAI({
    modelName: "gpt-3.5-turbo", // Defaults to "text-davinci-003" if no model provided.
    temperature: 0.9,
    openAIApiKey: "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", // In Node.js defaults to process.env.OPENAI_API_KEY
  });
  const prompt = PromptTemplate.fromTemplate(
    `summarise this  -  $(prompt)?.
    Prompt :
    Summary:
    `
  );
  

  const chain = new LLMChain({ llm: model, prompt });
  const results = [];

  for (const chunk of textChunks) {
    console.log("entered chain")
    console.log(chunk)
    const result = await chain.run(chunk);
    console.log("result ")
    results.push(result);
  }

  return results;
}
// const model = new OpenAI({
//   modelName: "gpt-3.5-turbo", // Defaults to "text-davinci-003" if no model provided.
//   temperature: 0.9,
//   openAIApiKey: "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", // In Node.js defaults to process.env.OPENAI_API_KEY
// });

// const doc ="HTTP (Hypertext Transfer Protocol) requests are the foundation of communication between a client (usually a web browser) and a server (a web server or an API). When a user interacts with a website by clicking a link or submitting a form, the client sends an HTTP request to the server. This request includes information about the desired action, such as retrieving a web page or submitting data. HTTP requests consist of a request method (GET, POST, PUT, DELETE, etc.), a URL (Uniform Resource Locator) that specifies the resource's location, headers containing metadata, and sometimes a request body carrying data. The server processes the request and responds with an HTTP response, which includes a status code indicating the outcome of the request (success, error, redirection, etc.) and the requested data or additional information. This client-server interaction forms the basis of data exchange on the web, enabling the retrieval of web pages, images, videos, and the communication with APIs to fetch or send data."

// const res = await model.call(
//   `tell me this in one single line - ${doc}`
// );
// console.log( res );

const zz = async () => {


  const text = `HTTP (Hypertext Transfer Protocol) requests are the foundation of communication between a client (usually a web browser) and a server (a web server or an API). When a user interacts with a website by clicking a link or submitting a form, the client sends an HTTP request to the server. This request includes information about the desired action, such as retrieving a web page or submitting data. HTTP requests consist of a request method (GET, POST, PUT, DELETE, etc.), a URL (Uniform Resource Locator) that specifies the resource's location, headers containing metadata, and sometimes a request body carrying data. The server processes the request and responds with an HTTP response, which includes a status code indicating the outcome of the request (success, error, redirection, etc.) and the requested data or additional information. This client-server interaction forms the basis of data exchange on the web, enabling the retrieval of web pages, images, videos, and the communication with APIs to fetch or send data.`;
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 10,
  });

  const textChunks = await splitter.createDocuments([text]);
  console.log(textChunks)
  const processedResults = await processTextChunks(textChunks);

  console.log(processedResults);
}

zz();