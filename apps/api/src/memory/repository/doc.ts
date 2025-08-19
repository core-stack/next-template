import { InsertDocumentOptions } from 'arangojs/documents';
import { EnsurePersistentIndexOptions } from 'arangojs/indexes';
import { ZodType } from 'zod';

import { Doc, docSchema } from '@/memory/model/doc';
import { Relationship } from '@/memory/model/relationship';

import { RelationshipReporitory, relationshipRepository } from './relationship';
import { DocumentRepository } from './repository';

export class DocReporitory extends DocumentRepository<Doc> {
  protected schema: ZodType = docSchema;
  protected indexes: EnsurePersistentIndexOptions[] = [
    {
      type: 'persistent',
      fields: ['tenantId'],
      name: 'idx_tenant',
    },
  ];

  constructor(private relationshipRepository: RelationshipReporitory) {
    super('doc');
  }

  async saveWithRelations(e: Doc | Doc[], rel: Relationship | Relationship[], opts?: InsertDocumentOptions) {
    if (!this.collection) {
      this.connect();
    }
    await this.save(e, opts);
    await this.relationshipRepository.save(rel);
  }
}

export const docRepository = new DocReporitory(relationshipRepository);