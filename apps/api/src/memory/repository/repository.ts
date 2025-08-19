import { Database } from 'arangojs';
import { CollectionType, DocumentCollection, EdgeCollection } from 'arangojs/collections';
import { InsertDocumentOptions } from 'arangojs/documents';
import { EnsurePersistentIndexOptions } from 'arangojs/indexes';
import z from 'zod';

import { env } from '@/env';

export abstract class DocumentRepository<Model = any> {
  protected abstract indexes: EnsurePersistentIndexOptions[];
  protected abstract schema: z.ZodSchema<Model>;

  private db: Database;
  protected collection?: DocumentCollection;

  constructor(
    private readonly collectionName: string,
  ) {
    this.db = new Database({
      url: env.ARANGO_DB_URL!,
      databaseName: "_system",
      auth: {
        username: env.ARANGO_DB_USERNAME!,
        password: env.ARANGO_DB_PASSWORD!
      }
    });
  }

  async connect() {
    this.collection = await this.ensureCollectionExists(
      this.collectionName
    );
  }

  private async ensureCollectionExists(name: string): Promise<DocumentCollection> {
    const collection = this.db.collection(name);
  
    if (!await collection.exists()) {
      await collection.create({ type: CollectionType.DOCUMENT_COLLECTION });
      await Promise.all(this.indexes.map((index) => collection.ensureIndex(index)));
    }
  
    return collection;
  }

  async save(e: Model | Model[], opts?: InsertDocumentOptions) {
    if (!this.collection) {
      await this.connect();
    }
    if (this.collection) {
      const models = (Array.isArray(e) ? e : [e]).map((model) => {
        return this.schema.parse(model);
      })
      return this.collection.saveAll(models, opts);
    }
    throw new Error('Collection not connected');
  }
}

export abstract class EdgeRepository<Model = any> {
  protected abstract indexes: EnsurePersistentIndexOptions[];
  protected abstract schema: z.ZodSchema<Model>;

  private db: Database;
  protected collection?: EdgeCollection;

  constructor(
    private readonly collectionName: string
  ) {
    this.db = new Database({
      url: env.ARANGO_DB_URL!,
      databaseName: "_system",
      auth: {
        username: env.ARANGO_DB_USERNAME!,
        password: env.ARANGO_DB_PASSWORD!
      }
    });
  }

  async connect() {
    this.collection = await this.ensureCollectionExists(
      this.collectionName,
    );
  }

  private async ensureCollectionExists(name: string): Promise<EdgeCollection> {
    const collection = this.db.collection(name);
  
    if (!await collection.exists()) {
      await collection.create({ type: CollectionType.EDGE_COLLECTION });
      await Promise.all(this.indexes.map((index) => collection.ensureIndex(index)));
    }
  
    return collection;
  }

  async save(e: Model | Model[], opts?: InsertDocumentOptions) {
    if (!this.collection) {
      await this.connect();
    }
    if (this.collection) {
      const models = (Array.isArray(e) ? e : [e]).map((model) => {
        return this.schema.parse(model);
      })
      return this.collection.saveAll(models, opts);
    }
    throw new Error('Collection not connected');
  }
}