import {Item} from './item.types.js';

export type DocInfo = {
  title: string
  author?: string
  creator?: string
  producer?: string
  subject?: string
  keywords?: string
}

export type DocDefinition = {
  info: DocInfo,
  content: Item[],
  patterns: Record<string, unknown>,
  pageSize: string,
  pageOrientation: 'portrait' | 'landscape',
  images: Record<string, string>,
  pageMargins: number[],
  header: (currentPage: number, pageCount: number) => Item[],
  footer: (currentPage: number, pageCount: number) => Item[],
}