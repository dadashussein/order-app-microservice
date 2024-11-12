import { Logger, NotFoundException } from '@nestjs/common';
import {
  Connection,
  FilterQuery,
  Model,
  SaveOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

/**
 * Abstrakt Repozitoriya sinfi, MongoDB modelinə əsaslanan sənədlərlə işləmək üçün ümumi metodları təmin edir.
 *
 * @template TDocument - Abstrakt Sənəd tipini genişləndirən sənəd tipi.
 */
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  /**
   * Logger obyektini təmin edən abstrakt xüsusiyyət.
   */
  protected abstract readonly logger: Logger;

  /**
   * Yeni Abstrakt Repozitoriya obyekti yaradır.
   *
   * @param model - MongoDB modelini təmin edir.
   * @param connection - MongoDB bağlantısını təmin edir.
   */
  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  /**
   * Yeni sənəd yaradır və saxlayır.
   *
   * @param document - Yaradılacaq sənədin məlumatları.
   * @param options - Saxlama seçimləri.
   * @returns Yaradılmış sənədin JSON formatında obyekti.
   */
  async create(
    documnet: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...documnet,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  /**
   * Verilən filterQuery ilə uyğun gələn bir sənəd tapır.
   *
   * @param filterQuery - Sənədi tapmaq üçün istifadə olunan filter sorğusu.
   * @returns Tapılmış sənəd.
   * @throws NotFoundException - Sənəd tapılmadıqda atılır.
   */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });
    if (!document) {
      this.logger.warn('Document not found with filterquery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document as TDocument;
  }

  /**
   * Verilən filterQuery ilə uyğun gələn bir sənədi yeniləyir.
   *
   * @param filterQuery - Yenilənəcək sənədi tapmaq üçün istifadə olunan filter sorğusu.
   * @param update - Yeniləmə məlumatları.
   * @returns Yenilənmiş sənəd.
   * @throws NotFoundException - Sənəd tapılmadıqda atılır.
   */
  async findAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document not found', filterQuery);
      throw new NotFoundException('DOcument not found');
    }

    return document;
  }

  /**
   * Verilən filterQuery ilə uyğun gələn bir sənədi tapır və ya yenisini yaradır.
   *
   * @param filterQuery - Sənədi tapmaq üçün istifadə olunan filter sorğusu.
   * @param document - Yenilənəcək və ya yaradılacaq sənədin məlumatları.
   * @returns Yenilənmiş və ya yaradılmış sənəd.
   */
  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  /**
   * Verilən filterQuery ilə uyğun gələn sənədləri tapır.
   *
   * @param filterQuery - Sənədləri tapmaq üçün istifadə olunan filter sorğusu.
   * @returns Tapılmış sənədlərin siyahısı.
   */
  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  /**
   * Finds documents with pagination and sorting.
   *
   * @param filterQuery - The query to filter documents.
   * @param options - Pagination and sorting options.
   * @returns Paginated and sorted list of documents.
   */
  async findWithPagination(
    filterQuery: FilterQuery<TDocument>,
    options: { page?: number; limit?: number; sort?: any } = {},
  ) {
    const { page = 1, limit = 10, sort = {} } = options;
    return this.model
      .find(filterQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  /**
   * Marks a document as deleted without actually removing it.
   *
   * @param filterQuery - The query to filter the document.
   * @returns The updated document.
   */
  async softDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.deleteOne(filterQuery);
    if (!document) {
      this.logger.warn('Document not found', filterQuery);
      throw new NotFoundException('DOcument not found');
    }

    return document;
  }

  /**
   * Yeni bir MongoDB sessiyası başlayır və tranzaksiya başlatır.
   *
   * @returns Başladılmış sessiya.
   */
  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
