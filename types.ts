/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ContentFormat = 'Single' | 'Carousel' | 'Promosi' | 'Event' | 'Tutorial' | 'Tips' | 'Testimonial';

export type Tone = 
  | 'Formal' 
  | 'Santai' 
  | 'Provokatif' 
  | 'Edukatif' 
  | 'Storytelling' 
  | 'Inspiratif' 
  | 'Humoris' 
  | 'To-the-point' 
  | 'Empatik' 
  | 'Profesional' 
  | 'Misterius' 
  | 'Berani' 
  | 'Ramah' 
  | 'Elegan';

export type CopywritingStructure = 'PAS' | 'AIDA' | 'BAB' | 'ACCA' | '5 Questions' | '4U' | '4C' | 'Bebas';

export interface ContentInput {
  topic: string;
  referenceUrl: string;
  tone: Tone;
  format: ContentFormat;
  slides: number;
  structure: CopywritingStructure;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: any;
}
