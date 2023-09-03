const { json } = require("express");
const { PuppeteerWebBaseLoader } = require("langchain/document_loaders/web/puppeteer");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { HtmlToTextTransformer } = require("langchain/document_transformers/html_to_text");

const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");
const { Document } = require("langchain/document");
const { CharacterTextSplitter } = require("langchain/text_splitter");




OPENAI_API_KEY = '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'

const getRequest = async (req, res) => {
    const loader = new PuppeteerWebBaseLoader("https://www.rottentomatoes.com/browse/movies_at_home/sort:popular");
    const docs = await loader.load();
    console.log(" docs -- " + docs + "        ----------------         ")

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
    const transformer = new HtmlToTextTransformer();
    const sequence = splitter.pipe(transformer);
    const newDocuments = await sequence.invoke(docs);
    // console.log(newDocuments)
    const transformedTexts = newDocuments.map(doc => doc.pageContent);
    const convertedText = transformedTexts.join('');
    // const convertedText = {...transformedTexts};

    console.log(convertedText.length)



    async function processTextChunks(textChunks) {
        console.log('entered')
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo", // Defaults to "text-davinci-003" if no model provided.
            temperature: 0.9,
            openAIApiKey: "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", // In Node.js defaults to process.env.OPENAI_API_KEY
        });
        const prompt = PromptTemplate.fromTemplate(
            `You are a very experienced and senior  web scrapper . You ned to extract movies title,year,rating and any other info regarding movie -  $(prompt)?.
          Prompt :
          title:
          year:
          rating:
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
        console.log(results)
        return results;
    }



    // const textSplit = async () => {
    //     const splitter = new RecursiveCharacterTextSplitter({
    //         chunkSize: 3000,
    //         chunkOverlap: 200,
    //     });

    //     const textChunks = await splitter.createDocuments([transformedTexts]);
    //     console.log(textChunks)
    //     const processedResults = await processTextChunks(textChunks);
    //     console.log(processedResults);
    // }
    const textSplit = async () => {

        const splitter = new CharacterTextSplitter({
            separator: " ",
            chunkSize: 3400,
            chunkOverlap: 0,
        });
        const textChunks = await splitter.createDocuments([transformedTexts]);
        console.log(textChunks)
        const processedResults = await processTextChunks(textChunks);
        console.log(processedResults);
    }



    if (convertedText.length < 3500) {
        textSplit()
    } else {
        const results = processTextChunks(transformedTexts)
    }

    res.send({
        newDocuments,
        transformedTexts,
        convertedText

    })
}


const functions = {
    getRequest
};

module.exports = functions;




