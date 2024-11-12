import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

/**
 * Abstrakt sənəd sinfi.
 *
 * @schema
 *
 * @property {Types.ObjectId} _id - Sənədin unikal identifikatoru.
 */
@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
