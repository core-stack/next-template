import { InsertDocumentOptions } from 'arangojs/documents';
import { EnsurePersistentIndexOptions } from 'arangojs/indexes';
import { ZodType } from 'zod';

import { Doc } from '@/memory/model/doc';
import { Relationship } from '@/memory/model/relationship';

import { Source, sourceSchema } from '../model/source';
import { RelationshipReporitory, relationshipRepository } from './relationship';
import { DocumentRepository } from './repository';

export class SourceReporitory extends DocumentRepository<Doc> {
  protected schema: ZodType = sourceSchema;
  protected indexes: EnsurePersistentIndexOptions[] = [
    {
      type: 'persistent',
      fields: ['tenantId'],
      name: 'idx_tenant',
    },
  ];

  constructor(private relationshipRepository: RelationshipReporitory) {
    super('source');
  }

  async saveWithRelations(e: Source | Source[], rel: Relationship | Relationship[], opts?: InsertDocumentOptions) {
    await this.save(e, opts);
    await this.relationshipRepository.save(rel);
  }
}

export const sourceRepository = new SourceReporitory(relationshipRepository);