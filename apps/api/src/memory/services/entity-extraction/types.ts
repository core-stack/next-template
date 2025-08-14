import { Entity } from '@/memory/model/entity';
import { Relationship } from '@/memory/model/relationship';

export interface EntityRelationshipExtractionResult {
  entities: Entity[];
  relationships: Relationship[];
}

export interface EntityExtractor {
  extract(tenantId: string, sourceId: string, text: string): Promise<EntityRelationshipExtractionResult>;
}