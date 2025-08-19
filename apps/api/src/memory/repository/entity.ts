
import { aql } from 'arangojs';
import { join } from 'arangojs/aql';
import { EnsurePersistentIndexOptions } from 'arangojs/indexes';
import { ZodType } from 'zod';

import { Entity, entitySchema } from '@/memory/model/entity';
import { Relationship } from '@/memory/model/relationship';

import { RelationshipReporitory, relationshipRepository } from './relationship';
import { DocumentRepository } from './repository';

export class EntityReporitory extends DocumentRepository<Entity> {
  protected schema: ZodType = entitySchema;
  protected indexes: EnsurePersistentIndexOptions[] = [
    {
      type: 'persistent',
      fields: ['tenantId'],
      name: 'idx_tenant',
    },
    {
      type: 'persistent',
      fields: ['tenantId', 'name', 'type'],
      unique: true,
      name: 'idx_unique_entity',
    }
  ];

  constructor(private relationshipRepository: RelationshipReporitory) {
    super('entity');
  }

  async saveWithRelations(e: Entity | Entity[], rel: Relationship | Relationship[]) {
    if (!this.collection) {
      this.connect();
    }
  
    const entities = Array.isArray(e) ? e : [e];
    const relations = Array.isArray(rel) ? rel : [rel];
  
    const existingEntities = await this.findExistingEntitiesBulk(entities);
    const entityKeyMap = new Map<string, string>();

    const entitiesToSave = entities.map(entity => {
      const existingKey = this.getExistingEntityKey(entity, existingEntities);
      if (existingKey) {
        entityKeyMap.set(entity._key, existingKey);
        return { ...entity, _key: existingKey };
      }
      entityKeyMap.set(entity._key, entity._key);
      return entity;
    });

    await this.save(entitiesToSave, { overwriteMode: "update" });
    const updatedRelationships = relations.map(rel => ({
      ...rel,
      _from: entityKeyMap.get(rel._from) || rel._from,
      _to: entityKeyMap.get(rel._to) || rel._to
    }));
 
    const existingRelations = await this.relationshipRepository.findExistingRelationshipsBulk(updatedRelationships);
    const relationshipsToSave = updatedRelationships.map(rel => {
      const existing = existingRelations.find(r => 
        r._from === rel._from && 
        r._to === rel._to && 
        r.type === rel.type
      );
      return existing ? { ...rel, _key: existing._key } : rel;
    });

    await this.relationshipRepository.save(
      relationshipsToSave,
      { overwriteMode: "update" }
    );
  }

  private async findExistingEntitiesBulk(entities: Entity[]): Promise<Entity[]> {
    if (!this.collection) {
      this.connect();
    }
    if (entities.length === 0) return [];
    
    const cursor = await this.collection!.database.query(aql`
      FOR e IN ${this.collection}
        FILTER ${join(entities.map(ent => 
          aql`(e.tenantId == ${ent.tenantId} && e.name == ${ent.text} && e.type == ${ent.type})`), 
        ' OR ')}
        RETURN e
    `);
    return await cursor.all();
  }

  private getExistingEntityKey(entity: Entity, existingEntities: Entity[]): string | null {
    const found = existingEntities.find(e => 
      e.tenantId === entity.tenantId && 
      e.text === entity.text && 
      e.type === entity.type
    );
    return found?._key || null;
  }
}
export const entityRepository = new EntityReporitory(relationshipRepository);