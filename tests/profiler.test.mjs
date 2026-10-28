import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarizeFrames} from '../src/core/profiler.js';
test('frame summaries use wall time, retain long stalls and report empty samples honestly',()=>{const d=summarizeFrames(Array(99).fill(10).concat(1010),2000);assert.equal(d.fps,50);assert.equal(d.p50FrameMs,10);assert.equal(d.p99FrameMs,10);assert.ok(d.onePercentLowFps<1);assert.equal(d.droppedFramesEstimate,100);const empty=summarizeFrames([],30000);assert.equal(empty.fps,0);assert.equal(empty.onePercentLowFps,0);});
