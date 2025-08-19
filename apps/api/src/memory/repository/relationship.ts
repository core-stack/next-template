
import { aql } from 'arangojs';
import { join } from 'arangojs/aql';
import { EnsurePersistentIndexOptions } from 'arangojs/indexes';
import { ZodType } from 'zod';

import { Relationship, relationshipSchema } from '@/memory/model/relationship';

import { EdgeRepository } from './repository';

export class RelationshipReporitory extends EdgeRepository<Relationship> {
  protected schema: ZodType = relationshipSchema;
  protected indexes: EnsurePersistentIndexOptions[] = [
    {
      type: 'persistent',
      fields: ['_from', '_to', 'type', 'tenantId'],
      unique: false,
      name: 'idx_rel_index',
    }
  ];

  constructor() {
    super('relationship');
  }

  async findExistingRelationshipsBulk(relationships: Relationship[]) {
    if (!this.collection) {
      this.connect();
    }
    if (relationships.length === 0) return [];
    
    const cursor = await this.collection!.database.query(aql`
      FOR r IN ${this.collection}
        FILTER ${join(relationships.map(rel => 
          aql`(r._from == ${rel._from} && r._to == ${rel._to} && r.type == ${rel.type})`), 
        ' OR ')}
        RETURN r
    `);
    return await cursor.all();
  }
}

export const relationshipRepository = new RelationshipReporitory();