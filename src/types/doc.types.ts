import {Content, PageOrientation, PredefinedPageSize, TDocumentInformation} from 'pdfmake/interfaces.js';

export type DocDefinition = {
  info: TDocumentInformation,
  content: Content,
  patterns: Record<string, unknown>,
  pageSize: PredefinedPageSize,
  pageOrientation: PageOrientation,
  images: Record<string, string>,
  pageMargins: number[],
  header: (currentPage: number, pageCount: number) => Content,
  footer: (currentPage: number, pageCount: number) => Content,
}