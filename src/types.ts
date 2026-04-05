export type Tone = 'Edukatif' | 'Santai' | 'Formal' | 'Provokatif' | 'Storytelling' | 'Inspiratif' | 'Humoris' | 'To-the-point' | 'Empatik' | 'Profesional' | 'Misterius' | 'Berani' | 'Ramah' | 'Elegan';

export type ContentFormat = 'Carousel' | 'Single' | 'Promosi' | 'Event' | 'Tutorial' | 'Tips' | 'Testimonial';

export type CopywritingStructure = 'Bebas' | 'PAS' | 'AIDA' | 'BAB' | 'ACCA' | '5 Questions' | '4U' | '4C';

export interface ContentInput {
  topic: string;
  referenceUrl: string;
  tone: Tone;
  format: ContentFormat;
  slides: number;
  structure: CopywritingStructure;
}
