import { MarkdownTextSplitter } from 'langchain/text_splitter';
import { randomUUID } from 'node:crypto';

import { env } from '@/env';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

import { Doc, DocMetadata } from './model/doc';
import { Source } from './model/source';
import { docRepository } from './repository/doc';
import { entityRepository } from './repository/entity';
import { sourceRepository } from './repository/source';
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
  type: DocMetadata["type"];
  groupPath: string;
}
export const saveMemory = async ({ createdBy, tenantId, text, title, type, groupPath }: SaveMemoryParams) => {

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
    type,
    metadata: {
      modifiedAt,
      modifiedBy: createdBy,
      groups
    }
  } as Source;
  await sourceRepository.save(source);

  await Promise.all(chunks.map(async (chunk, index) => {
    // extrair entidades e relacionamentos
    const { entities, relationships } = await entityExtractor.extract(tenantId, sourceId, chunk);
    
    // gerar embeddings
    const embeddings = await embeddingModel.embedQuery(chunk);
    
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
    
    await entityRepository.saveWithRelations(entities, relationships);
    const docRelations = entities.map(ent => ({
      _from: `entity/${ent._key}`,
      _to: `doc/${doc._key}`,
      type: "contains",
      strength: 1,
      tenantId
    }));
    docRelations.push({
      _from: `source/${sourceId}`,
      _to: `doc/${doc._key}`,
      type: "contains",
      strength: 1,
      tenantId,
    });
    await docRepository.saveWithRelations(doc, docRelations);
  }));
}