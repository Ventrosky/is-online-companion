import { KeyEntry } from '../framework/contracts';
import { ProgressChallenge, ChallengeType } from './challenge';
import { Character } from './character';

export interface Variant<K extends string, T> {
    key: K;
    value: T;
}

export type NullVariant = Variant<'null', null>;

export type ChallengeSelection<K extends ChallengeType> = Variant<K, KeyEntry<ProgressChallenge<K>>>;
export type StatSelection = Variant<'stat', { stat: keyof Character['stats'] }>;
export type CharacterSheetSelection = ChallengeSelection<'vow'> | StatSelection | NullVariant;
