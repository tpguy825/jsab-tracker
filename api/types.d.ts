/// <reference types="vite/client" />

interface DataInfo {
	/** How far down the level is on the playlist screen */
	id: number;

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

	/** Rank (S, A, B, C, blank if unknown) */
	rank: string;

	/** Dash (0 - No dash, 1 - Slow Poke, 2 - <10 dashes, 3 - Unknown) */
	dash: number;
}
