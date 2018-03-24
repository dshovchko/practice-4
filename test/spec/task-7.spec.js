import chai from "chai";
import sinon from "sinon";
import { getResponse, jsonResult } from "./utils.js";
import getSequential from "../../src/task-7.js";

const assert = chai.assert;

const json1 = { hello: "world", world: "hello" };
const json2 = { hello: "wollo", world: "herld" };
const json3 = { hello: "olloh", world: "dlrow" };

describe("Task 8: getSequential", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/1").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/2").resolves(jsonResult(json2));
        fetchstub.withArgs("/test/200/3").resolves(jsonResult(json3));
        fetchstub.withArgs("/test/200/4").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/5").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/6").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/7").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/200/8").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/404").resolves(getResponse(404));
        fetchstub.withArgs("/test/500").resolves(getResponse(500));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it("should return Promise", () => {
        
        assert.instanceOf(getSequential(["/test/200"]), Promise);
    });

    it("should resolve", () => getSequential(["/test/200/1", "/test/200/2", "/test/200/3"])
        .then(data => {
            assert.deepEqual(data, [json1, json2, json3]);
        })
    );
    
    it("should reject with failed to fetch urls[0]", () => getSequential(["/test/500", "/test/200/4"])
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "failed to fetch /test/500");
            }
        )
    );

    it("should reject with failed to fetch /test/404", () => getSequential(["/test/200/5", "/test/200/6", "/test/200/7", "/test/404", "/test/200/8"])
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "failed to fetch /test/404");
            }
        )
    );

});
