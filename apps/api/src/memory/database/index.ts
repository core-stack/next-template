import { Database } from 'arangojs';
import { CollectionType, DocumentCollection, EdgeCollection } from 'arangojs/collections';
import { EnsurePersistentIndexOptions } from 'arangojs/indexes';

import { env } from '@/env';

import { Doc } from '../model/doc';
import { Entity } from '../model/entity';
import { Relationship } from '../model/relationship';
import { Source, sourceSchema } from '../model/source';

const database = new Database({
  url: env.ARANGO_DB_URL!,
  databaseName: "_system",
  auth: {
    username: env.ARANGO_DB_USERNAME!,
    password: env.ARANGO_DB_PASSWORD!
  }
});

const ensureCollectionExists = async (name: string, type: CollectionType, indexes: EnsurePersistentIndexOptions[]): Promise<DocumentCollection<any, any> & EdgeCollection<any, any>> => {
  const collection = database.collection(name);

  if (!await collection.exists()) {
    await collection.create({ type });
    await Promise.all(indexes);
  }

  return collection;
}
let sourceCollection: DocumentCollection;
let docCollection: DocumentCollection;
let entityCollection: DocumentCollection;
let relationshipCollection: EdgeCollection;

export const setupDatabase = async () => {
  sourceCollection = await ensureCollectionExists(
    "sources",
    CollectionType.DOCUMENT_COLLECTION, 
    [{ type: 'persistent', fields: ['tenantId'], name: 'idx_tenant' }]
  );
  docCollection = await ensureCollectionExists(
    "docs",
    CollectionType.DOCUMENT_COLLECTION,
    [{ type: 'persistent', fields: ['tenantId'], name: 'idx_tenant' }]
  )
  entityCollection = await ensureCollectionExists(
    "entities",
    CollectionType.DOCUMENT_COLLECTION,
    [
      { type: 'persistent', fields: ['tenantId'], name: 'idx_tenant' },
      { type: 'persistent', fields: ['tenantId', 'name', 'type'], unique: true, name: 'idx_unique_entity' }
    ]
  )
  relationshipCollection = await ensureCollectionExists(
    "relationships",
    CollectionType.EDGE_COLLECTION,
    [
      { type: 'persistent', fields: ['_from', '_to', 'type', 'tenantId'], unique: false, name: 'idx_rel_index' }
    ]
  );
}

export const saveSource = async (source: Source) => {
  await sourceCollection.save(sourceSchema.parse(source));
}

export const saveEntitiesWithRelations = async (e: Entity | Entity[], rel: Relationship | Relationship[]) => {
  const entities = Array.isArray(e) ? e : [e];
  const relations = Array.isArray(rel) ? rel : [rel];
  await entityCollection.saveAll(entities, { overwriteMode: "replace" });
  await relationshipCollection.saveAll(relations, { overwriteMode: "update" });
}

export const saveDocsWithRelations = async (d: Doc | Doc[], rel: Relationship | Relationship[]) => {
  const docs = Array.isArray(d) ? d : [d];
  const relations = Array.isArray(rel) ? rel : [rel];
  await docCollection.saveAll(docs, { overwriteMode: "replace" });
  await relationshipCollection.saveAll(relations, { overwriteMode: "update" });
}