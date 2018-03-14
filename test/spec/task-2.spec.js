import chai from "chai";
import sinon from "sinon";
import getParallel from "../../src/task-2.js";

const assert = chai.assert;

function jsonResult(obj) {
    return new window.Response(JSON.stringify(obj), {
        status: 200,
        headers: {
            "Content-type": "application/json"
        }
    });
}

function getResponse(scode) {
    return new window.Response("", {
        status: scode,
        headers: {
            "Content-type": "text/plain"
        }
    });
}

describe("Task 2: getParallel", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200/1").resolves(jsonResult({
            hello: "world",
            world: "hello"
        }));
        fetchstub.withArgs("/test/200/2").resolves(jsonResult({
            hello: "wollo",
            world: "herld"
        }));
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

    it("should resolve", () => {

        return getParallel(["/test/200/1", "/test/200/2"])
            .then(data => {
                assert.deepEqual(data, [{ hello: "world", world: "hello" }, { hello: "wollo", world: "herld" }] );
            });
    });

    it("should reject (200 and 404)", () => {

        return getParallel(["/test/200/1", "/test/404"])
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "Not Found");
                }
            );
    });

    it("should reject (500 and 200)", () => {

        return getParallel(["/test/500", "/test/200/2"])
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "Internal Server Error");
                }
            );
    });

    it("should reject (failed and 404)", () => {

        return getParallel(["/test/dog", "/test/404"])
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "denied");
                }
            );
    });

});
