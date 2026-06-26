/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TextSegment {
  text: string;
  className?: string;
}

export interface FeatureCardData {
  id: string;
  type: 'video' | 'interactive';
  videoUrl?: string;
  title?: string;
  number?: string;
  icon?: string;
  checklist?: string[];
  ctaText?: string;
}
