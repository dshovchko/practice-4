import chai from "chai";
import sinon from "sinon";
import { getResponse, jsonResult } from "./utils.js";
import getParallel from "../../src/task-2.js";

const assert = chai.assert;

const json1 = { hello: "world", world: "hello" };
const json2 = { hello: "wollo", world: "herld" };

describe("Task 2: getParallel", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200/1").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/2").resolves(jsonResult(json2));
        fetchstub.withArgs("/test/404").resolves(getResponse(404));
        fetchstub.withArgs("/test/500").resolves(getResponse(500));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it("should return Promise", () => {
        
        assert.instanceOf(getParallel(["/test/200/1"]), Promise);
    });

    it("should resolve", () => getParallel(["/test/200/1", "/test/200/2"])
        .then(data => {
            assert.deepEqual(data, [json1, json2]);
        })
    );

    it("should reject [200, 404]", () => getParallel(["/test/200/1", "/test/404"])
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "denied");
            }
        )
    );

    it("should reject [500, 200]", () => getParallel(["/test/500", "/test/200/2"])
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "denied");
            }
        )
    );

    it("should reject [fail, 404]", () => getParallel(["/test/dog", "/test/404"])
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "denied");
            }
        )
    );

});
