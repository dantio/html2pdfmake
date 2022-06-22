import {PageOrientation, PredefinedPageSize, TDocumentInformation} from 'pdfmake/interfaces.js';
import {Item} from './item.types.js';

export type DocInfo = TDocumentInformation

export type DocDefinition = {
  info: DocInfo,
  content: Item[],
  patterns: Record<string, unknown>,
  pageSize: PredefinedPageSize,
  pageOrientation: PageOrientation,
  images: Record<string, string>,
  pageMargins: number[],
  header: (currentPage: number, pageCount: number) => Item[],
  footer: (currentPage: number, pageCount: number) => Item[],
}