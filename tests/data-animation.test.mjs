import test from "node:test";
import assert from "node:assert/strict";
import { device } from "../src/devices/mate90ProMaxCollector.js";
import { registerDevice, getDevice } from "../src/core/modelRegistry.js";
import {
  positionAt,
  partProgress,
  createAnimator,
} from "../src/core/animator.js";
import { createStore } from "../src/core/stateStore.js";
test("device and every part have unique IDs, declared source and geometry metadata", () => {
  assert.equal(device.id, "huawei-mate90-collector");
  registerDevice(device);
  assert.equal(getDevice(device.id), device);
  assert.equal(
    new Set(device.parts.map((p) => p.id)).size,
    device.parts.length,
  );
  for (const p of device.parts) {
    for (const field of [
      "parentId",
      "category",
      "displayName",
      "geometryFactory",
      "materialPreset",
      "assembledTransform",
      "explodeVector",
      "explodeOrder",
      "pickable",
      "visible",
      "facts",
      "confidence",
      "sourceUrl",
      "sourceType",
      "verifiedAt",
      "notes",
    ])
      assert.ok(field in p, p.id + ":" + field);
    assert.ok(device.categories.some((c) => c.id === p.parentId));
    assert.equal(p.explodeVector.length, 3);
    assert.equal(p.assembledTransform.position.length, 3);
    for (const f of p.facts)
      for (const k of ["sourceUrl", "sourceType", "confidence", "verifiedAt"])
        assert.ok(f[k]);
  }
});
test("official dimensions, Collector glass, memory and SKUs are retained", () => {
  assert.deepEqual(device.dimensions, {
    length: 164.5,
    width: 78.7,
    thickness: 8.15,
  });
  assert.deepEqual(device.skus, ["512 GB", "1 TB"]);
  assert.ok(device.facts.some((f) => f.value === "玄武昆仑玻璃"));
  assert.ok(device.facts.some((f) => f.value === "约 235 g"));
  assert.ok(
    device.parts
      .filter((p) => ["compute", "energy", "connection"].includes(p.category))
      .every((p) => p.confidence === "schematic"),
  );
});
test("progress endpoints and all stagger functions are monotonic", () => {
  for (let o = 0; o < 6; o++) {
    assert.equal(partProgress(0, o), 0);
    assert.equal(partProgress(1, o), 1);
    let last = 0;
    for (let i = 0; i <= 100; i++) {
      const t = partProgress(i / 100, o);
      assert.ok(t >= last && t <= 1);
      last = t;
    }
  }
  for (const p of device.parts) {
    assert.deepEqual(positionAt(p, 0), p.assembledTransform.position);
    assert.deepEqual(
      positionAt(p, 1),
      p.assembledTransform.position.map((v, i) => v + p.explodeVector[i]),
    );
  }
});
test("10 cycles of animated explode, selection, interruption and reassembly return to exact base", () => {
  const store = createStore();
  const groups = new Map(
    device.parts.map((p) => [
      p.id,
      {
        visible: true,
        position: {
          value: [],
          fromArray(a) {
            this.value = [...a];
          },
        },
      },
    ]),
  );
  const animator = createAnimator(store, { groups }, device);
  for (let cycle = 0; cycle < 10; cycle++) {
    store.set({ target: 1, playing: true });
    for (let i = 0; i < 400; i++) animator.update(1 / 60);
    assert.equal(store.get().t, 1);
    store.set({ selected: "battery" });
    for (let i = 0; i < 50; i++) animator.update(1 / 60);
    store.set({ target: 0.3, playing: true, selected: null });
    for (let i = 0; i < 20; i++) animator.update(1 / 60);
    store.set({ target: 1, playing: true });
    for (let i = 0; i < 20; i++) animator.update(1 / 60);
    store.set({ target: 0, playing: true, selected: null });
    for (let i = 0; i < 600; i++) animator.update(1 / 60);
    assert.equal(store.get().t, 0);
    for (const p of device.parts) {
      const actual = groups.get(p.id).position.value;
      assert.ok(
        actual.every(
          (v, i) => Math.abs(v - p.assembledTransform.position[i]) < 1e-10,
        ),
        p.id,
      );
      assert.equal(groups.get(p.id).visible, true);
    }
  }
});

test("second fictitious device registers without replacing any core renderer", async () => {
  const { genericDevice } = await import("../src/devices/genericTestDevice.js");
  registerDevice(genericDevice);
  assert.equal(getDevice("atlas-generic-test").edition, "虚构测试设备");
  assert.equal(genericDevice.parts.length, 4);
  assert.ok(genericDevice.parts.every((p) => p.confidence === "schematic"));
});

test("part-specific provenance warnings are not overwritten by source notes", () => {
  assert.match(device.parts.find((p) => p.id === "soc").notes, /封装尺寸/);
  assert.match(device.parts.find((p) => p.id === "flex").notes, /真实 FPC/);
});
