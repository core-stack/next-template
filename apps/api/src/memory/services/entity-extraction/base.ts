import { Entity } from '@/memory/model/entity';

import { EntityExtractor, EntityRelationshipExtractionResult } from './types';

export abstract class BaseEntityExtractor implements EntityExtractor {
  abstract extract(sourceId: string, text: string): Promise<EntityRelationshipExtractionResult>;
  
  protected normalizeEntity(entity: Entity): Entity {
    return {
      ...entity,
      text: entity.text.trim(),
      type: entity.type.toUpperCase()
    };
  }
}