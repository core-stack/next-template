import { MarkdownTextSplitter } from 'langchain/text_splitter';
import { randomUUID } from 'node:crypto';

import { env } from '@/env';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

import { saveDocsWithRelations, saveEntitiesWithRelations, saveSource } from './database';
import { Doc, DocMetadata } from './model/doc';
import { Source } from './model/source';
import { entityExtractor } from './services/entity-extraction/llm';

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: env.GEMINI_API_KEY,
  model: "text-embedding-004"
})
export type SaveMemoryParams = {
  tenantId: string;
  createdBy: string;
  text: string;
  title: string;
  sourceType: Source["type"];
  type: DocMetadata["type"];
  groupPath: string;
}
export const saveMemory = async ({ createdBy, tenantId, text, title, type, sourceType, groupPath }: SaveMemoryParams) => {
  console.log("saveMemory", { tenantId, createdBy, text, title, type, groupPath });
  
  // separar o texto em chunks
  const splitter = new MarkdownTextSplitter({
    chunkOverlap: 200,
    chunkSize: 1000,
  });
  const chunks = await splitter.splitText(text);
  
  const groups = [];
  groupPath.split("/").reduce((acc, current) => {
    const path = `${acc}/${current}`
    groups.push(path)
    return path;
  }, "");

  const sourceId = randomUUID();
  const modifiedAt = new Date();
  // source
  const source = {
    _key: sourceId,
    originalName: title,
    type: sourceType,
    tenantId,
    metadata: {
      modifiedAt,
      modifiedBy: createdBy,
      groups
    }
  } as Source;
  await saveSource(source);

  await Promise.all(chunks.map(async (chunk, index) => {
    // extrair entidades e relacionamentos
    const [{ entities, relationships }, embeddings] = await Promise.all([
      entityExtractor.extract(tenantId, sourceId, chunk),
      embeddingModel.embedQuery(chunk)
    ]);
    
    const doc = {
      _key: randomUUID(),
      embeddings,
      tenantId,
      text: chunk,
      metadata: {
        type,
        entities: entities.map(ent => ent.text),
        index,
        modifiedAt,
        modifiedBy: createdBy,
        sourceId,
        groups
      }
    } as Doc;
    
    await saveEntitiesWithRelations(entities, relationships);

    const docRelations = entities.map(ent => ({
      _from: `entities/${ent._key}`,
      _to: `docs/${doc._key}`,
      type: "contains",
      strength: 1,
      tenantId
    }));
  
    docRelations.push({
      _from: `sources/${sourceId}`,
      _to: `docs/${doc._key}`,
      type: "contains",
      strength: 1,
      tenantId,
    });

    await saveDocsWithRelations(doc, docRelations);
  }));
}