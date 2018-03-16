import chai from "chai";
import sinon from "sinon";
import { getResponse, jsonResult } from "./utils.js";
import getSeries from "../../src/task-3.js";

const assert = chai.assert;

const json1 = { hello: "world", world: "hello" };
const json2 = { hello: "wollo", world: "herld" };

describe("Task 3: getSeries", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");

        fetchstub.withArgs("/test/200/1").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/2").resolves(jsonResult(json2));
        fetchstub.withArgs("/test/200/22").resolves(jsonResult(json2));
        fetchstub.withArgs("/test/404").resolves(getResponse(404));
        fetchstub.withArgs("/test/500").resolves(getResponse(500));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it("should return Promise", () => {
        
        assert.instanceOf(getSeries("/test/200/1", "/test/200/2"), Promise);
    });

    it("should correctly get", () => {

        return getSeries("/test/200/1", "/test/200/22")
            .then(data => {
                assert.deepEqual(data, [json1, json2]);
            });
    });

    it("should throw Error('first fetch failed') if first failed", () => {

        return getSeries("/test/failed", "/test/200/2")
            .then(
                () => { throw new Error("was not supposed to succeed"); }
            )
            .catch(
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "first fetch failed");
                }
            );
    });

    it("should throw Error('second fetch failed') if second failed", () => {

        return getSeries("/test/200/1", "/test/failed")
            .then(
                () => { throw new Error("was not supposed to succeed"); }
            )
            .catch(
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "second fetch failed");
                }
            );
    });

    it("should throw Error('first fetch failed') if both failed", () => {

        return getSeries("/test/failed", "/test/failed")
            .then(
                () => { throw new Error("was not supposed to succeed"); }
            )
            .catch(
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "first fetch failed");
                }
            );
    });
    
});
