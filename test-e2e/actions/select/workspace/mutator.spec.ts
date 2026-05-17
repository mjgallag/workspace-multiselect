import { expect } from "@playwright/test";
import {
	getAllBlockIds,
	getBlock,
	getHighlightedBlockIds,
	getSelectedId,
	loadBlocks,
	test,
} from "../../../test";

test.beforeEach(async ({ page, act }) => {
	await act(
		loadBlocks(page, [
			{
				type: "procedures_defreturn",
				id: "block1",
				extraState: {
					params: [{ name: "param1", id: "param1" }],
				},
			},
		]),
	);
	await act(page.locator(`g[data-id="block1"] .blockly-icon-mutator`).click());
	await act(
		page.mouse.click(
			...(
				await getBlock(page, {
					workspace: { name: "mutator", mutatorOf: { id: "block1" } },
					type: "procedures_mutatorarg",
				})
			).centerTop,
		),
	);
});

test("copy and paste mutator block via keyboard", async ({ page, act }) => {
	test.fail(true);
	const mutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	const selectedMutatorBlockIds = await getHighlightedBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(selectedMutatorBlockIds).toHaveLength(1);
	await act(page.keyboard.press("Control+C"));
	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	expect(
		await getAllBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual(mutatorBlockIds);
	expect(
		await getHighlightedBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual(selectedMutatorBlockIds);
	expect(await getSelectedId(page)).toBe(selectedMutatorBlockIds[0]);

	await act(page.keyboard.press("Control+V"));
	const allMutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	expect(allMutatorBlockIds).toHaveLength(3);
	const [newMutatorBlockId] = allMutatorBlockIds.filter(
		(id) => !mutatorBlockIds.includes(id),
	);
	expect(
		await getHighlightedBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual([newMutatorBlockId]);
	expect(await getSelectedId(page)).toBe(newMutatorBlockId);
});

test("does not paste copied mutator block after mutator closes", async ({
	page,
	act,
}) => {
	test.fail(true);
	const mutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	const selectedMutatorBlockIds = await getHighlightedBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(selectedMutatorBlockIds).toHaveLength(1);
	await act(page.keyboard.press("Control+C"));
	await act(
		page
			.locator(`g[data-id="block1"] .blockly-icon-mutator`)
			.click({ timeout: 1000 }),
	);

	await act(page.keyboard.press("Control+V"));

	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	await act(
		page
			.locator(`g[data-id="block1"] .blockly-icon-mutator`)
			.click({ timeout: 1000 }),
	);
	expect(
		await getAllBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual(mutatorBlockIds);
});

test("cut and paste mutator block via keyboard", async ({ page, act }) => {
	test.fail(true);
	const mutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	const selectedMutatorBlockIds = await getHighlightedBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(selectedMutatorBlockIds).toHaveLength(1);
	const remainingMutatorBlockIds = mutatorBlockIds.filter(
		(id) => id !== selectedMutatorBlockIds[0],
	);
	await act(page.keyboard.press("Control+X"));
	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	expect(
		await getAllBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual(remainingMutatorBlockIds);
	expect(
		await getHighlightedBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual([]);
	expect(await getSelectedId(page)).not.toBe(selectedMutatorBlockIds[0]);

	await act(page.keyboard.press("Control+V"));
	const allMutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	expect(allMutatorBlockIds).toHaveLength(2);
	const [newMutatorBlockId] = allMutatorBlockIds.filter(
		(id) => !mutatorBlockIds.includes(id),
	);
	expect(
		await getHighlightedBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual([newMutatorBlockId]);
	expect(await getSelectedId(page)).toBe(newMutatorBlockId);
});

test("does not paste cut mutator block after mutator closes", async ({
	page,
	act,
}) => {
	test.fail(true);
	const mutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	const selectedMutatorBlockIds = await getHighlightedBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(selectedMutatorBlockIds).toHaveLength(1);
	const remainingMutatorBlockIds = mutatorBlockIds.filter(
		(id) => id !== selectedMutatorBlockIds[0],
	);
	await act(page.keyboard.press("Control+X"));
	await act(
		page
			.locator(`g[data-id="block1"] .blockly-icon-mutator`)
			.click({ timeout: 1000 }),
	);

	await act(page.keyboard.press("Control+V"));

	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	await act(
		page
			.locator(`g[data-id="block1"] .blockly-icon-mutator`)
			.click({ timeout: 1000 }),
	);
	expect(
		await getAllBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual(remainingMutatorBlockIds);
});

test("delete mutator block via keyboard", async ({ page, act }) => {
	test.fail(true);
	const mutatorBlockIds = await getAllBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	const selectedMutatorBlockIds = await getHighlightedBlockIds(page, {
		workspace: { name: "mutator", mutatorOf: { id: "block1" } },
	});
	expect(selectedMutatorBlockIds).toHaveLength(1);
	const remainingMutatorBlockIds = mutatorBlockIds.filter(
		(id) => id !== selectedMutatorBlockIds[0],
	);

	await act(page.keyboard.press("Delete"));

	expect(await getAllBlockIds(page)).toEqual(["block1"]);
	expect(
		await getAllBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual(remainingMutatorBlockIds);
	expect(
		await getHighlightedBlockIds(page, {
			workspace: { name: "mutator", mutatorOf: { id: "block1" } },
		}),
	).toEqual([]);
	expect(await getSelectedId(page)).not.toBe(selectedMutatorBlockIds[0]);
});
