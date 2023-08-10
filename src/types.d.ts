/// <reference types="vite/client" />
/// <reference types="preact" />
/// <reference types="preact/jsx-runtime" />

interface DataInfo {
	/** How far down the level is on the playlist screen */
	id: IDRange;

	/** Track name */
	name: string;

	/** Track author */
	artist: string;

	/** Track world/chapter */
	world: string;

	/** Amount of checkpoints */
	checkpoints: number;

	/** Is it a bossfight? */
	boss: boolean;

	/** Notes about the level */
	notes: string;

	/** Version added */
	added: string;

	/** Rank and dash amount for normal mode */
	normal: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};
}

type IDRange = IntRange<1, 54>;

interface TrackInfo {
	/** How far down the level is on the playlist screen */
	id: IDRange;

	/** Track name */
	name: string;

	/** Track author */
	artist: string;

	/** Track world/chapter */
	world: string;

	/** Amount of checkpoints */
	checkpoints: number;

	/** Is it a bossfight? */
	boss: boolean;

	/** Notes about the level */
	notes: string;

	/** Version added */
	added: string;
}

interface RankInfo {
	/** How far down the level is on the playlist screen */
	id: IDRange;

	/** Rank and dash amount for normal mode */
	normal: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: Rank;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: DashCount;
	};
}

/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
type DashCount = IntRange<0, 4>;

/** Rank (S, A, B, C, blank if unknown) */
type Rank = "S" | "A" | "B" | "C" | "";

interface AppState {
	/** JSX for the main table */
	table?: JSX.Element[];

	/** Levels info */
	data?: Record<IDRange, DataInfo>;
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc["length"]]>;

/**
 * ```typescript
// Type version of
if (x <= n < y) {}
// where 
const num: IntRange<x, y> = n

// Examples:
const num: IntRange<1, 10> = 5  // ✅ works
const num: IntRange<1, 10> = 1  // ✅ works
const num: IntRange<1, 10> = 11 // ❌ error
const num: IntRange<1, 10> = 10 // ❌ error
```
 */
type IntRange<X extends number, Y extends number> = Exclude<Enumerate<Y>, Enumerate<X>>;

