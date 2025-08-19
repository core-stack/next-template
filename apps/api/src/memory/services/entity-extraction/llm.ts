import { parse } from 'node:path';

import { env } from '@/env';
import { Entity } from '@/memory/model/entity';
import { Relationship } from '@/memory/model/relationship';
import { generateKey } from '@/memory/util/generate-key';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptTemplate } from '@langchain/core/prompts';

import { EntityExtractor, EntityRelationshipExtractionResult } from './types';

export class LLMEntityExtractor implements EntityExtractor {
  private model: GoogleGenerativeAI;
  private prompt: PromptTemplate<{ text: string }>;

  constructor() {
    this.model = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.prompt = new PromptTemplate({
      template: `Analyze the following text and extract:
    
1. Entities with their types.
2. Relationships between the entities.

only extract relationships between entities that exist, 
before creating a relationship verify that the related entities exist, 
if it does not exist, ignore or create the entity, never, never create 
relationships with non-existent entities.
no create duplicated entities or relationships, before add a new entity or relationship,
verify if it exists, if exists, ignore.
Add a sequencial unique id for in "_key" field of entities.
in "_from" and "_to" fields in relationships, add the entity id
Return a JSON object like:
{{
  "entities": [{{"_key": 1, "name": "John", "type": "Person"}}],
  "relationships": [
    {{
      "_from": 1,
      "_to": 2,
      "strength": 0.8, // 0.0 to 1.0 (1.0 being the most strong)
      "type": "employed_by"
    }}
  ]
}}

Text: {text}`,
      inputVariables: ['text']
    });
  }

  async extract(tenantId: string, sourceId: string, text: string): Promise<EntityRelationshipExtractionResult> {
    try {
      const model = this.model.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const formattedPrompt = await this.prompt.format({ text });
      const result = await model.generateContent(formattedPrompt);
      const response = result.response;
      const jsonString = response.text();

      const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[1] : jsonString) as EntityRelationshipExtractionResult;
      
      const enrichedEntities: Entity[] = parsed.entities.map(entity => {
        const _key = generateKey(tenantId, entity.text, entity.type);
        return {
          ...entity,
          _key,
          sourceId,
          tenantId,
        };
      });

      const enrichedRelationships: Relationship[] = parsed.relationships.map(rel => {
        const source = parsed.entities.find(e => e._key === rel._from);
        const target = parsed.entities.find(e => e._key === rel._to);
        if (!source || !target) {
          console.warn(`Missing entity for relationship: ${rel.type}`);
          return null;
        }
        return {
          ...rel,
          _from: `entities/${generateKey(tenantId, source.text, source.type)}`,
          _to: `entities/${generateKey(tenantId, target.text, target.type)}`,
          tenantId
        };
      }).filter(Boolean) as Relationship[];

      return {
        entities: enrichedEntities,
        relationships: enrichedRelationships
      };
    } catch (error) {
      console.error('Error extracting entities with LLM:', error);
      return { entities: [], relationships: [] };
    }
  }
}

export const entityExtractor = new LLMEntityExtractor();