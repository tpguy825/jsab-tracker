/// <reference types="vite/client" />

interface DataInfo {
	id: number;
	name: string;
	artist: string;
	world: string;
	checkpoints: number;
	boss: boolean;
	notes: string;
	added: string;
	rank?: string;
	dash?: number;
}
