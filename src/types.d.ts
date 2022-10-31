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

	/** Rank and dash amount for normal mode */
	normal: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: string;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: number;
	};

	/** Rank and dash amount for hardcore mode */
	hardcore: {
		/** Rank (S, A, B, C, blank if unknown) */
		rank: string;

		/** Dash (0 - No dash, 1 - Slow Poke, 2 - >10 dashes, 3 - Unknown) */
		dash: number;
	};
}

interface AppState {
	/** Initial server response */
	res: string;

	/** Array of levels and their info */
	table: DataInfo[];

	/** JSX for the main table */
	tablejsx: JSX.Element[];

	/** Time since the table was last updated */
	lastrefreshed: Date | string;

	/** Screen number (0 - default, 1 - edit mode) */
	screen: 0 | 1;
}

interface EditProps {
	pstate: AppState;
	psetState: React.Dispatch<React.SetStateAction<AppState>>;
}

interface Config {
	apihost: string;
	apiport: number;
	apifull: string;
	vitehost: string;
	viteport: number;
	vitefull: string;
}

interface PartialConfig {
	apihost: string;
	apiport: number;
	vitehost: string;
	viteport: number;
}

